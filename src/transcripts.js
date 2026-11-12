// Read-aloud transcripts.
//
// Every invention gets a narration-friendly transcript, built from its data rather than
// scraped from the page: no headings or button labels, abbreviations spelled out, dates
// phrased the way a person would say them. An invention can supply its own text with a
// `transcript` field (a string, or an array of paragraphs); otherwise one is generated.
// scripts/check-content.mjs runs before every build and fails it if any invention is
// missing the fields a transcript needs.

const MONTHS = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };

// Fields every invention must have for its transcript (checked at build time)
export const TRANSCRIPT_FIELDS = ['name', 'year', 'by', 'what', 'here', 'story', 'people', 'uses', 'timeline'];

// Make written text comfortable to hear
export function speakable(text) {
  return String(text)
    .replace(/[“”"]/g, '')
    .replace(/\bc\.\s?/g, 'around ')
    .replace(/(\d)\s*[–-]\s*(\d)/g, '$1 to $2')
    .replace(/(\d)\s*–\s*(AD|BC)/g, '$1 to $2')
    .replace(/(\p{L})–(\p{L})/gu, '$1 $2')
    .replace(/(\S)–(\S)/g, '$1 to $2')
    .replace(/\s–\s/g, ', ')
    .replace(/(\d)° (?=\p{L})/gu, '$1-degree ')
    .replace(/°/g, ' degrees')
    .replace(/\bNo\.\s?(\d)/g, 'number $1')
    .replace(/\s&\s/g, ' and ')
    .replace(/\bGaN\b/g, 'gallium nitride')
    .replace(/\bLEDs\b/g, 'L.E.D.s')
    .replace(/\bLED\b/g, 'L.E.D.')
    .replace(/\bUS\b/g, 'U.S.')
    .replace(/\bEU\b/g, 'E.U.')
    .replace(/\bGE\b/g, 'G.E.')
    .replace(/(\d) mm\b/g, '$1 millimetre')
    .replace(/\b1\.0\b/g, '1 point 0')
    .replace(/\bUSB-C\b/g, 'U.S.B C')
    .replace(/\bUSB\b/g, 'U.S.B')
    .replace(/\bOLED\b/g, 'oh-led')
    .replace(/\bCMOS\b/g, 'sea-moss')
    .replace(/\bMOSFET\b/g, 'moss-fet')
    .replace(/\bMOS\b/g, 'moss')
    .replace(/\b(SLR|RCA|TDK|IBM|EMI|MIT)\b/g, (w) => w.split('').join('.'))
    .replace(/\bQi\b/g, 'chee')
    .replace(/\bDS-1P\b/g, 'D.S 1 P')
    .replace(/\bC35 AF\b/g, 'C 35 A.F')
    .replace(/\bME F\b/g, 'M.E F')
    .replace(/\s+/g, ' ')
    .trim();
}

// "1841" -> "In 1841", "c. 400 BC" -> "Around 400 BC", "15th c." -> "In the 15th century" ...
export function sayWhen(when) {
  const w = when.trim();
  let m;
  if ((m = w.match(/^c\.\s?(.+)$/))) return `Around ${m[1]}`;
  if ((m = w.match(/^(\d+(?:st|nd|rd|th))\s?c\.$/))) return `In the ${m[1]} century`;
  if ((m = w.match(/^(Early|Mid-|Late)\s?(\d{4}s)$/i))) return `In the ${m[1].replace('-', '').toLowerCase()} ${m[2]}`;
  if ((m = w.match(/^(\d{3,4}s)$/))) return `In the ${m[1]}`;
  if ((m = w.match(/^([A-Z][a-z]{2}) (\d{3,4})$/)) && MONTHS[m[1]]) return `In ${MONTHS[m[1]]} ${m[2]}`;
  if ((m = w.match(/^(\d{3,4})\s*[–-]\s*(\d{3,4})$/))) return `Between ${m[1]} and ${m[2]}`;
  if (/^\d/.test(w)) return `In ${w}`;
  return w; // "Before 1770", "Today", ...
}

function sayLife(life) {
  let m;
  if ((m = life.match(/^(\d{3,4}) – (\d{3,4})$/))) return `who lived from ${m[1]} to ${m[2]}`;
  if ((m = life.match(/^Born (\d{3,4})$/))) return `born in ${m[1]}`;
  if ((m = life.match(/^Died (\d{3,4})$/))) return `who died in ${m[1]}`;
  if ((m = life.match(/^Active (.+)$/))) return `active in ${m[1]}`;
  if ((m = life.match(/^c\. (\d+ BC) – c\. (\d+ BC)$/))) return `who lived from around ${m[1]} to around ${m[2]}`;
  return '';
}

function list(items) {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// The transcript for one invention, as an array of spoken paragraphs
export function transcriptFor(product, part, inv) {
  if (inv.transcript) return (Array.isArray(inv.transcript) ? inv.transcript : [inv.transcript]).map(speakable);
  const object = product.name.toLowerCase().replace('led ', 'LED ');
  const paras = [
    `${inv.name}.`,
    `This invention lives in the ${lower(part.name)} of the ${object}. It dates from ${inv.year}, and is credited to ${inv.by}.`,
    `What it is. ${inv.what}`,
    `How the ${object} uses it. ${inv.here}`,
    `The story. ${inv.story}`,
  ];
  const people = inv.people.map((p) => {
    const life = sayLife(p.life);
    return `${p.name}${life ? `, ${life}` : ''}. ${p.role}`;
  });
  paras.push(`${inv.people.length > 1 ? 'The inventors' : 'The inventor'}. ${people.join(' ')}`);
  // Capitals are left as written: voices ignore them, and names must keep theirs
  paras.push(`Where else you will find it. It is also used in ${list(inv.uses)}.`);
  paras.push(`Through time. ${inv.timeline.map(([when, text]) => `${sayWhen(when)}, ${text}`).join(' ')}`);
  paras.push(`That was ${inv.name}.`);
  return paras.map(speakable);
}
