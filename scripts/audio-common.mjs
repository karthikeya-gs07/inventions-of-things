// Shared by the audio generator and the pre-build check.
import { createHash } from 'node:crypto';
import { catalog } from '../src/products/index.js';
import { transcriptFor } from '../src/transcripts.js';

// The one voice used everywhere. Changing either value re-renders all audio.
export const VOICE = 'af_heart'; // Kokoro-82M voice (Apache-2.0)
export const SPEED = 1.0;
export const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

export const MANIFEST = new URL('../src/audio-manifest.json', import.meta.url);
export const AUDIO_DIR = new URL('../public/audio/', import.meta.url);

// Same id the app uses for the voice button: product/part/invention-index
export function* inventions() {
  for (const product of catalog)
    for (const part of product.parts)
      for (const [i, inv] of part.inventions.entries()) {
        const paragraphs = transcriptFor(product, part, inv);
        yield {
          id: `${product.id}/${part.id}/${i}`,
          name: `${product.name} › ${inv.name}`,
          file: `${product.id}/${part.id}-${i}.m4a`,
          paragraphs,
          hash: createHash('sha1').update(JSON.stringify([VOICE, SPEED, paragraphs])).digest('hex').slice(0, 16),
        };
      }
}
