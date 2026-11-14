import * as THREE from 'three';
import { mat, metal, cyl, helix, wire, group } from './helpers.js';

// Built upright (shackle up, keyhole underneath), then laid on its back on the grid:
// local +Y points away from the viewer, local -Y (the key) toward them, local +Z is up.
const steelPlate = () => metal(0xaeb3bb, { roughness: 0.5 });
const brass = () => metal(0xc8a14b, { roughness: 0.4 });
const nickel = () => metal(0xcfd3d8, { roughness: 0.35 });

let plateGeo;
function plate() {
  if (!plateGeo) {
    const w = 0.8, d = 0.35, r = 0.12;
    const s = new THREE.Shape();
    s.moveTo(-w + r, -d);
    s.lineTo(w - r, -d); s.quadraticCurveTo(w, -d, w, -d + r);
    s.lineTo(w, d - r); s.quadraticCurveTo(w, d, w - r, d);
    s.lineTo(-w + r, d); s.quadraticCurveTo(-w, d, -w, d - r);
    s.lineTo(-w, -d + r); s.quadraticCurveTo(-w, -d, -w + r, -d);
    plateGeo = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 1, curveSegments: 6 });
  }
  return plateGeo.clone();
}

function shacklePath() {
  const pts = [];
  for (let y = 0.8; y <= 1.7; y += 0.15) pts.push([-0.5, y, 0]);
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI - (i / 12) * Math.PI;
    pts.push([Math.cos(a) * 0.5, 1.75 + Math.sin(a) * 0.5, 0]);
  }
  for (let y = 1.7; y >= 1.0; y -= 0.14) pts.push([0.5, y, 0]);
  return pts;
}

