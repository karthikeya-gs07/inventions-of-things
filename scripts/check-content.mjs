// Runs before every build (see package.json). Fails the build if any invention is
// missing the content its read-aloud transcript is built from, so every invention
// added in future automatically gets a complete transcript.
import { catalog } from '../src/products/index.js';
import { TRANSCRIPT_FIELDS, transcriptFor } from '../src/transcripts.js';
import { KINDS } from '../src/kinds.js';
import { existsSync, readFileSync } from 'node:fs';
import { AUDIO_DIR, MANIFEST, inventions } from './audio-common.mjs';

const problems = [];
let count = 0;
for (const product of catalog) {
  for (const part of product.parts) {
    for (const inv of part.inventions) {
      count++;
      const where = `${product.id} › ${part.id} › ${inv.name ?? '(unnamed)'}`;
      if (!inv.transcript) {
        for (const f of TRANSCRIPT_FIELDS) {
          const v = inv[f];
          if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) problems.push(`${where}: missing "${f}"`);
        }
      }
      if (inv.kind && !KINDS[inv.kind]) problems.push(`${where}: unknown kind "${inv.kind}" (use one of ${Object.keys(KINDS).join(', ')})`);
      if (!problems.some((p) => p.startsWith(where))) {
        const words = transcriptFor(product, part, inv).join(' ').split(/\s+/).length;
        if (words < 80) problems.push(`${where}: transcript is only ${words} words`);
      }
    }
  }
}
// Recorded narration must exist and match the current transcript text
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { entries: {} };
const stale = [];
for (const n of inventions()) {
  const rec = manifest.entries[n.id];
  if (!rec || !existsSync(new URL(rec.file, AUDIO_DIR))) stale.push(`${n.name}: no recorded narration`);
  else if (rec.hash !== n.hash) stale.push(`${n.name}: narration is out of date (transcript changed)`);
}
if (stale.length) problems.push(...stale, 'Run "npm run audio" to render the missing narration, then commit public/audio and src/audio-manifest.json.');

if (problems.length) {
  console.error(`Read-aloud transcripts: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Read-aloud: all ${count} inventions have a transcript and recorded narration`);
