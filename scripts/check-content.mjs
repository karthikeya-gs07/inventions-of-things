// Runs before every build (see package.json). Fails the build if any invention is
// missing the content its read-aloud transcript is built from, so every invention
// added in future automatically gets a complete transcript.
import { catalog } from '../src/products/index.js';
import { TRANSCRIPT_FIELDS, transcriptFor } from '../src/transcripts.js';

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
      if (!problems.some((p) => p.startsWith(where))) {
        const words = transcriptFor(product, part, inv).join(' ').split(/\s+/).length;
        if (words < 80) problems.push(`${where}: transcript is only ${words} words`);
      }
    }
  }
}
if (problems.length) {
  console.error(`Read-aloud transcripts: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Read-aloud transcripts: all ${count} inventions OK`);
