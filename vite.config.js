import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// After the build, list every emitted file inside the service worker so the
// whole app is cached on first visit and works offline from then on.
function precacheServiceWorker() {
  let outDir;
  return {
    name: 'precache-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    closeBundle() {
      const walk = (dir) =>
        readdirSync(dir).flatMap((name) => {
          const path = join(dir, name);
          return statSync(path).isDirectory() ? walk(path) : [path];
        });
      const files = walk(outDir)
        .map((path) => relative(outDir, path).split('\\').join('/'))
        .filter((url) => url !== 'sw.js' && !url.endsWith('.map') && !url.startsWith('audio/'));
      const hash = createHash('sha256');
      for (const url of files.sort()) hash.update(url).update(readFileSync(join(outDir, url)));
      const swPath = join(outDir, 'sw.js');
      hash.update(readFileSync(swPath)); // a change to the worker itself is also a new version
      writeFileSync(
        swPath,
        readFileSync(swPath, 'utf8')
          .replace("'__SW_VERSION__'", JSON.stringify(hash.digest('hex').slice(0, 12)))
          .replace('self.__PRECACHE__ || []', JSON.stringify(files))
      );
    },
  };
}

export default defineConfig({
  base: './', // relative paths, so the build works at a domain root or under a subpath (GitHub Pages)
  plugins: [precacheServiceWorker()],
  build: { chunkSizeWarningLimit: 1200 },
});
