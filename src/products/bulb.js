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
          kind: 'invention',
          kindNote: 'It became the standard lamp fitting, still used by LED bulbs today.',
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
        {
          name: "Central power station",
          kind: "invention",
          year: "1882",
          by: "Thomas Edison",
          what: "One large generating plant that sends electricity along wires under the streets to many customers, who pay for what they use.",
          here: "A bulb is useless without a socket that is live. The screw base is where the lamp joins a network of wires leading back to a generator.",
          story: "A light bulb on its own was a laboratory curiosity. To sell electric light Edison needed everything behind the socket as well: generators, cables, fuses, switches and meters. He chose a district of lower Manhattan, around Wall Street, where newspapers and bankers would notice, and had cables laid under the streets. The station was a converted building on Pearl Street, with coal-fired boilers and steam engines driving six large dynamos. It began supplying electricity on 4 September 1882, to 82 customers with 400 lamps. Two years later it served 508 customers and more than ten thousand lamps. It burned down in 1890, was rebuilt, and ran until 1895, by which time bigger stations had overtaken it. The idea of selling electricity from a central plant through a network is how nearly all electricity is still supplied.",
          read: [
            { label: "Pearl Street Station", wiki: "Pearl_Street_Station" },
            { label: "Thomas Edison", wiki: "Thomas_Edison" },
          ],
          people: [
            { name: "Thomas Edison", life: "1847 – 1931", role: "American inventor who built the whole system needed to sell electric light, from the generator to the meter.", wiki: "Thomas_Edison" },
          ],
          uses: ["Home and street lighting", "Factories", "Electric trains and trams", "Everything that plugs in"],
          timeline: [
            ["1882", "Pearl Street Station starts up on 4 September with 82 customers."],
            ["1884", "It serves 508 customers and 10,164 lamps."],
            ["1890", "The station burns down and is rebuilt."],
            ["1895", "It is closed, overtaken by larger stations."],
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
          kind: 'material',
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
          kind: 'invention',
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
          kind: 'process',
          kindNote: 'In 1928 a US court ruled that Coolidge’s patent on it was not a valid invention.',
          year: '1906',
          by: 'William D. Coolidge (General Electric)',
          what: 'Tungsten has the highest melting point of any metal but was too brittle to shape. Coolidge found how to work it hot until it could be drawn into wire.',
          here: 'The coil runs at around 2,500 °C. Tungsten survives that, glows whiter and lasts far longer than carbon ever did.',
          story:
            "Tungsten has the highest melting point of any metal, so it can glow far hotter and whiter than carbon. In 1904 two inventors, Sándor Just and Franjo Hanaman, made tungsten filaments, but these were pressed from powder and so brittle that the lamps often broke on the way to the shop. General Electric gave the problem to William Coolidge, a physicist in its research laboratory. Tungsten would crack under any normal metalworking. Coolidge found that by working it while very hot, step by step, he could gradually make it tough enough to be drawn through dies into a fine, flexible wire. By 1911 General Electric was selling lamps with his ductile tungsten. His 1913 patent did not last: in 1928 a US court ruled that the process was not a valid invention, though the lamps it made had already changed lighting.",
          read: [{ label: "William D. Coolidge", wiki: "William_D._Coolidge" }, { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" }],
          people: [{ name: 'William D. Coolidge', life: '1873 – 1975', role: 'American physicist at General Electric. He also invented the modern X-ray tube, and lived to 101.', wiki: 'William_D._Coolidge' }],
          uses: ['X-ray tubes', 'Vacuum-tube cathodes', 'Welding electrodes', 'Halogen lamps'],
          timeline: [
            ['1904', 'Just and Hanaman make brittle pressed-tungsten filaments.'],
            ['1906', 'Coolidge develops a way to make tungsten ductile enough to draw into wire.'],
            ['1911', 'General Electric sells ductile-tungsten lamps.'],
            ['1913', 'The Coolidge X-ray tube uses a hot tungsten cathode.'],
            ['1928', 'A US court rules Coolidge’s 1913 patent invalid.'],
            ['1959', 'The halogen lamp pushes tungsten hotter still.'],
          ],
        },
        {
          name: "Coiled-coil filament",
          kind: "invention",
          year: "1917",
          by: "Burnie Lee Benbow (General Electric)",
          what: "The filament is wound into a tiny coil, and that coil is wound again into a larger coil. A long wire fits into a small space and loses less heat to the gas around it.",
          here: "The glowing filament is a coil of a coil. Folding it up keeps it hot with less power, so more of the electricity becomes light.",
          story: "In 1913 Irving Langmuir showed that a coiled filament in a gas-filled bulb gave far more light than a straight one, because a tight coil loses less heat to the gas. The next step was to coil the coil. Burnie Lee Benbow, who managed General Electric’s wire works in Cleveland, patented the coiled-coil filament in 1917: a fine coil of tungsten wound in turn around a rod called a mandrel, so that it formed a second, larger coil. Making it reliably was hard. In Japan, Junichi Miura of the company Hakunetsusha, which later became part of Toshiba, made the first double-coil bulb in 1921, but there was still no machinery to make such filaments in quantity. Hakunetsusha developed a way to mass-produce them by 1936, and coiled-coil filaments became standard in household bulbs.",
          read: [
            { label: "Burnie Lee Benbow", wiki: "Burnie_Lee_Benbow" },
            { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" },
          ],
          people: [
            { name: "Burnie Lee Benbow", life: "1885 – 1976", role: "American engineer who managed the Cleveland Wire Works of General Electric’s lighting business.", wiki: "Burnie_Lee_Benbow" },
            { name: "Junichi Miura", life: "Active 1921", role: "Japanese engineer at Hakunetsusha, a forerunner of Toshiba, who made the first double-coil bulb.", wiki: null, link: "Incandescent_light_bulb" },
          ],
          uses: ["Household incandescent bulbs", "Halogen lamps", "Car bulbs", "Projector lamps"],
          timeline: [
            ["1913", "Langmuir coils the filament in his gas-filled lamp."],
            ["1917", "Benbow patents the coiled-coil filament."],
            ["1921", "Junichi Miura makes the first double-coil bulb at Hakunetsusha."],
            ["1936", "Hakunetsusha can mass-produce coiled-coil filaments."],
          ],
        },
        {
          name: "Tungsten",
          kind: "discovery",
          kindNote: "A chemical element. It was found and isolated, not invented.",
          year: "1783",
          by: "Juan José and Fausto Elhuyar",
          what: "A grey metal with the highest melting point of any metal, about 3,400 degrees Celsius. Its name is Swedish for heavy stone.",
          here: "The filament is tungsten because almost nothing else can glow white-hot, night after night, without melting.",
          story: "Miners in central Europe had long known a mineral that seemed to eat up the tin in their furnaces, and called it wolfram. In Sweden a dense white mineral was known as tungsten, meaning heavy stone. In 1781 the chemist Carl Wilhelm Scheele showed that the Swedish mineral contained a new acid, and suggested with his colleague Torbern Bergman that a new metal might be got from it. Two Spanish brothers, Juan José and Fausto Elhuyar, took up the idea. In 1783 they found the same acid in wolfram, and later that year, at a scientific society in the Basque town of Bergara, they heated the acid with charcoal and obtained the metal itself. It was hard, heavy and almost impossible to melt or shape, and for a century it had few uses. Its chemical symbol is still W, for wolfram.",
          read: [
            { label: "Tungsten", wiki: "Tungsten" },
            { label: "Fausto Elhuyar", wiki: "Fausto_Elhuyar" },
          ],
          people: [
            { name: "Fausto Elhuyar", life: "1755 – 1833", role: "Spanish chemist who, with his brother Juan José, first isolated tungsten. He later directed mining in Mexico.", wiki: "Fausto_Elhuyar" },
          ],
          uses: ["Drill bits and cutting tools", "X-ray tubes", "Welding electrodes", "Rocket nozzles", "Darts and fishing weights"],
          timeline: [
            ["1781", "Carl Wilhelm Scheele finds a new acid in the mineral then called tungsten."],
            ["1783", "The Elhuyar brothers isolate the metal at Bergara."],
            ["1904", "Tungsten is first used for lamp filaments."],
          ],
        },
        {
          name: "Joule heating",
          kind: "discovery",
          kindNote: "A law of nature: any wire carrying a current warms up. Joule measured exactly how much.",
          year: "1840",
          by: "James Prescott Joule",
          what: "An electric current heats whatever it flows through. Double the current and the heat goes up four times.",
          here: "This is the whole principle of the bulb. Current forced through a very thin wire heats it until it glows.",
          story: "James Joule was the son of a wealthy brewer in Manchester, and did his experiments in a laboratory at the family brewery. He was interested in whether the new electric motors could ever be cheaper to run than steam engines, and that led him to ask where the energy in an electric circuit goes. In 1840 he put a coil of wire in a measured amount of water, passed a known current through it for half an hour, and recorded how much the water warmed. By changing the current and the length of the wire he found the rule: the heat is proportional to the resistance of the wire and to the square of the current. He was 21 when he reported it to the Royal Society. The work led him on to show that heat and mechanical work are forms of the same thing, energy, and the unit of energy is named after him.",
          read: [
            { label: "Joule heating", wiki: "Joule_heating" },
            { label: "James Prescott Joule", wiki: "James_Prescott_Joule" },
          ],
          people: [
            { name: "James Prescott Joule", life: "1818 – 1889", role: "English physicist and brewer whose experiments established that energy is conserved.", wiki: "James_Prescott_Joule" },
          ],
          uses: ["Electric kettles and toasters", "Electric heaters and ovens", "Hair dryers", "Fuses", "Heated car windows"],
          timeline: [
            ["1802", "Humphry Davy makes a platinum strip glow with a large battery."],
            ["1840", "Joule reports his law of electrical heating to the Royal Society."],
            ["1879", "Swan and Edison use the effect to make practical lamps."],
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
          kind: 'tool',
          kindNote: 'It was used in the factory to empty the bulb of air. It is not part of the finished bulb.',
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
          kind: 'invention',
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
        {
          name: "Inside frosting",
          kind: "process",
          year: "1925",
          by: "Marvin Pipkin",
          what: "Etching the inside of the glass to a fine frost, so the light leaves the bulb as a soft, even glow instead of a dazzling point.",
          here: "This bulb is clear, so you can see the filament. A frosted bulb spreads the same glow across the whole glass, which is much easier on the eyes.",
          story: "A bare glowing filament is dazzling, so lamp makers looked for ways to soften it. Frosting the inside of the bulb would leave the outside smooth and easy to clean, but it was thought to weaken the thin glass too much. Marvin Pipkin was a chemist from Florida who had worked on gas masks for the army during the First World War at General Electric’s Nela Park laboratory in Cleveland, and stayed on there afterwards to work on lamps. In 1925 he patented a process for frosting the inside of bulbs that did not weaken them; in fact the frosted bulbs held up well to ordinary handling. In 1947 he patented a coating of silica for the inside of bulbs. His work became General Electric’s Soft-White range.",
          read: [
            { label: "Marvin Pipkin", wiki: "Marvin_Pipkin" },
            { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb" },
          ],
          people: [
            { name: "Marvin Pipkin", life: "1889 – 1977", role: "American chemist at General Electric’s Nela Park laboratory, who also held patents for photographic flash bulbs.", wiki: "Marvin_Pipkin" },
          ],
          uses: ["Soft-white bulbs", "Frosted LED bulbs", "Lamp diffusers", "Frosted glassware"],
          timeline: [
            ["1925", "Pipkin patents inside frosting that does not weaken the bulb."],
            ["1947", "He patents a silica coating for the inside of bulbs."],
            ["Today", "Many LED bulbs copy the frosted look."],
          ],
        },
        {
          name: "Glassblowing",
          kind: "technique",
          year: "1st century BC",
          by: "Phoenician and Syrian craftsmen",
          what: "Molten glass is gathered on the end of a hollow pipe and inflated with breath into a thin bubble, which can then be shaped or blown into a mould.",
          here: "The bulb is a blown bubble of glass, thin enough to be light and cheap but strong enough to hold a vacuum or gas against the air outside.",
          story: "For its first two thousand years glass was a luxury. Vessels were cast in moulds or built up around a core of clay, slowly and thickly. In the first century BC craftsmen on the eastern shore of the Mediterranean, in what is now Lebanon and Israel, discovered something glass workers had not known: a blob of molten glass on the end of a tube can be inflated like a bubble. Blowing made thin, clear vessels in a fraction of the time. The discovery came just as the Roman Empire was forming, and the new craft spread quickly across it. Glass became an everyday material. Nineteen centuries later the first light bulbs were made the same way. At the Corning works in the 1880s a team of three, two gatherers and a master blower, made about 150 bulbs an hour by blowing them into moulds.",
          read: [
            { label: "Glassblowing", wiki: "Glassblowing" },
          ],
          people: [
            { name: "Craftsmen of the eastern Mediterranean", life: "Active 1st century BC", role: "Unnamed Phoenician and Syrian glass workers. One later master whose name survives is Ennion.", wiki: null, link: "Glassblowing#History" },
          ],
          uses: ["Bottles and jars", "Drinking glasses", "Laboratory glassware", "Thermometers", "Neon signs"],
          timeline: [
            ["1st century BC", "Phoenician and Syrian craftsmen begin blowing glass."],
            ["1880s", "Light bulbs are blown by hand at about 150 an hour."],
            ["1926", "The Ribbon Machine blows bulbs automatically."],
          ],
        },
        {
          name: "Ribbon Machine",
          kind: "tool",
          kindNote: "A factory machine that makes the bulb. It is not part of it.",
          year: "1926",
          by: "William Woods and David Gray",
          what: "A machine that turns a continuous ribbon of hot glass into light bulbs, puffing each one into a mould with a jet of air as the ribbon moves along.",
          here: "This bulb was one of hundreds blown every minute from a single moving ribbon of glass. That is why a light bulb became one of the cheapest things you could buy.",
          story: "By the 1920s electric light was spreading fast, and blowing each bulb by mouth could not keep up. The Corning Glass Works in New York State, which supplied bulbs to the lamp makers, had already built machines that copied the motions of a glass blower. William Woods and his colleague David Gray thought of a different approach. Molten glass flows from the furnace between rollers as a flat ribbon. The ribbon rides on a belt with a row of holes in it, the soft glass sags through each hole, and a nozzle above blows it down into a mould below. Corning installed the Ribbon Machine at its factory in Wellsboro, Pennsylvania, in 1926. By 1939 it was making a thousand bulbs a minute. In the 1970s fifteen of these machines made the whole world’s supply.",
          read: [
            { label: "Incandescent light bulb", wiki: "Incandescent_light_bulb#Ribbon_machine" },
            { label: "Corning Inc.", wiki: "Corning_Inc." },
          ],
          people: [
            { name: "William Woods", life: "Active 1926", role: "Corning employee who invented the machine with his colleague David E. Gray.", wiki: null, link: "Incandescent_light_bulb#Ribbon_machine" },
          ],
          uses: ["Light bulbs", "Radio and television valves", "Christmas tree ornaments", "Vacuum flask liners"],
          timeline: [
            ["1880s", "Bulbs are blown by hand at about 150 an hour."],
            ["1926", "Corning installs the Ribbon Machine at Wellsboro."],
            ["1939", "The machine makes 1,000 bulbs a minute."],
            ["1970s", "Fifteen ribbon machines make the world’s supply of bulbs."],
          ],
        },
        {
          name: "Argon",
          kind: "discovery",
          kindNote: "A chemical element, found in the air. Nobody invented it.",
          year: "1894",
          by: "Lord Rayleigh and William Ramsay",
          what: "A gas that makes up nearly one per cent of the air and reacts with almost nothing. Its name comes from the Greek for lazy.",
          here: "The bulb is filled with argon. Because it will not react even with white-hot tungsten, it protects the filament and slows its evaporation.",
          story: "In 1785 Henry Cavendish removed the oxygen and nitrogen from a sample of air and found a small bubble of gas left over that he could not get rid of. He noted it and moved on, and for a century nobody followed it up. In the 1890s Lord Rayleigh was measuring the densities of gases very precisely, and found that nitrogen taken from air was always slightly heavier than nitrogen made from chemicals. Something else was mixed in. Working with the chemist William Ramsay at University College London, he repeated Cavendish’s experiment in 1894 and isolated the leftover gas. It would combine with nothing, so they named it argon, the lazy one. It was the first of a whole family of such gases, and both men received Nobel Prizes in 1904. Its laziness is what makes it useful in a light bulb.",
          read: [
            { label: "Argon", wiki: "Argon" },
            { label: "William Ramsay", wiki: "William_Ramsay" },
          ],
          people: [
            { name: "Lord Rayleigh", life: "1842 – 1919", role: "English physicist who noticed that nitrogen from the air was too heavy.", wiki: "John_William_Strutt,_3rd_Baron_Rayleigh" },
            { name: "William Ramsay", life: "1852 – 1916", role: "Scottish chemist who went on to find the other noble gases in air.", wiki: "William_Ramsay" },
          ],
          uses: ["Welding", "Double-glazed windows", "Fluorescent tubes", "Preserving old documents", "Wine preservation"],
          timeline: [
            ["1785", "Henry Cavendish notices an unreactive residue in air."],
            ["1894", "Rayleigh and Ramsay isolate argon."],
            ["1904", "Both receive Nobel Prizes."],
            ["1913", "Langmuir fills light bulbs with nitrogen and then argon."],
          ],
        },
      ],
    },
  ],
};
