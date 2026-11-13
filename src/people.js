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
  // Headphones
  'Nathaniel Baldwin': 'Nathaniel_Baldwin', 'Baldwin': 'Nathaniel_Baldwin', 'John C. Koss': 'Koss_Corporation',
  'Walkman': 'Walkman', 'Bose': 'Bose_(brand)', 'Blumlein': 'Alan_Blumlein', 'Paris Opera': 'Théâtrophone',
  'NASA': 'NASA', 'Fagerdala': 'Fagerdala_World_Foams', 'Tempur-Pedic': 'Tempur-Pedic', 'Ernst Siemens': 'Werner_von_Siemens',
  'Oliver Lodge': 'Oliver_Lodge', 'Peter Jensen': 'Peter_L._Jensen', 'Edwin Pridham': 'Magnavox',
  'Rice': 'Chester_W._Rice', 'Kellogg': 'Edward_W._Kellogg', 'General Motors': 'General_Motors',
  'Sumitomo Special Metals': 'Neodymium_magnet', 'Paul Lueg': 'Active_noise_control', 'Lawrence Fogel': 'Lawrence_J._Fogel',
  'Willard Meeker': 'Active_noise_control', 'Sessler': 'Gerhard_M._Sessler', 'Nils Rydbeck': 'Bluetooth#History',
  'Ericsson': 'Ericsson', 'Haartsen': 'Jaap_Haartsen', 'Mattisson': 'Bluetooth#History', 'Jim Kardach': 'Bluetooth#Etymology',
  'Bluetooth Special Interest Group': 'Bluetooth_Special_Interest_Group', 'Whittingham': 'M._Stanley_Whittingham',
  'Goodenough': 'John_B._Goodenough', 'Yoshino': 'Akira_Yoshino', 'Asahi Kasei': 'Asahi_Kasei',
  'Nobel Prize in Chemistry': 'Nobel_Prize_in_Chemistry',
  // Mirrorless camera
  'Leica I': 'Leica_Camera', 'Leica': 'Leica_Camera', 'Ernst Leitz': 'Leica_Camera', 'Leitz': 'Leica_Camera',
  'Steven Sasson': 'Steven_Sasson', 'Sasson': 'Steven_Sasson', 'Kodak': 'Kodak', 'Epson R-D1': 'Epson_R-D1',
  'Panasonic Lumix G1': 'Panasonic_Lumix_DMC-G1', 'Sony α7': 'Sony_α7', 'Sony Alpha 7': 'Sony_α7', 'Nikon': 'Nikon', 'Canon': 'Canon_Inc.',
  'Barnack': 'Oskar_Barnack', 'Photokina': 'Photokina', 'Konica C35 AF': 'Konica_C35_AF',
  'Polaroid SX-70 Sonar OneStep': 'Polaroid_SX-70', 'Pentax ME F': 'Pentax_ME_F', 'Minolta 7000': 'Minolta_Maxxum_7000',
  'Lord Rayleigh': 'John_William_Strutt,_3rd_Baron_Rayleigh', 'Harold Dennis Taylor': 'Harold_Dennis_Taylor',
  'Smakula': 'Alexander_Smakula', 'Carl Zeiss': 'Carl_Zeiss_AG', 'William England': 'Focal-plane_shutter',
  'Anschütz': 'Ottomar_Anschütz', 'Goerz': 'Goerz_(company)', 'Peter Noble': 'Active-pixel_sensor', 'Bell Labs': 'Bell_Labs',
  'Olympus': 'Olympus_Corporation', 'Jet Propulsion Laboratory': 'Jet_Propulsion_Laboratory', 'Fossum': 'Eric_Fossum',
  'Sabrina Kemeny': 'Eric_Fossum', 'Bryce Bayer': 'Bryce_Bayer', 'André Bernanose': 'OLED#History',
  'Tang': 'Ching_Wan_Tang', 'Van Slyke': 'Steven_Van_Slyke', 'Friedrich Reinitzer': 'Friedrich_Reinitzer',
  'Richard Williams': 'Liquid-crystal_display#History', 'RCA': 'RCA', 'Martin Schadt': 'Martin_Schadt',
  'Wolfgang Helfrich': 'Wolfgang_Helfrich', 'Mavica': 'Sony_Mavica', 'Fujifilm': 'Fujifilm', 'Masuoka': 'Fujio_Masuoka',
  'Toshiba': 'Toshiba', 'Intel': 'Intel',
  // Wireless charger
  'Michael Faraday': 'Michael_Faraday', 'Faraday': 'Michael_Faraday', 'Nikola Tesla': 'Nikola_Tesla', 'Tesla': 'Nikola_Tesla',
  'Wireless Power Consortium': 'Wireless_Power_Consortium', 'Qi': 'Qi_(standard)', 'Nokia Lumia 920': 'Nokia_Lumia_920',
  'Kipping': 'Frederic_Kipping', 'Hyde': 'James_Franklin_Hyde', 'Corning Glass Works': 'Corning_Inc.', 'Dow Corning': 'Dow_Corning',
  'Joseph Henry': 'Joseph_Henry', 'Maurice Leblanc': 'Maurice_Leblanc_(engineer)', 'Maurice Hutin': 'Wireless_power_transfer#History',
  'Wardenclyffe': 'Wardenclyffe_Tower', 'Kato': 'Ferrite_(magnet)', 'Takei': 'Ferrite_(magnet)', 'TDK': 'TDK', 'Philips': 'Philips',
  'Albert Hanson': 'Printed_circuit_board#History', 'Eisler': 'Paul_Eisler', 'Julius Lilienfeld': 'Julius_Edgar_Lilienfeld',
  'Atalla': 'Mohamed_M._Atalla', 'Kahng': 'Dawon_Kahng', 'Hyatt': 'John_Wesley_Hyatt', 'Arthur Eichengrün': 'Arthur_Eichengrün',
  'James Watson Hendry': 'Injection_moulding#History', 'iMac': 'IMac_G3', 'USB-C': 'USB-C',
  // Additions: white LED, O-ring, graphite, frosting, coiled coil, Bowden cable, Schrader valve,
  // stereo headphones, microprocessor, JPEG, image stabilisation, transformer
  'Nichia': 'Nichia', 'J. O. Lundberg': 'O-ring#History', 'Niels Christensen': 'O-ring#History',
  'Second World War': 'World_War_II', 'Challenger': 'Space_Shuttle_Challenger_disaster',
  'Carl Wilhelm Scheele': 'Carl_Wilhelm_Scheele', 'Abraham Gottlob Werner': 'Abraham_Gottlob_Werner',
  'Benbow': 'Burnie_Lee_Benbow', 'Hakunetsusha': 'Toshiba', 'Pipkin': 'Marvin_Pipkin',
  'August Schrader': 'August_Schrader', 'George Schrader': 'George_Schrader', 'Schrader valve': 'Schrader_valve',
  'Ernest Bowden': 'Bowden_cable#History', 'Frank Bowden': 'Frank_Bowden', 'Raleigh': 'Raleigh_Bicycle_Company',
  'Bowden': 'Bowden_cable', 'Koss': 'Koss_Corporation', 'Minolta': 'Minolta', 'Faggin': 'Federico_Faggin',
  'Shima': 'Masatoshi_Shima', 'Nasir Ahmed': 'Nasir_Ahmed_(engineer)', 'Ahmed': 'Nasir_Ahmed_(engineer)',
  'JPEG': 'JPEG', 'Gaulard and Gibbs': 'Lucien_Gaulard', 'Ganz works': 'Ganz_Works', 'William Stanley': 'William_Stanley_Jr.',
  // Camera, second pass
  'Thomas Wedgwood': 'Thomas_Wedgwood_(photographer)', 'Niépce': 'Nicéphore_Niépce', 'Daguerre': 'Louis_Daguerre',
  'Henry Fox Talbot': 'Henry_Fox_Talbot', 'Mozi': 'Mozi', 'Ibn al-Haytham': 'Ibn_al-Haytham', 'camera obscura': 'Camera_obscura',
  'Nimrud lens': 'Nimrud_lens', 'Aristophanes': 'Aristophanes', 'Reading stones': 'Reading_stone', 'Spectacles': 'Glasses',
  'Chester Moore Hall': 'Chester_Moore_Hall', 'George Bass': 'Achromatic_lens#History', 'John Dollond': 'John_Dollond',
  'Dollond': 'John_Dollond', 'Copley Medal': 'Copley_Medal', 'Petzval': 'Joseph_Petzval', 'Voigtländer': 'Voigtländer',
  'Schott': 'Otto_Schott', 'Ernst Abbe': 'Ernst_Abbe', 'Abbe': 'Ernst_Abbe', 'Zeiss': 'Carl_Zeiss',
  'Royal Society': 'Royal_Society', 'Clile C. Allen': 'Zoom_lens#History', 'Cooke Varo': 'Zoom_lens#History', 'Zoomar': 'Zoom_lens#History',
  'Sashida': 'Ultrasonic_motor', 'Daniele Barbaro': 'Daniele_Barbaro', 'John Waterhouse': 'Waterhouse_stop',
  'Harrison and Schnitzer': 'Diaphragm_(optics)#History', 'J. H. Brown': 'Diaphragm_(optics)#History',
  'Micro Four Thirds': 'Micro_Four_Thirds_system', 'Adolf Miethe': 'Adolf_Miethe', 'Edgerton': 'Harold_Edgerton', 'Gjon Mili': 'Gjon_Mili',
  'Hertz': 'Heinrich_Hertz', 'Einstein': 'Albert_Einstein', 'Boyle and Smith': 'Charge-coupled_device', 'Maxwell': 'James_Clerk_Maxwell',
  'Thomas Sutton': 'Thomas_Sutton_(photographer)', 'Panasonic Lumix G1': 'Panasonic_Lumix_DMC-G1', 'Panasonic': 'Panasonic',
  'Sony Alpha 7': 'Sony_α7', 'Eric Johnson': 'Touchscreen#History', 'CERN': 'CERN', 'Kilby': 'Jack_Kilby', 'Noyce': 'Robert_Noyce',
  'Fairchild': 'Fairchild_Semiconductor', 'Intel 4004': 'Intel_4004', 'SanDisk': 'SanDisk', 'CompactFlash': 'CompactFlash',
  'SD Association': 'SD_Association', 'SD card': 'SD_card',
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