export default {
  id: 'padlock',
  name: 'Padlock',
  blurb:
    'A lock you can carry. The trick inside, a row of pins that only the right key lines up, is about four thousand years old.',
  rotation: [-Math.PI / 2, 0, 0],
  position: [0, 0.36, 0],
  timeline: [
    ['c. 500 BC', 'Padlocks appear in the Roman era and travel the trade routes to Asia.'],
    ['AD 850', 'Padlocks from this date survive from the Viking settlement of Jorvik.'],
    ['Mid-1800s', 'The “Scandinavian” padlock, credited to Christopher Polhem, becomes the secure choice.'],
    ['1861', 'Linus Yale Jr. patents the small flat key and the pin cylinder used ever since.'],
    ['1921', 'Harry Soref and two partners found Master Lock to make padlocks from stacked steel plates.'],
  ],
  parts: [
    {
      id: 'body',
      name: 'Laminated body',
      anchor: [0.45, 0.9, 0.37],
      explode: [0, 0, 0],
      make: () => {
        const g = new THREE.Group();
        for (let i = 0; i < 14; i++) {
          const p = new THREE.Mesh(plate(), steelPlate());
          p.rotation.x = -Math.PI / 2;
          p.position.y = 0.008 + i * 0.093;
          g.add(p);
        }
        return g;
      },
      inventions: [
        {
          name: 'Laminated steel padlock',
          kind: 'invention',
          year: '1919',
          by: 'Harry Soref',
          what: 'The body is a stack of plates punched from sheet steel and riveted together, the way a bank-vault door is built. It is cheap to make and very hard to break.',
          here: 'You can see the layers as lines around the body. A hammer blow that would crack a cast lock just dents one plate.',
          story:
            "Harry Soref, a locksmith who had emigrated from what is now Ukraine to the United States, wanted to make a padlock that was strong but cheap to build. Strong locks of the time were cast or forged as solid blocks, which was costly. In 1919 he designed a body made from many plates of sheet steel, punched out and stacked together, the same principle as an armoured bank-vault door. Nobody he approached would buy the idea, so in 1921 he and two friends, P. E. Yolles and Sam Stahl, set up their own company in Milwaukee, Master Lock, with five employees. It received the first patent on a laminated lock in 1924. In 1974 a famous TV advert showed a sharpshooter’s bullet failing to open one.",
          read: [{ label: "Master Lock", wiki: "Master_Lock" }, { label: "Padlock", wiki: "Padlock" }],
          people: [{ name: 'Harry Soref', life: '1887 – 1957', role: 'Locksmith born in what is now Ukraine. When no maker would buy his design, he co-founded Master Lock in Milwaukee in 1921.', wiki: null, link: 'Harry_Soref' }],
          uses: ['Gym and school lockers', 'Gates and sheds', 'Toolboxes', 'Shipping containers'],
          timeline: [
            ['1919', 'Soref devises a padlock body made of laminated steel.'],
            ['1921', 'He and two partners start Master Lock with five employees.'],
            ['1924', 'The company is granted the first patent on a laminated lock.'],
          ],
        },
        {
          name: "The padlock",
          kind: "invention",
          kindNote: "Its first maker is unknown. Padlocks appear in Europe and Asia in ancient times.",
          year: "c. 500 BC",
          by: "Unknown makers",
          what: "A lock that is not built into a door. It has its own case and a loop, the shackle, that can be passed through a chain or a ring and locked shut.",
          here: "This is the same object in modern materials: a case, a shackle and a mechanism that holds the shackle until the right key arrives.",
          story: "A lock fixed in a door protects one doorway. Traders needed something they could take with them, to fasten a chest, a sack or a gate wherever they stopped. Padlocks survive from the Roman era, between about 500 BC and AD 300, and they travelled with merchants along the trade routes into Asia, where the Chinese made them in bronze. A Roman padlock had a bent rod fixed to its case, and a second piece that slid into the case to close the loop. Inside were springs that splayed open and held it until a key squeezed them together. Locks of that kind were found at the Viking town of Jorvik, now York, from about AD 850. The word itself is from the late fifteenth century. Padlocks stayed fairly easy to force until the nineteenth century brought better mechanisms and cheap steel.",
          read: [
            { label: "Padlock", wiki: "Padlock" },
            { label: "Lock and key", wiki: "Lock_and_key" },
          ],
          people: [
            { name: "Unknown locksmiths", life: "Active c. 500 BC", role: "The makers of the first padlocks are not recorded.", wiki: null, link: "Padlock#History" },
          ],
          uses: ["Gates and sheds", "Lockers", "Bicycles", "Luggage", "Shipping containers"],
          timeline: [
            ["c. 500 BC", "Padlocks are in use in the Roman era."],
            ["AD 850", "Spring padlocks are used at Jorvik."],
            ["Late 1400s", "The word padlock enters English."],
            ["1921", "Master Lock begins making laminated padlocks."],
          ],
        },
        {
          name: "Galvanising",
          kind: "process",
          year: "1837",
          by: "Stanislas Sorel",
          what: "Coating iron or steel with a thin layer of zinc. The zinc keeps air and water off the steel, and where it is scratched it corrodes first, protecting the steel beside it.",
          here: "A padlock lives outdoors in the rain. The steel plates of the body are zinc-coated so that they do not rust solid.",
          story: "Iron’s great weakness is rust. In 1742 the French chemist Paul Jacques Malouin described how iron could be coated by dipping it in molten zinc, but nothing practical came of it for almost a century. Stanislas Sorel, the son of a poor clock maker, was a French engineer who first made his name with safe heating stoves for kitchens, and became curious about how different metals behave together. On 10 May 1837 he filed a patent for protecting iron from rust, either by dipping it in a bath of molten zinc or by painting it with a zinc paint. He called the method galvanic, after Luigi Galvani, because the protection is electrical: where the coating is broken, the zinc is eaten away in place of the iron. Hot-dip galvanising spread quickly, to roofing sheets, buckets, wire and nails.",
          read: [
            { label: "Galvanization", wiki: "Galvanization" },
            { label: "Stanislas Sorel", wiki: "Stanislas_Sorel" },
          ],
          people: [
            { name: "Stanislas Sorel", life: "1803 – 1871", role: "French engineer and chemist, who also invented a cement still used in industrial floors.", wiki: "Stanislas_Sorel" },
          ],
          uses: ["Corrugated roofing", "Fences and wire", "Car bodies", "Street lamp posts", "Buckets and watering cans"],
          timeline: [
            ["1742", "Paul Jacques Malouin describes coating iron with molten zinc."],
            ["1837", "Sorel patents galvanising in France."],
            ["Today", "Galvanised steel is used wherever steel has to stand outdoors."],
          ],
        },
      ],
    },
    {
      id: 'shackle',
      name: 'Shackle',
      anchor: [0, 2.26, 0.1],
      explode: [0, 1.0, 0],
      make: () => wire(shacklePath(), 0.1, metal(0xd6dade, { roughness: 0.3 })),
      inventions: [
        {
          name: 'Bessemer steel',
          kind: 'process',
          year: '1856',
          by: 'Henry Bessemer',
          what: 'Blowing air through molten iron burns out the excess carbon in minutes. It made steel, until then a costly craft material, cheap enough to use by the tonne.',
          here: 'The shackle is the part a thief attacks. It has to be steel: iron bends and brass saws through. Today’s shackles are hardened alloy steel made by later methods, but Bessemer was the first to make steel cheap enough for everyday things.',
          story:
            "In the 1850s steel was so expensive it was used only for small things like knives and tools. Big structures were made of iron, which is brittle. Henry Bessemer later wrote that his idea began with a conversation with Napoleon III in 1854 about the need for stronger metal for artillery. Riding home that night, he decided to improve how iron was made. He found that blowing air through molten iron burned out the excess carbon, and the burning itself made the metal hotter, so no extra fuel was needed. A converter could turn tonnes of iron into steel in minutes, in a roaring shower of sparks. He patented the process in 1856.",
          read: [{ label: "Bessemer process", wiki: "Bessemer_process" }, { label: "Henry Bessemer", wiki: "Henry_Bessemer" }],
          people: [{ name: 'Henry Bessemer', life: '1813 – 1898', role: 'English inventor with more than a hundred patents. The American William Kelly reached a similar process independently.', wiki: 'Henry_Bessemer' }],
          uses: ['Railway rails', 'Bridges', 'Ship hulls', 'Skyscraper frames', 'Tools'],
          timeline: [
            ['c. 1740', 'Benjamin Huntsman makes crucible steel, a few kilograms at a time.'],
            ['1856', 'Bessemer patents his converter.'],
            ['1865', 'The open-hearth furnace offers slower but more controllable steelmaking.'],
            ['1952', 'Basic oxygen steelmaking begins to replace both.'],
          ],
        },
      ],
    },
    {
      id: 'cylinder',
      name: 'Lock cylinder & key',
      anchor: [0.03, -0.86, 0.1],
      explode: [0, -0.45, 1.0],
      make: () => {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.15, 0.18), nickel());
        blade.position.y = -0.075;
        const bow = cyl(0.22, 0.22, 0.035, 0, nickel(), 40);
        bow.rotation.z = Math.PI / 2;
        bow.position.set(0, -0.85, 0);
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.24), mat(0x18191c, { roughness: 0.8 }));
        slot.position.y = -0.024;
        return group(cyl(0.2, 0.2, 0.78, 0.37, brass(), 40), slot, blade, bow);
      },
      inventions: [
        {
          name: 'Cylinder lock with flat key',
          kind: 'invention',
          year: '1861',
          by: 'Linus Yale Jr.',
          what: 'Yale shrank the pin lock into a small rotating plug, opened by a thin flat key with a serrated edge instead of a heavy iron one.',
          here: 'The brass plug turns only when the key’s notches lift every pin to exactly the right height. Turning it releases the shackle.',
          story:
            "Linus Yale Jr. started out as a portrait painter. Around 1850 he gave up painting to join his father, a maker of locks for banks, and became fascinated by security. His father’s pin-tumbler locks were large, with heavy keys. Yale Jr. shrank the whole mechanism into a small brass cylinder that fits inside a door, and replaced the big key with a thin, flat one whose serrated edge lifts the pins. He patented the design in 1861 and improved it in 1865. In 1868 he founded a lock company with the businessman Henry Towne, but died suddenly later that year. His compact cylinder lock is still the most common lock in the world.",
          read: [{ label: "Linus Yale Jr.", wiki: "Linus_Yale_Jr." }, { label: "Pin tumbler lock", wiki: "Pin_tumbler_lock" }],
          people: [{ name: 'Linus Yale Jr.', life: '1821 – 1868', role: 'American engineer who trained as a portrait painter before joining his father’s lock business.', wiki: 'Linus_Yale_Jr.' }],
          uses: ['Front doors', 'Car ignitions', 'Filing cabinets', 'Bicycle locks', 'Vending machines'],
          timeline: [
            ['1848', 'Linus Yale Sr. builds the modern pin-tumbler lock.'],
            ['1861', 'Linus Yale Jr. patents the flat serrated key and pins of varying length.'],
            ['1868', 'The Yale lock company is founded in Stamford, Connecticut.'],
          ],
        },
        {
          name: "Brass",
          kind: "material",
          kindNote: "An alloy known since prehistoric times, with no single inventor.",
          year: "Antiquity",
          by: "Unknown metalworkers",
          what: "A gold-coloured mixture of copper and zinc. It is easy to cut precisely, slides smoothly against itself and does not rust.",
          here: "The cylinder and pins are brass. The parts must slide freely for years in the damp without sticking, and brass does that better than steel.",
          story: "Brass has been made since prehistoric times, at first by accident, when copper was smelted from ores that happened to contain zinc. For most of history nobody could make it by simply melting the two metals together, because zinc boils away at a lower temperature than copper melts. Ancient metalworkers instead heated copper with a zinc ore and charcoal in a closed pot, so that zinc vapour soaked into the copper. The Romans used brass made this way for coins and armour fittings, and prized its golden colour. Only much later was zinc produced as a metal in its own right, which let brass be mixed to exact recipes. More copper makes it softer and more golden, and more zinc makes it harder and more silvery. It has low friction and resists corrosion, which is why locks, hinges, gears and taps are made of it.",
          read: [
            { label: "Brass", wiki: "Brass" },
          ],
          people: [
            { name: "Unknown metalworkers", life: "Active antiquity", role: "Brass was first made thousands of years ago by smiths whose names are lost.", wiki: null, link: "Brass#History" },
          ],
          uses: ["Locks and keys", "Taps and plumbing fittings", "Trumpets and other brass instruments", "Cartridge cases", "Zips"],
          timeline: [
            ["Prehistory", "Brass is first made, probably by accident, from ores containing zinc."],
            ["Roman era", "Brass is used for coins and fittings."],
            ["1861", "Linus Yale Jr. uses brass for his cylinder lock."],
          ],
        },
      ],
    },
    {
      id: 'pins',
      name: 'Pin tumblers & springs',
      anchor: [0.52, 0.38, 0.05],
      explode: [0, 0, 1.7],
      make: () => {
        const g = new THREE.Group();
        for (let i = 0; i < 5; i++) {
          const y = 0.12 + i * 0.13;
          const pin = cyl(0.035, 0.035, 0.2, 0, brass(), 16);
          pin.rotation.z = Math.PI / 2;
          pin.position.set(0.31, y, 0);
          const spring = helix(0.03, 0.24, 5, 0.008, nickel());
          spring.rotation.z = -Math.PI / 2;
          spring.position.set(0.42, y, 0);
          g.add(pin, spring);
        }
        return g;
      },
      inventions: [
        {
          name: 'Pin tumbler lock',
          kind: 'invention',
          kindNote: 'The principle is about four thousand years old. Linus Yale Sr. made the modern metal form.',
          year: '1848',
          by: 'Linus Yale Sr.',
          what: 'Spring-loaded pins, each cut in two, block the plug from turning. Only a key that lifts every pin so its cut lines up with the edge of the plug lets it move.',
          here: 'Five pin stacks sit beside the cylinder. With five pins and several possible heights each, thousands of different keys are possible.',
          story:
            "The idea behind the pin lock is ancient. Around 2000 BC Egyptians fastened doors with a wooden bolt held by wooden pins that dropped into it; a large wooden key with pegs pushed the pins up so the bolt could slide. The principle was forgotten and rediscovered many times. In the United States in the 1840s, Linus Yale Sr., a lock maker in Newport, New York, who made locks for banks, rebuilt the old idea in metal. Each pin was cut in two and pushed down by a spring, blocking a rotating plug. Only a key that lifts every cut to exactly the edge of the plug lets it turn. His 1848 design is the modern pin-tumbler lock.",
          read: [{ label: "Pin tumbler lock", wiki: "Pin_tumbler_lock" }, { label: "Linus Yale Sr.", wiki: "Linus_Yale_Sr." }],
          people: [{ name: 'Linus Yale Sr.', life: '1797 – 1858', role: 'American metalsmith and lock maker in Newport, New York, who made high-security locks for banks.', wiki: 'Linus_Yale_Sr.' }],
          uses: ['House door locks', 'Deadbolts', 'Desk and locker locks', 'Car doors'],
          timeline: [
            ['c. 2000 BC', 'Wooden pin locks, opened by a toothed wooden key, are used in Egypt.'],
            ['c. 710 BC', 'A tumbler lock is built into the palace of Khorsabad.'],
            ['1805', 'The first patent for a double-acting pin tumbler lock is granted.'],
            ['1844', 'Linus Yale Sr. patents a pin tumbler lock for safes.'],
            ['1848', 'He develops the modern pin-tumbler lock.'],
          ],
        },
        {
          name: 'Coil spring',
          kind: 'invention',
          kindNote: 'Coiled springs already worked inside locks and clocks in the 1400s. Tredwell’s was the first patent for them.',
          year: '1763',
          by: 'Richard Tredwell',
          what: 'The first patented coil spring, meant for suspending carriages: a wire wound into a helix stores energy when squeezed and pushes back with steady force.',
          here: "A small coil spring sits behind each pin and pushes it back into place when the key is withdrawn. Without the springs the lock would stay open.",
          story:
            "Eighteenth-century coaches were hung on leather straps or stacks of flat leaf springs. The leaves rubbed against each other, so they squeaked, wore out and had to be spread apart and greased regularly. Coiled springs themselves were not new: they had worked inside door locks and clocks since the 1400s. What Richard Tredwell of Rotherham patented in 1763 was a new use for them, hanging coaches on wire wound into a helix. His drawings show nine of these “worm” springs. A coil needs no lubrication, because nothing slides, and it pushes back evenly however it is squeezed. His was the first patent for coil springs. It made little impact at the time, and almost nothing else is known about him, but the coil became one of the most common machine parts in the world.",
          read: [{ label: "Upholstery coil springs", wiki: "Upholstery_coil_springs" }, { label: "Spring (device)", wiki: "Spring_(device)" }],
          people: [{ name: 'Richard Tredwell', life: 'Active 1763', role: 'Of Rotherham, Yorkshire. His name is also printed as “Tradwell”; little else about him is recorded.', wiki: null }],
          uses: ['Ballpoint pens', 'Mattresses', 'Car suspension', 'Clocks and watches', 'Door locks'],
          timeline: [
            ['15th c.', 'The coiled mainspring makes portable clocks possible.'],
            ['1678', 'Robert Hooke publishes his law: stretch is proportional to force.'],
            ['1763', 'Tredwell is granted British patent No. 792 for coil springs to hang coaches.'],
            ['1857', 'The steel coil spring is patented in the US for chair seats.'],
            ['1871', 'Heinrich Westphal builds the first innerspring mattress.'],
          ],
        },
      ],
    },
  ],
};
