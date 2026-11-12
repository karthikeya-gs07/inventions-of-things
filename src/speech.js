// Read-aloud.
//
// 1. Recorded narration (preferred): every invention's transcript is rendered ahead of time
//    with one fixed voice (scripts/generate-audio.mjs) and shipped as an audio file, so it
//    sounds identical on every device. No speech model runs in the browser.
// 2. Browser voice (fallback): if a recording is missing or fails to load, the browser's
//    built-in speech synthesis (Web Speech API) reads the same transcript.
//
// When the browser voice is used, to sound less robotic it:
//  - picks the most natural voice the device offers (neural / "Natural" / Enhanced /
//    Premium / Google voices first, never the novelty or legacy synthetic voices)
//  - reads at a slightly calmer pace
//  - speaks one sentence at a time with short breaths between sentences and longer
//    pauses between sections, instead of one long unbroken stream

import audioManifest from './audio-manifest.json';

const browserSpeech =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
const recordings = audioManifest.entries ?? {};
export const ttsSupported = browserSpeech || (typeof Audio !== 'undefined' && Object.keys(recordings).length > 0);

// Old formant-synthesis and novelty voices (macOS / iOS) that sound mechanical
const ROBOTIC = /\b(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Eddy|Flo|Fred|Good News|Grandma|Grandpa|Hysterical|Jester|Junior|Kathy|Organ|Pipe Organ|Princess|Ralph|Reed|Rocko|Sandy|Shelley|Superstar|Trinoids|Whisper|Wobble|Zarvox|eSpeak)\b/i;

// Higher score = more natural
function score(v) {
  const n = v.name;
  let s = 0;
  if (ROBOTIC.test(n)) return -1000;
  if (/Natural|Neural|Online/i.test(n)) s += 100; // Edge / Windows neural voices
  if (/Premium/i.test(n)) s += 90; // Apple, downloaded high-quality voices
  if (/Enhanced/i.test(n)) s += 80;
  if (/Siri/i.test(n)) s += 75;
  if (/^Google\b/i.test(n)) s += 60; // Chrome's server-side voices
  if (/network/i.test(n) || /-x-.*-network/i.test(v.voiceURI ?? '')) s += 55; // Android Google TTS network voices
  if (/\b(Samantha|Daniel|Karen|Moira|Serena|Ava|Allison|Susan|Tom|Evan|Nathan|Zoe|Joelle|Noelle|Kate|Oliver|Arthur|Martha|Catherine|Tessa|Rishi)\b/i.test(n)) s += 40;
  if (/en[-_]GB/i.test(v.lang)) s += 6;
  if (/en[-_]US/i.test(v.lang)) s += 5;
  if (v.default) s += 2;
  return s;
}

let voice = null;
function pickVoice() {
  const english = speechSynthesis.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang));
  english.sort((a, b) => score(b) - score(a));
  voice = english[0] && score(english[0]) > -1000 ? english[0] : null;
}
if (browserSpeech) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

// Neural and Google voices already sound natural at normal speed; others benefit from slowing a touch
const rateFor = (v) => (v && score(v) >= 55 ? 0.98 : 0.92);

const PAUSE_SENTENCE = 160; // ms between sentences
const PAUSE_SECTION = 520; // ms between paragraphs / sections

// Sentences of at most ~200 characters; very long sentences are split at commas or semicolons
function sentences(paragraph) {
  const out = [];
  for (const s of paragraph.split(/(?<=[.!?])\s+(?=[A-Z0-9“"(])/)) {
    if (s.length <= 200) {
      out.push(s);
      continue;
    }
    let buf = '';
    for (const piece of s.split(/(?<=[,;:])\s+/)) {
      if (buf && (buf + ' ' + piece).length > 200) {
        out.push(buf);
        buf = piece;
      } else buf = buf ? `${buf} ${piece}` : piece;
    }
    if (buf) out.push(buf);
  }
  return out.filter(Boolean);
}

let currentId = null;
let run = 0; // incremented on every start/stop so stale callbacks are ignored
let timer = null;
let player = null;
const listeners = new Set();
const notify = () => listeners.forEach((cb) => cb(currentId));

export function speak(id, paragraphs) {
  stop();
  const rec = recordings[id];
  if (rec && typeof Audio !== 'undefined') playRecording(id, rec, paragraphs);
  else speakWithBrowser(id, paragraphs);
}

// play() is called straight from the click, which mobile browsers require for audio
function playRecording(id, rec, paragraphs) {
  currentId = id;
  const token = ++run;
  const a = new Audio(`${import.meta.env.BASE_URL}audio/${rec.file}`);
  player = a;
  const fallBack = () => {
    if (token !== run) return;
    player = null;
    speakWithBrowser(id, paragraphs);
  };
  a.addEventListener('ended', () => {
    if (token !== run) return;
    player = null;
    currentId = null;
    notify();
  });
  a.addEventListener('error', fallBack);
  a.play().catch(fallBack);
  notify();
}

function speakWithBrowser(id, paragraphs) {
  if (!browserSpeech) {
    currentId = null;
    return notify();
  }
  if (!voice) pickVoice();
  currentId = id;
  const token = ++run;

  // Queue of [text, pause after it]
  const queue = [];
  paragraphs.forEach((p) => {
    const ss = sentences(p);
    ss.forEach((s, i) => queue.push([s, i === ss.length - 1 ? PAUSE_SECTION : PAUSE_SENTENCE]));
  });

  const finish = () => {
    if (token !== run) return;
    currentId = null;
    notify();
  };

  const next = (i) => {
    if (token !== run) return;
    if (i >= queue.length) return finish();
    const [text, pause] = queue[i];
    const u = new SpeechSynthesisUtterance(text);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else u.lang = 'en-GB';
    u.rate = rateFor(voice);
    u.pitch = 1;
    u.onend = () => {
      if (token !== run) return;
      timer = setTimeout(() => next(i + 1), pause);
    };
    u.onerror = (e) => {
      if (token !== run) return;
      // "interrupted"/"canceled" come from our own stop(); anything else, carry on
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      timer = setTimeout(() => next(i + 1), pause);
    };
    speechSynthesis.speak(u);
  };

  next(0);
  notify();
}

export function stop() {
  run++;
  clearTimeout(timer);
  if (player) {
    player.pause();
    player.removeAttribute('src');
    player = null;
  }
  const was = currentId;
  currentId = null;
  if (browserSpeech) speechSynthesis.cancel();
  if (was) notify();
}

export const speakingId = () => currentId;
export const onSpeechChange = (cb) => listeners.add(cb);
export const currentVoice = () => voice;
export const hasRecording = (id) => !!recordings[id];

if (typeof window !== 'undefined') window.addEventListener('pagehide', stop);
