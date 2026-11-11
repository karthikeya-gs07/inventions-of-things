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

// Names that appear inside timeline sentences, linked to their Wikipedia article.
// Only people with an existing article are listed (checked against Wikipedia).
// Matching is case-sensitive and whole-word; longer phrases win over shorter ones.
const NAMES = {
  'Archytas': 'Archytas', 'Henry Maudslay': 'Henry_Maudslay', 'Whitworth': 'Joseph_Whitworth',
  'William Sellers': 'William_Sellers', 'Robert Hooke': 'Robert_Hooke', 'Hans Christian Ørsted': 'Hans_Christian_Ørsted',
  'Hall': 'Charles_Martin_Hall', 'Héroult': 'Paul_Héroult', 'Karl Bayer': 'Carl_Josef_Bayer',
  'Luigi Galvani': 'Luigi_Galvani', 'Volta': 'Alessandro_Volta', 'Nicholson': 'William_Nicholson_(chemist)',
  'Carlisle': 'Anthony_Carlisle', 'Daniell': 'John_Frederic_Daniell', 'Gaston Planté': 'Gaston_Planté',
  'Carl Gassner': 'Carl_Gassner', 'Waldemar Jungner': 'Waldemar_Jungner', 'Urry': 'Lewis_Urry',
  'Holmes': 'John_Henry_Holmes', 'H. J. Round': 'H._J._Round', 'Oleg Losev': 'Oleg_Losev',
  'Holonyak': 'Nick_Holonyak', 'M. George Craford': 'M._George_Craford', 'Wally Rhines': 'Wally_Rhines',
  'Akasaki': 'Isamu_Akasaki', 'Amano': 'Hiroshi_Amano', 'Nakamura': 'Shuji_Nakamura',
  'Diocles': 'Diocles_(mathematician)', 'John Hadley': 'John_Hadley', 'William Hutchinson': 'William_Hutchinson_(privateer)',
  'Heinrich Hertz': 'Heinrich_Hertz', 'Grote Reber': 'Grote_Reber', 'Alfred Einhorn': 'Alfred_Einhorn',
  'Schnell': 'Hermann_Josef_Schnell', 'Fox': 'Daniel_Fox_(chemist)', 'Humphry Davy': 'Humphry_Davy',
  'Swan': 'Joseph_Swan', 'Edison': 'Thomas_Edison', 'Just': 'Alexander_Just', 'Hanaman': 'Franjo_Hanaman',
  'Langmuir': 'Irving_Langmuir', 'Marvin Pipkin': 'Marvin_Pipkin', 'Coolidge': 'William_D._Coolidge',
  'Otto von Guericke': 'Otto_von_Guericke', 'Sprengel': 'Hermann_Sprengel', 'William Crookes': 'William_Crookes',
  'J. J. Thomson': 'J._J._Thomson', 'Conté': 'Nicolas-Jacques_Conté', 'Hymen Lipman': 'Hymen_Lipman',
  'Lipman': 'Hymen_Lipman', 'Joseph Hardtmuth': 'Joseph_Hardtmuth', 'Nairne': 'Edward_Nairne',
  'Joseph Priestley': 'Joseph_Priestley', 'Goodyear': 'Charles_Goodyear', 'Thomas Hancock': 'Thomas_Hancock_(inventor)',
  'John Boyd Dunlop': 'John_Boyd_Dunlop',
  // People with no article of their own link to the page that covers their work
  'David Misell': 'Eveready_Battery_Company', 'Conrad Hubert': 'Eveready_Battery_Company',
  'Bernacottis': 'Pencil#Wood_encasement',
  // Companies, products and places named in the evolution timelines
  'Eveready': 'Eveready_Battery_Company', 'Maglite': 'Maglite', 'Hardtmuth': 'Koh-i-Noor_Hardtmuth',
  'Koh-i-Noor': 'Koh-i-Noor_Hardtmuth', 'Borrowdale': 'Borrowdale', 'Fritz Hofmann': 'Fritz_Hofmann_(chemist)', 'Tokuji Hayakawa': 'Tokuji_Hayakawa',
};

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NAME_RE = new RegExp(
  `(?<![\\p{L}])(${Object.keys(NAMES).sort((a, b) => b.length - a.length).map(escape).join('|')})(?![\\p{L}])`,
  'gu'
);

export const wikiUrl = (title) => {
  const [page, section] = title.split('#');
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(page)}${section ? `#${section}` : ''}`;
};

// Wraps known names in a sentence with links that open Wikipedia in a new tab
export function linkNames(text) {
  return text.replace(
    NAME_RE,
    (name) => `<a class="wiki" href="${wikiUrl(NAMES[name])}" target="_blank" rel="noopener" title="Open ${name} on Wikipedia in a new tab">${name}</a>`
  );
}
