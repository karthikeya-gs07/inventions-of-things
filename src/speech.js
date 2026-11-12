// Read-aloud using the browser's built-in speech synthesis (Web Speech API).
// No model is downloaded and nothing leaves the device: the browser or OS voice speaks.
//
// To sound less robotic it:
//  - picks the most natural voice the device offers (neural / "Natural" / Enhanced /
//    Premium / Google voices first, never the novelty or legacy synthetic voices)
//  - reads at a slightly calmer pace
//  - speaks one sentence at a time with short breaths between sentences and longer
//    pauses between sections, instead of one long unbroken stream

export const ttsSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

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
if (ttsSupported) {
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
const listeners = new Set();
const notify = () => listeners.forEach((cb) => cb(currentId));

export function speak(id, paragraphs) {
  if (!ttsSupported) return;
  stop();
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
  if (!ttsSupported) return;
  run++;
  clearTimeout(timer);
  const was = currentId;
  currentId = null;
  speechSynthesis.cancel();
  if (was) notify();
}

export const speakingId = () => currentId;
export const onSpeechChange = (cb) => listeners.add(cb);
export const currentVoice = () => voice;

if (ttsSupported) window.addEventListener('pagehide', stop);
