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
      ],
    },
  ],
};
