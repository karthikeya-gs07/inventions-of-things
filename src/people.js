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
  'Koh-i-Noor': 'Koh-i-Noor_Hardtmuth', 'Borrowdale': 'Borrowdale',
  // "Through time" timelines: people without their own article -> the page that covers their work
  'Tredwell': 'Upholstery_coil_springs', 'Heinrich Westphal': 'List_of_German_inventions_and_discoveries',
  'William J. Newton': 'Light_switch', 'Herbert Maruska': 'History_of_the_LED',
  'Gower': 'Anodizing', 'O’Brien': 'Anodizing', 'Joseph Reckendorfer': 'Hymen_Lipman',
  'Reckendorfer v. Faber': 'Hymen_Lipman', 'William Munroe': 'Pencil#United_States',
  'Lassimonne': 'Pencil_sharpener', 'Thierry des Estivaux': 'Pencil_sharpener', 'Walter K. Foster': 'Pencil_sharpener',
  'Junichi Miura': 'Incandescent_light_bulb',
  // Companies, institutions and named things in those timelines
  'Sony': 'Sony', 'Bayer': 'Bayer', 'General Electric': 'General_Electric', 'GE': 'General_Electric',
  'Thomson-Houston': 'Thomson-Houston_Electric_Company', 'Westinghouse': 'Westinghouse_Electric_Corporation',
  'Ediswan': 'Edison_and_Swan_Electric_Light_Company', 'Ever-Ready Sharp': 'Mechanical_pencil', 'Sharp': 'Sharp_Corporation',
  'Apollo': 'Apollo_program', 'Wright Flyer': 'Wright_Flyer', 'Washington Monument': 'Washington_Monument',
  'Nobel Prize in Physics': 'Nobel_Prize_in_Physics', 'Supreme Court': 'Supreme_Court_of_the_United_States',
  'Stanford': 'Stanford_University', 'Mesoamericans': 'Mesoamerica',
  // Bicycle
  'Karl Drais': 'Karl_Drais', 'Drais': 'Karl_Drais', 'Pierre Michaux': 'Pierre_Michaux', 'Michaux': 'Pierre_Michaux',
  'Pierre Lallement': 'Pierre_Lallement', 'Lallement': 'Pierre_Lallement', 'John Kemp Starley': 'John_Kemp_Starley',
  'James Starley': 'James_Starley', 'Starley': 'John_Kemp_Starley', 'Rover': 'John_Kemp_Starley',
  'Harry John Lawson': 'Harry_John_Lawson', 'Lawson': 'Harry_John_Lawson', 'Dunlop': 'John_Boyd_Dunlop',
  'Robert William Thomson': 'Robert_William_Thomson', 'George Cayley': 'George_Cayley', 'Eugène Meyer': 'Eugène_Meyer_(inventor)',
  'Philip Vaughan': 'Philip_Vaughan', 'Suriray': 'Jules_Suriray', 'James Moore': 'James_Moore_(cyclist)', 'SKF': 'SKF',
  'Mannesmann': 'Mannesmann', 'Brooks': 'Brooks_England', 'Leonardo da Vinci': 'Leonardo_da_Vinci',
  'James Fussell': 'Roller_chain', 'Renold': 'Hans_Renold', 'Van Anden': 'Freewheel',
  'Browett and Harrison': 'Bicycle_brake', 'Tour de France': 'Tour_de_France', 'penny-farthing': 'Penny-farthing',
  // Padlock
  'Jorvik': 'Scandinavian_York', 'Christopher Polhem': 'Christopher_Polhem', 'Linus Yale Jr.': 'Linus_Yale_Jr.',
  'Linus Yale Sr.': 'Linus_Yale_Sr.', 'Harry Soref': 'Harry_Soref', 'Soref': 'Harry_Soref', 'Master Lock': 'Master_Lock',
  'Yale': 'Yale_(company)', 'Benjamin Huntsman': 'Benjamin_Huntsman', 'Bessemer': 'Henry_Bessemer',
  'Khorsabad': 'Dur-Sharrukin', 'Fritz Hofmann': 'Fritz_Hofmann_(chemist)', 'Tokuji Hayakawa': 'Tokuji_Hayakawa',
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
