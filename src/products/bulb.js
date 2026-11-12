import * as THREE from 'three';
import { mat, metal, glass, clear, cyl, lathe, ring, helix, wire, group } from './helpers.js';

function envelopeProfile() {
  const pts = [[0.4, 0.8], [0.41, 1.0], [0.46, 1.25], [0.6, 1.52]];
  for (let i = 0; i <= 40; i++) {
    const phi = ((53 + (127 * i) / 40) * Math.PI) / 180;
    pts.push([Math.max(Math.sin(phi), 0.0001), 2.35 - Math.cos(phi)]);
  }
  return pts;
}

export default {
  id: 'bulb',
  name: 'Incandescent Light Bulb',
  blurb:
    'A glowing wire in a bottle. Making it last longer than a few minutes needed a better vacuum, a better metal and a better seal.',
  timeline: [
    ['1802', 'Humphry Davy makes a platinum strip glow with current. It burns out almost at once.'],
    ['1879', 'Swan in England and Edison in America show lamps that last for hours.'],
    ['1904', 'Just and Hanaman patent the tungsten filament: brighter, but brittle.'],
    ['1913', 'Langmuir’s gas-filled, coiled-filament lamp nearly doubles efficiency.'],
    ['1925', 'Marvin Pipkin’s inside-frosted bulb softens the glare.'],
    ['2009', 'Phase-outs begin in the EU as compact fluorescents and LEDs take over.'],
  ],
  parts: [
    {
      id: 'base',
      name: 'Screw base',
      anchor: [0.31, 0.45, 0.31],
      explode: [0, 0, 0],
      make: () => {
        const nickel = () => metal(0xc9cbd0, { roughness: 0.3 });
        const thread = helix(0.405, 0.52, 4.5, 0.045, nickel());
        thread.position.y = 0.2;
        return group(
          cyl(0.4, 0.4, 0.66, 0.47, nickel()),
          thread,
          ring(0.41, 0.03, 0.8, nickel()),
          lathe([[0.4, 0.14], [0.36, 0.1], [0.18, 0.03], [0.16, 0.03]], mat(0x1a1b20, { roughness: 0.4, clearcoat: 0.3 }), 64),
          lathe([[0, -0.01], [0.1, -0.01], [0.15, 0.03], [0, 0.03]], metal(0xd9c08a, { roughness: 0.35 }), 48)
        );
      },
      inventions: [
        {
          name: 'Edison screw',
          year: '1881',
          by: 'Thomas Edison',
          what: 'A threaded metal cap that is both the mechanical mount and one electrical contact, with the second contact at the tip.',
          here: 'Anyone can change a bulb with a twist and no tools. The same fitting is still the world standard (E26 / E27) for LED lamps today.',
          story:
            "Edison’s early lamps were fixed in place by hand, with wires that had to be connected by someone who knew what they were doing. To sell electric light to ordinary homes, changing a bulb had to be as simple as possible. In 1880, the story goes, Edison’s team looked at the screw-on lid of a kerosene can in the workshop, and Edison had one sawn off to use as a prototype. The threaded metal shell held the lamp firmly in its socket and doubled as one of the two electrical contacts. It was patented in 1881. Rival bases from other companies competed for years, but Edison’s screw won out and is still the standard today.",
          read: [{ label: "Edison screw", wiki: "Edison_screw" }],
          people: [{ name: 'Thomas Edison', life: '1847 – 1931', role: 'American inventor and businessman with 1,093 US patents; built the first commercial power grid to sell his lamps.', wiki: 'Thomas_Edison' }],
          uses: ['LED and CFL lamps', 'Heat and grow lamps', 'Chandelier candle bulbs', 'Old screw-in fuses'],
          timeline: [
            ['1881', 'Edison patents the screw fitting for his lamp.'],
            ['1890s', 'Rival bases from Thomson-Houston and Westinghouse compete.'],
            ['1900s', 'The Edison screw wins out and becomes the common fitting.'],
            ['Today', 'LED bulbs are built to screw into the same 140-year-old socket.'],
          ],
        },
      ],
    },
    {
      id: 'stem',
      name: 'Glass stem & lead-in wires',
      anchor: [0.1, 1.3, 0.1],
      explode: [0, 0.9, 0],
      make: () => {
        const copper = () => metal(0xc98052, { roughness: 0.3 });
        const support = () => metal(0xa9adb3, { roughness: 0.35 });
        return group(
          lathe([[0.22, 0.8], [0.17, 0.98], [0.09, 1.28], [0.075, 1.52], [0.11, 1.6], [0.0001, 1.62]], clear(0.38), 48),
          wire([[-0.05, 0.85, 0], [-0.06, 1.6, 0], [-0.2, 1.95, 0], [-0.36, 2.3, 0]], 0.014, copper()),
          wire([[0.05, 0.85, 0], [0.06, 1.6, 0], [0.2, 1.95, 0], [0.36, 2.3, 0]], 0.014, copper()),
          wire([[0, 1.6, 0.02], [0, 2.0, 0.06], [0, 2.3, 0.0]], 0.008, support())
        );
      },
      inventions: [
        {
          name: 'Dumet wire',
          year: '1912',
          by: 'Colin G. Fink',
          what: 'A nickel-iron core clad in copper that expands with heat at the same rate as glass, replacing the costly platinum used until then.',
          here: 'The wires must pass through the glass without cracking it or letting air in. Matching expansion keeps the seal tight every time the lamp heats and cools.',
          story:
            "Every light bulb has a tricky spot: where the wires pass through the glass. Glass and most metals expand by different amounts when they heat up, so each time the lamp was switched on and off, the seal could crack and let in air, which ruins the lamp at once. Platinum expands almost exactly like glass, so early lamps used it, but platinum was very expensive. At General Electric’s research laboratory, Colin Fink found a cheap combination that behaves like platinum: a core of nickel–iron alloy, which expands less than glass, wrapped in copper, which expands more. Together they match the glass. Around 1912 dumet wire replaced platinum, and lamps adopted it within a year.",
          read: [{ label: "Glass-to-metal seal", wiki: "Glass-to-metal_seal" }],
          people: [{ name: 'Colin G. Fink', life: '1881 – 1953', role: 'American electrochemist at General Electric’s research lab, then head of electrochemistry at Columbia University from 1922 to 1950.', wiki: null }],
          uses: ['Vacuum tubes', 'Glass-sealed diodes', 'Reed switches', 'Fluorescent tubes', 'Halogen capsules'],
          timeline: [
            ['1880s', 'Early lamps seal their wires through glass with platinum.'],
            ['1912', 'Fink’s copper-clad wire does the same job at a fraction of the cost; lamps adopt it within a year.'],
            ['1920s', 'The radio boom puts dumet seals in millions of vacuum tubes.'],
            ['1950s', 'Glass-bodied diodes use the same seal in miniature.'],
          ],
        },
      ],
    },
    {
      id: 'filament',
      name: 'Filament',
      anchor: [0, 2.36, 0.05],
      explode: [0, 1.5, 0],
      make: () => {
        const coil = helix(0.045, 0.72, 22, 0.011, mat(0xffb060, { emissive: 0xff9838, emissiveIntensity: 2 }));
        coil.rotation.z = -Math.PI / 2;
        coil.position.set(-0.36, 2.3, 0);
        coil.userData.noTint = true;
        const glow = new THREE.PointLight(0xffb066, 4, 14, 1.8);
        glow.position.set(0, 2.3, 0);
        return group(coil, glow);
      },
      inventions: [
        {
          name: 'Carbon-filament lamp',
          year: '1879',
          by: 'Joseph Swan & Thomas Edison',
          what: 'Working separately, both showed that a thin carbonised thread in a vacuum could glow for hours rather than seconds.',
          here: 'It set the principle the bulb still follows: push current through a thin resistive thread until it is white-hot.',
          story:
            "Electric arc lamps already lit streets in the 1870s, but they were blinding and needed constant attention. Inventors had tried for decades to make a small, gentle lamp from a glowing thread, but every filament burned out within minutes. In Newcastle, Joseph Swan had worked on carbonised paper filaments since the 1850s; the problem was getting enough air out of the bulb. With the new Sprengel mercury pump he succeeded, and showed a working lamp in early 1879. Across the Atlantic, Thomas Edison’s team tested thousands of materials. On 22 October 1879 a carbonised cotton thread glowed for over 13 hours. Edison then built everything a lamp needs: generators, wiring and meters.",
          read: [{ label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" }, { label: "Joseph Swan", wiki: "Joseph_Swan" }],
          people: [
            { name: 'Joseph Swan', life: '1828 – 1914', role: 'English physicist and chemist. His house in Gateshead was among the very first lit by incandescent lamps.', wiki: 'Joseph_Swan' },
            { name: 'Thomas Edison', life: '1847 – 1931', role: 'American inventor who paired the lamp with generators, wiring and meters — a whole system.', wiki: 'Thomas_Edison' },
          ],
          uses: ['Toasters', 'Electric heaters', 'Hair dryers', 'Oven elements'],
          timeline: [
            ['1802', 'Humphry Davy heats a platinum strip to a glow.'],
            ['Feb 1879', 'Swan demonstrates his carbon lamp in Newcastle.'],
            ['Oct 1879', 'Edison’s carbonised-thread lamp burns for over 13 hours.'],
            ['1880', 'Carbonised bamboo stretches lamp life to 1,200 hours.'],
            ['1883', 'The rivals merge in Britain as “Ediswan”.'],
          ],
        },
        {
          name: 'Ductile tungsten',
          year: '1906',
          by: 'William D. Coolidge (General Electric)',
          what: 'Tungsten has the highest melting point of any metal but was too brittle to shape. Coolidge found how to work it hot until it could be drawn into wire.',
          here: 'The coil runs at around 2,500 °C. Tungsten survives that, glows whiter and lasts far longer than carbon ever did.',
          story:
            "Tungsten has the highest melting point of any metal, so it can glow far hotter and whiter than carbon. In 1904 two inventors, Sándor Just and Franjo Hanaman, made tungsten filaments, but these were pressed from powder and so brittle that the lamps often broke on the way to the shop. General Electric gave the problem to William Coolidge, a physicist in its research laboratory. Tungsten would crack under any normal metalworking. Coolidge found that by working it while very hot, step by step, he could gradually make it tough enough to be drawn through dies into a fine, flexible wire. By 1911 General Electric was selling lamps with his ductile tungsten.",
          read: [{ label: "William D. Coolidge", wiki: "William_D._Coolidge" }, { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" }],
          people: [{ name: 'William D. Coolidge', life: '1873 – 1975', role: 'American physicist at General Electric. He also invented the modern X-ray tube, and lived to 101.', wiki: 'William_D._Coolidge' }],
          uses: ['X-ray tubes', 'Vacuum-tube cathodes', 'Welding electrodes', 'Halogen lamps'],
          timeline: [
            ['1904', 'Just and Hanaman make brittle pressed-tungsten filaments.'],
            ['1906', 'Coolidge develops a way to make tungsten ductile enough to draw into wire.'],
            ['1911', 'General Electric sells ductile-tungsten lamps.'],
            ['1913', 'The Coolidge X-ray tube uses a hot tungsten cathode.'],
            ['1959', 'The halogen lamp pushes tungsten hotter still.'],
          ],
        },
      ],
    },
    {
      id: 'envelope',
      name: 'Glass envelope',
      anchor: [0.5, 2.85, 0.707],
      explode: [0, 2.8, 0],
      seeThrough: true,
      make: () => lathe(envelopeProfile(), glass({ thickness: 0.02 }), 96),
      inventions: [
        {
          name: 'Sprengel mercury pump',
          year: '1865',
          by: 'Hermann Sprengel',
          what: 'Falling drops of mercury trap and carry away air, reaching a far harder vacuum than any piston pump before it.',
          here: 'In air a hot filament burns through in moments. Only once bulbs could be pumped this empty did lamps last long enough to sell.',
          story:
            "In the mid-1800s, chemists and physicists needed to empty glass vessels of air far more completely than the leaky piston pumps of the time could manage. Hermann Sprengel, a German chemist working in London, came up with a pump with no moving parts at all. Drops of mercury fall one by one down a narrow glass tube. Each drop traps a tiny pocket of air beneath it and carries it down and out. It was slow, taking about twenty minutes to empty half a litre, but it reached the best vacuum anyone had achieved. William Crookes used it to study cathode rays, and Swan and Edison used it to empty their first light bulbs.",
          read: [{ label: "Sprengel pump", wiki: "Sprengel_pump" }, { label: "Hermann Sprengel", wiki: "Hermann_Sprengel" }],
          people: [{ name: 'Hermann Sprengel', life: '1834 – 1906', role: 'German-born chemist who worked in London; also an early researcher of safer explosives.', wiki: 'Hermann_Sprengel' }],
          uses: ['Early light bulbs', 'Crookes tubes', 'Early X-ray tubes', 'The discovery of the electron'],
          timeline: [
            ['1650', 'Otto von Guericke builds the first air pump.'],
            ['1865', 'Sprengel’s mercury-drop pump reaches a near-perfect vacuum.'],
            ['1870s', 'William Crookes uses it to study cathode rays.'],
            ['1879', 'Swan and Edison evacuate their lamps with Sprengel pumps.'],
            ['1897', 'J. J. Thomson, using such tubes, identifies the electron.'],
          ],
        },
        {
          name: 'Gas-filled lamp',
          year: '1913',
          by: 'Irving Langmuir',
          what: 'Langmuir showed that filling the bulb with inert gas (and coiling the filament) slows tungsten evaporating off the wire.',
          here: 'Modern bulbs hold argon rather than vacuum: the filament can run hotter and brighter, and the glass blackens far more slowly.',
          story:
            "Early tungsten lamps had a slow-motion problem: the hot filament gradually boiled away, and the evaporated metal coated the inside of the glass, so the bulb dimmed and blackened as it aged. Engineers tried to make the vacuum ever more perfect. Irving Langmuir, a young chemist at General Electric’s research laboratory, studied the problem from the opposite direction: how gases behave around a very hot wire. He found that filling the bulb with an unreactive gas, first nitrogen and later argon, pushes back against the escaping tungsten. Coiling the filament tightly cut the heat lost to the gas. In 1913 his gas-filled lamp gave about twice the light for the same power.",
          read: [{ label: "Irving Langmuir", wiki: "Irving_Langmuir" }, { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" }],
          people: [{ name: 'Irving Langmuir', life: '1881 – 1957', role: 'American chemist and physicist at General Electric; Nobel Prize in Chemistry, 1932.', wiki: 'Irving_Langmuir' }],
          uses: ['Halogen lamps', 'Car headlamp bulbs', 'Projector lamps', 'Stage lighting'],
          timeline: [
            ['1913', 'Langmuir fills lamps with nitrogen, then argon, and coils the filament.'],
            ['1921', 'Junichi Miura makes the first coiled-coil filament.'],
            ['1959', 'Halogen gas lets the filament redeposit its own tungsten.'],
            ['2009', 'Efficiency rules begin retiring the incandescent lamp.'],
          ],
        },
      ],
    },
  ],
};
