// Inventor portraits come from Wikipedia's public page-summary API at view time.
// Only the article title is sent. People with no article or no photo simply show no picture.
const cache = new Map();

export function portrait(wiki) {
  if (!wiki) return Promise.resolve(null);
  if (!cache.has(wiki)) {
    cache.set(
      wiki,
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wiki)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => j?.thumbnail?.source ?? null)
        .catch(() => null)
    );
  }
  return cache.get(wiki);
}
