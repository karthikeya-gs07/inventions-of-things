// Read-aloud using the browser's built-in speech synthesis (Web Speech API).
// No model is downloaded and nothing leaves the device: the browser or OS voice speaks.

export const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let currentId = null;
let voice = null;
const listeners = new Set();
const notify = () => listeners.forEach((cb) => cb(currentId));

// Prefer a clear English voice installed on the device
function pickVoice() {
  const voices = speechSynthesis.getVoices().filter((v) => /^en(-|_|$)/i.test(v.lang));
  const preferred = [/Google UK English Female/i, /Samantha/i, /Daniel/i, /Google US English/i, /Karen/i, /Moira/i, /Serena/i];
  for (const re of preferred) {
    const v = voices.find((x) => re.test(x.name));
    if (v) return v;
  }
  return voices.find((v) => v.localService) ?? voices[0] ?? null;
}
if (ttsSupported) {
  voice = pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', () => (voice = pickVoice()));
}

// Long utterances get cut off in some browsers, so speak sentence-sized chunks in a queue
function chunk(paragraphs) {
  const out = [];
  for (const p of paragraphs) {
    let buf = '';
    for (const s of p.split(/(?<=[.!?])\s+/)) {
      if (buf && (buf + ' ' + s).length > 220) {
        out.push(buf);
        buf = s;
      } else buf = buf ? `${buf} ${s}` : s;
    }
    if (buf) out.push(buf);
  }
  return out;
}

export function speak(id, paragraphs) {
  if (!ttsSupported) return;
  stop();
  currentId = id;
  const parts = chunk(paragraphs);
  parts.forEach((text, i) => {
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'en-GB';
    u.rate = 1;
    u.pitch = 1;
    if (i === parts.length - 1) {
      u.onend = () => {
        if (currentId === id) {
          currentId = null;
          notify();
        }
      };
    }
    u.onerror = () => {
      if (currentId === id) {
        currentId = null;
        notify();
      }
    };
    speechSynthesis.speak(u);
  });
  notify();
}

export function stop() {
  if (!ttsSupported) return;
  const was = currentId;
  currentId = null;
  speechSynthesis.cancel();
  if (was) notify();
}

export const speakingId = () => currentId;
export const onSpeechChange = (cb) => listeners.add(cb);

if (ttsSupported) window.addEventListener('pagehide', stop);
