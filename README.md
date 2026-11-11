# What Inventions Made Things Work

Take everyday objects apart in 3D and see the inventions that made each part possible.

Click a hotspot on the model to read about the invention behind that part: who made it, where else it is used, and how it evolved.

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

Inventor portraits are loaded at view time from Wikipedia's public page-summary API.
