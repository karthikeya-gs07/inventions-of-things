# What Inventions Made Things Work

Take everyday objects apart in 3D and see the inventions that made each part possible.

Click a hotspot on the model to read about the invention behind that part: who made it, where else it is used, and how it evolved.

## Links

- **Live site:** https://karthikeya-gs07.github.io/inventions-of-things/
- **Repository:** https://github.com/karthikeya-gs07/inventions-of-things

The live site can be installed as an app: use the install icon in Chrome's address bar, or Add to Home Screen on a phone.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production build is an installable PWA that works offline. Pushing to `main` deploys it to GitHub Pages.

## Add an object

Each object is one file in `src/products/`, registered in `src/products/index.js`. `flashlight.js` is the template: geometry for each part, plus the inventions, inventors, uses and timeline shown in the panel.

Every invention needs `name`, `kind`, `year`, `by`, `what`, `here`, `story`, `people`, `uses` and `timeline`. `kind` says what sort of contribution it is, because not everything is strictly an invention: `invention`, `process`, `material`, `discovery`, `standard`, `technique`, `design` or `tool` (see `src/kinds.js`). An optional `kindNote` adds a one-line caveat, for example that a court ruled a patent invalid. Its read-aloud transcript (the voice button in the panel) is generated from these, worded for listening; set a `transcript` field to write one by hand instead.

### Read-aloud narration

The voice button plays a pre-recorded narration of each transcript, so it sounds the same on every device. Narration is rendered locally with the open-source [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) voice (Apache-2.0) via `kokoro-js`; no speech model runs in the visitor's browser. If a recording can't load, the browser's built-in voice reads the transcript instead.

After adding or editing an invention, render its narration and commit the result (macOS, uses the built-in `afconvert`):

```bash
npm run audio
```

`npm run check` (also run before every build) fails if any invention is missing a transcript field or its narration is missing or out of date. The voice is set in `scripts/audio-common.mjs`.

Inventor portraits are loaded at view time from Wikipedia's public page-summary API.
