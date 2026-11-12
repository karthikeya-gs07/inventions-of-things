// Renders every invention's read-aloud transcript to an audio file with one fixed voice
// (Kokoro-82M, run locally on this machine; nothing runs in the visitor's browser).
// Only inventions whose transcript changed since the last run are re-rendered.
//
//   npm run audio            render new or changed narrations
//   npm run audio -- --all   re-render everything
//
// Needs macOS (uses the built-in `afconvert` to compress to AAC .m4a).
import { KokoroTTS } from 'kokoro-js';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AUDIO_DIR, MANIFEST, MODEL, SPEED, VOICE, inventions } from './audio-common.mjs';

const all = process.argv.includes('--all');
const audioDir = fileURLToPath(AUDIO_DIR);
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { entries: {} };
const todo = [...inventions()].filter(
  (n) => all || manifest.entries[n.id]?.hash !== n.hash || !existsSync(join(audioDir, n.file))
);

if (!todo.length) {
  console.log('Audio is up to date.');
  process.exit(0);
}
console.log(`Rendering ${todo.length} narration(s) with ${VOICE}…`);
const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'q8', device: 'cpu' });

const PAUSE_SENTENCE = 0.22; // seconds of silence between sentences
const PAUSE_SECTION = 0.6; // and between sections
const sentences = (p) => p.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/).filter(Boolean);

function wav(samples, rate) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  return buf;
}

const save = () => {
  manifest.voice = VOICE;
  manifest.entries = Object.fromEntries(Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
};

for (const [k, n] of todo.entries()) {
  const t0 = performance.now();
  const chunks = [];
  let rate = 24000;
  for (const [pi, p] of n.paragraphs.entries()) {
    const ss = sentences(p);
    for (const [si, s] of ss.entries()) {
      const out = await tts.generate(s, { voice: VOICE, speed: SPEED });
      rate = out.sampling_rate;
      chunks.push(out.audio);
      const last = pi === n.paragraphs.length - 1 && si === ss.length - 1;
      if (!last) chunks.push(new Float32Array(Math.round(rate * (si === ss.length - 1 ? PAUSE_SECTION : PAUSE_SENTENCE))));
    }
  }
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const samples = new Float32Array(total);
  let o = 0;
  for (const c of chunks) samples.set(c, o), (o += c.length);

  const out = join(audioDir, n.file);
  mkdirSync(dirname(out), { recursive: true });
  const tmp = join(tmpdir(), `narration-${process.pid}.wav`);
  writeFileSync(tmp, wav(samples, rate));
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '40000', tmp, out]);
  rmSync(tmp);

  const seconds = Math.round(total / rate);
  manifest.entries[n.id] = { file: n.file, hash: n.hash, seconds };
  save(); // after each one, so an interrupted run keeps its progress
  console.log(`[${k + 1}/${todo.length}] ${n.name}: ${seconds}s of audio in ${((performance.now() - t0) / 1000).toFixed(0)}s`);
}
console.log('Done.');
