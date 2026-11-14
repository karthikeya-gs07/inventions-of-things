import * as THREE from 'three';
import { mat, metal, glass, clear, knurl, batteryLabel, cyl, lathe, ring, annulus, helix, group } from './helpers.js';

// Built along local +Y (tail -> head), then laid on its side along world +X.
// With this rotation, local -X points up.
const anodised = (o = {}) => metal(0x2e3238, { roughness: 0.62, metalness: 0.85, ...o });
const steel = () => metal(0xd4d8de, { roughness: 0.22 });
const bare = () => metal(0xb9bdc4, { roughness: 0.35 });

function battery(y) {
  // y = centre of the 1.0-long can
  const label = mat(0xffffff, { map: batteryLabel(), roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.5 });
  return group(
    cyl(0.36, 0.36, 1.0, y, label, 64, true),
    cyl(0.355, 0.355, 0.02, y + 0.5, steel()),
    cyl(0.12, 0.12, 0.07, y + 0.54, steel(), 32),
    cyl(0.355, 0.33, 0.02, y - 0.5, steel()),
    cyl(0.2, 0.2, 0.012, y - 0.512, steel(), 32)
  );
}

function reflectorProfile() {
  const pts = [];
  const r0 = 0.14, r1 = 0.72;
  for (let i = 0; i <= 32; i++) {
    const r = r0 + ((r1 - r0) * i) / 32;
    pts.push([r, 1.0 + (0.85 * (r * r - r0 * r0)) / (r1 * r1 - r0 * r0)]);
  }
  pts.push([0.735, 1.85]);
  return pts;
}

export default {
  id: 'flashlight',
  name: 'LED Flashlight',
  blurb:
    'A pocket torch looks like one idea. It is really two centuries of chemistry, optics and semiconductor physics packed into an aluminium tube.',
  rotation: [0, 0, -Math.PI / 2],
  position: [0, 0.82, 0],
  timeline: [
    ['1899', 'David Misell patents the tubular “electric device” for Conrad Hubert’s company, later Eveready. Weak cells only manage brief flashes — hence the name.'],
    ['1904', 'The tungsten-filament lamp, three times as efficient as carbon, turns the flash into a steady, usable beam.'],
    ['1960s', 'Alkaline cells multiply running time and make torches a household staple.'],
    ['1979', 'The Maglite arrives: a machined, anodised-aluminium body tough enough for police work.'],
    ['1999', 'The first high-power white LEDs reach the market, bright enough to replace a bulb.'],
    ['2000s', 'LED torches take over: no filament to break, a fraction of the power, many times the light.'],
  ],
  parts: [
    {
      id: 'tailcap',
      name: 'Threaded tail cap',
      anchor: [-0.37, -2.0, 0.37],
      explode: [0, -1.7, 0],
      make: () =>
        group(
          lathe([[0, -2.2], [0.46, -2.2], [0.52, -2.14], [0.52, -1.84], [0.5, -1.8], [0, -1.8]], anodised({ side: THREE.DoubleSide })),
          cyl(0.525, 0.525, 0.2, -2.0, anodised({ bumpMap: knurl(56, 4), bumpScale: 1.4 }), 64, true),
          cyl(0.2, 0.22, 0.05, -2.22, mat(0x16181b, { roughness: 0.9 }), 48)
        ),
      inventions: [
        {
          name: 'Standardised screw thread',
          kind: 'standard',
          year: '1841',
          by: 'Joseph Whitworth',
          what: 'Whitworth proposed one fixed thread angle and pitch for every bolt size, so a screw made in one workshop would fit a nut made in any other.',
          here: 'The cap twists off to change batteries and screws back to a watertight seal — only because cap and body share an exact, repeatable thread.',
          story:
            "In the early 1800s every workshop cut its own threads. A bolt from one maker rarely fitted a nut from another, so a broken fastener on a steam engine meant making a new matching pair by hand. Joseph Whitworth, trained under the great toolmaker Henry Maudslay, was obsessed with accuracy; he later built a machine that could measure a millionth of an inch. He gathered sample screws from workshops across Britain, studied their angles and spacing, and in 1841 proposed one compromise: a 55° thread with a fixed number of turns per inch for each size. The railways adopted it, and it became the world’s first national screw standard.",
          read: [{ label: "British Standard Whitworth", wiki: "British_Standard_Whitworth" }, { label: "Joseph Whitworth", wiki: "Joseph_Whitworth" }],
          people: [{ name: 'Joseph Whitworth', life: '1803 – 1887', role: 'English engineer and toolmaker who made precision measurement an industrial habit.', wiki: 'Joseph_Whitworth' }],
          uses: ['Nuts and bolts', 'Jar and bottle lids', 'Light-bulb bases', 'Camera tripod mounts', 'Plumbing fittings'],
          timeline: [
            ['c. 400 BC', 'The screw itself is traditionally credited to Archytas of Tarentum.'],
            ['c. 1800', 'Henry Maudslay’s screw-cutting lathe makes accurate threads repeatable.'],
            ['1841', 'Whitworth proposes a single 55° thread form — the first national standard.'],
            ['1864', 'William Sellers proposes the 60° thread that becomes the US standard.'],
            ['1898', 'An international congress unifies most metric screw threads.'],
          ],
        },
        {
          name: "Screw-cutting lathe",
          kind: "tool",
          kindNote: "A machine used to make the thread. It is not part of the torch.",
          year: "1800",
          by: "Henry Maudslay",
          what: "A lathe in which a long, accurate screw moves the cutting tool along the work at a steady rate, so it cuts a thread that is the same every time.",
          here: "The fine thread on this cap and the matching one in the body are cut by a descendant of that machine. Identical threads are what let the cap seal.",
          story: "Until the late 1700s a screw thread was cut largely by hand and eye, and no two were quite alike. A screw could only be used with the nut made for it. Jesse Ramsden built what was probably the first modern screw-cutting lathe in 1775, using it to make precise scientific instruments. In France a mechanic named Senot built one in 1795, and David Wilkinson in Rhode Island another in 1798. The man who made the idea an industrial tool was Henry Maudslay. He had trained under the lock maker Joseph Bramah, who had hired him at eighteen. In 1800 Maudslay built a lathe whose cutting tool was carried along by a long lead screw geared to the turning work, so that the thread came out exactly regular. Accurate screws could then make more accurate machines. His pupil Joseph Whitworth later standardised the threads.",
          read: [
            { label: "Screw-cutting lathe", wiki: "Screw-cutting_lathe" },
            { label: "Henry Maudslay", wiki: "Henry_Maudslay" },
          ],
          people: [
            { name: "Henry Maudslay", life: "1771 – 1831", role: "English toolmaker, regarded as a founding father of machine tools. Many leading engineers of the next generation trained in his workshop.", wiki: "Henry_Maudslay" },
          ],
          uses: ["Bolts, nuts and screws", "Machine parts", "Scientific instruments", "Pipe fittings", "Jar and bottle moulds"],
          timeline: [
            ["1775", "Jesse Ramsden builds probably the first modern screw-cutting lathe."],
            ["1795", "A French mechanic named Senot builds one capable of industrial production."],
            ["1800", "Maudslay builds the first industrially practical screw-cutting lathe."],
            ["1841", "His former pupil Whitworth proposes a standard thread."],
          ],
        },
      ],
    },
    {
      id: 'oring',
      name: 'O-ring seal',
      anchor: [-0.36, -1.78, 0.36],
      explode: [0, -1.3, 0],
      make: () => ring(0.49, 0.035, -1.78, mat(0x0d0e10, { roughness: 0.75 })),
      inventions: [
        {
          name: "O-ring",
          kind: "invention",
          year: "1896",
          by: "J. O. Lundberg, and Niels Christensen",
          what: "A loop of rubber with a round cross-section, squeezed into a groove. Pressure from either side pushes it harder against the walls, so it seals tighter the harder it is pushed.",
          here: "The black ring at the base of the thread seals the tail cap, keeping rain and dust out of the battery tube.",
          story: "The first patent for an O-ring was granted in Sweden on 12 May 1896, to J. O. Lundberg. Little else is recorded about him, and his idea made little impression. Four decades later it was found again in the United States by Niels Christensen, a Danish-born machinist who had emigrated in 1891 and patented an air brake for streetcars. Working on hydraulic brakes for cars, he found that a plain ring of solid rubber in a groove made a good seal for the pistons, and that the slight rolling of the ring as the piston moved made it last longer. He applied for patents in 1933 and again in 1937, when he was 72. In the Second World War the US government took over the patent as vital to the war effort and let other companies make the rings. Christensen was paid 75,000 dollars. In 1971, nineteen years after his death, his heirs won another 100,000.",
          read: [
            { label: "O-ring", wiki: "O-ring" },
          ],
          people: [
            { name: "Niels Christensen", life: "Died 1952", role: "Danish-born American machinist who patented the O-ring while improving hydraulic brakes.", wiki: null, link: "O-ring#History" },
            { name: "J. O. Lundberg", life: "Active 1896", role: "Swedish inventor who received the first patent for an O-ring.", wiki: null, link: "O-ring#History" },
          ],
          uses: ["Taps and plumbing fittings", "Car engines and brakes", "Watches and diving equipment", "Aircraft and spacecraft", "Pressure cookers"],
          timeline: [
            ["1896", "J. O. Lundberg receives a Swedish patent for the O-ring."],
            ["1937", "Niels Christensen files his US patent."],
            ["1940s", "The US government takes over the patent during the Second World War."],
            ["1986", "A cold-stiffened O-ring causes the Space Shuttle Challenger disaster."],
          ],
        },
      ],
    },
    {
      id: 'spring',
      name: 'Contact spring',
      anchor: [-0.19, -1.62, 0.19],
      explode: [0, -0.95, 0],
      make: () => {
        const s = helix(0.26, 0.36, 4.5, 0.028, steel());
        s.position.y = -1.8;
        return s;
      },
      inventions: [
        {
          name: 'Coil spring',
          kind: 'invention',
          kindNote: 'Coiled springs already worked inside locks and clocks in the 1400s. Tredwell’s was the first patent for them.',
          year: '1763',
          by: 'Richard Tredwell',
          what: 'The first patented coil spring, meant for suspending carriages: a wire wound into a helix stores energy when squeezed and pushes back with steady force.',
          here: 'It presses the batteries against the front contact so the circuit never breaks when the torch is shaken, and it doubles as the negative terminal.',
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
        {
          name: "Hooke’s law",
          kind: "discovery",
          kindNote: "A law of nature. Hooke found the rule that every spring already obeyed.",
          year: "1678",
          by: "Robert Hooke",
          what: "A spring pushes back in proportion to how far it is squeezed or stretched: twice the squeeze gives twice the push.",
          here: "Engineers use this rule to choose the spring. It must press hard enough to keep the batteries in contact when the torch is dropped, without making the cap hard to screw on.",
          story: "Robert Hooke was the curator of experiments at the Royal Society in London, a restless inventor who worked on clocks, microscopes, telescopes and architecture. He was interested in springs because a good spring might regulate a watch as a pendulum regulates a clock, and that could solve the problem of finding a ship’s position at sea. He found a simple rule for how springs behave, and, afraid that rivals would claim it, he announced it in 1676 only as a scrambled Latin anagram. Two years later he published the answer: ut tensio, sic vis, meaning as the extension, so the force. He said he had known the rule since 1660. It holds for anything elastic, from a wire to a steel beam, so long as it is not stretched too far, and it remains the first calculation in the design of any spring, bridge or building.",
          read: [
            { label: "Hooke’s law", wiki: "Hooke's_law" },
            { label: "Robert Hooke", wiki: "Robert_Hooke" },
          ],
          people: [
            { name: "Robert Hooke", life: "1635 – 1703", role: "English scientist and architect. He was also among the first to study living things under a microscope.", wiki: "Robert_Hooke" },
          ],
          uses: ["Spring balances and kitchen scales", "Car suspension", "Watch and clock design", "Bridge and building design", "Measuring instruments"],
          timeline: [
            ["1660", "Hooke, by his own account, discovers the rule."],
            ["1676", "He publishes it as a Latin anagram."],
            ["1678", "He reveals the solution: the extension is proportional to the force."],
          ],
        },
      ],
    },
    {
      id: 'body',
      name: 'Aluminium body',
      anchor: [-0.36, -0.9, 0.36],
      explode: [0, 0, 0],
      make: () => {
        const shell = () => anodised({ side: THREE.DoubleSide });
        return group(
          cyl(0.5, 0.5, 0.3, -1.65, shell(), 64, true),
          cyl(0.508, 0.508, 1.2, -0.9, anodised({ side: THREE.DoubleSide, bumpMap: knurl(56, 22), bumpScale: 1.4 }), 64, true),
          cyl(0.5, 0.5, 1.1, 0.25, shell(), 64, true),
          ring(0.5, 0.012, -1.5, anodised()),
          ring(0.5, 0.012, -0.3, anodised()),
          cyl(0.44, 0.44, 2.6, -0.5, bare(), 64, true).translateY(0),
          annulus(0.44, 0.5, 0.8, bare()),
          annulus(0.44, 0.5, -1.8, bare()).rotateX(Math.PI)
        );
      },
      inventions: [
        {
          name: 'Hall–Héroult aluminium smelting',
          kind: 'process',
          year: '1886',
          by: 'Charles Martin Hall & Paul Héroult',
          what: 'Dissolving alumina in molten cryolite and splitting it with electric current turned aluminium from a metal dearer than gold into an everyday material.',
          here: 'The tube is light, does not rust, and conducts both electricity (it is the return wire of the circuit) and heat away from the LED.',
          story:
            "Aluminium is the most common metal in the Earth’s crust, yet in the 1850s it cost more than silver, because no one could pull it out of its ore cheaply. At Oberlin College, a lecturer named Frank Fanning Jewett showed his students a lump of it and said a fortune awaited whoever found a cheap way to make it. One student, Charles Martin Hall, took him at his word. Working in the family woodshed with homemade batteries, helped by his sister Julia, he dissolved alumina in molten cryolite and passed a current through it. On 23 February 1886 small beads of aluminium formed. In France, Paul Héroult, also 22, found the same method that year.",
          read: [{ label: "Hall–Héroult process", wiki: "Hall–Héroult_process" }, { label: "Charles Martin Hall", wiki: "Charles_Martin_Hall" }],
          people: [
            { name: 'Charles Martin Hall', life: '1863 – 1914', role: 'American chemist. Found the process aged 22 in a woodshed lab; co-founded the company that became Alcoa.', wiki: 'Charles_Martin_Hall' },
            { name: 'Paul Héroult', life: '1863 – 1914', role: 'French scientist who found the same process the same year, then invented the electric arc furnace for steel.', wiki: 'Paul_Héroult' },
          ],
          uses: ['Aircraft skins', 'Drinks cans', 'Kitchen foil', 'Laptop and phone bodies', 'Overhead power lines'],
          timeline: [
            ['1825', 'Hans Christian Ørsted first isolates aluminium.'],
            ['1855', 'Aluminium bars are shown in Paris as a precious metal.'],
            ['1884', 'The Washington Monument is capped with an aluminium pyramid.'],
            ['1886', 'Hall and Héroult independently find electrolytic smelting.'],
            ['1888', 'Karl Bayer’s process makes pure alumina cheaply from bauxite.'],
            ['1903', 'The Wright Flyer’s engine uses a cast-aluminium block.'],
          ],
        },
        {
          name: "The electric hand torch",
          kind: "design",
          kindNote: "The battery and the bulb already existed. The new idea was to put them in a tube you could carry.",
          year: "1899",
          by: "David Misell",
          what: "A battery, a small bulb and a reflector fitted into one tube, with a switch: a light you can carry in one hand, with no flame.",
          here: "This torch is that same layout: cells in a row inside a tube, a light at one end and a reflector around it.",
          story: "Before 1899 a portable light meant a flame: a candle, an oil lamp or a lantern, each with its smoke, smell and risk of fire. Two new things made an electric one possible, the dry battery, which could be carried without spilling, and the miniature light bulb. On 10 January 1899 the British inventor David Misell obtained an American patent for what he called an electric device: batteries laid end to end in a paper tube, with a bulb and a rough brass reflector at one end. He assigned it to a New York company owned by Conrad Hubert, which later became Eveready. The company gave some to the New York City police, who liked them. The batteries were weak and the carbon bulbs wasteful, so the light could only be used in short bursts, which is where the American name flashlight comes from. Better bulbs after 1904 made it a steady light.",
          read: [
            { label: "Flashlight", wiki: "Flashlight" },
            { label: "Eveready Battery Company", wiki: "Eveready_Battery_Company" },
          ],
          people: [
            { name: "David Misell", life: "Active 1899", role: "British inventor who patented the tubular hand torch and assigned it to Conrad Hubert’s company.", wiki: null, link: "Flashlight#History" },
          ],
          uses: ["Police and rescue work", "Camping and walking", "Power cuts", "Mechanics and inspectors", "Phone torches"],
          timeline: [
            ["1886", "The dry cell makes a battery that can be carried."],
            ["1899", "David Misell patents the tubular electric hand torch."],
            ["1904", "Tungsten-filament bulbs, three times as efficient, make torches practical."],
            ["2000s", "LEDs replace bulbs in torches."],
          ],
        },
        {
          name: "Bayer process",
          kind: "process",
          year: "1888",
          by: "Carl Josef Bayer",
          what: "A chemical method for extracting pure aluminium oxide from bauxite, the reddish ore of aluminium, by dissolving it in hot caustic soda.",
          here: "Before this tube could be smelted as metal, its aluminium was separated from the ore by Bayer’s process. Nearly all aluminium still starts this way.",
          story: "The smelting process discovered by Hall and Héroult in 1886 turns aluminium oxide into metal, but it needs the oxide pure, and aluminium’s ore, bauxite, is only about a third to two-thirds aluminium oxide. The rest is iron oxide, silica and other minerals. The missing step came from an unexpected place. Carl Josef Bayer, an Austrian chemist, was working in Saint Petersburg, Russia, on a way to supply aluminium oxide to the textile industry, which used it to fix dyes in cotton. In 1887 he found that the oxide would settle out of an alkaline solution as clean crystals that were easy to filter and wash. In 1888 he patented a four-stage process: dissolve the bauxite in hot caustic soda, filter off the red mud of impurities, let the pure oxide crystallise, and heat it dry. Together the two processes made aluminium cheap within a few years.",
          read: [
            { label: "Bayer process", wiki: "Bayer_process" },
            { label: "Carl Josef Bayer", wiki: "Carl_Josef_Bayer" },
          ],
          people: [
            { name: "Carl Josef Bayer", life: "1847 – 1904", role: "Chemist from Austria-Hungary. He was not connected with the Bayer chemical company.", wiki: "Carl_Josef_Bayer" },
          ],
          uses: ["All aluminium production", "Ceramics", "Abrasives and sandpaper", "Toothpaste", "Water treatment"],
          timeline: [
            ["1886", "Hall and Héroult discover how to smelt aluminium from its oxide."],
            ["1887", "Carl Josef Bayer finds that aluminium oxide crystallises from an alkaline solution."],
            ["1888", "He patents the four-stage process for refining bauxite."],
          ],
        },
      ],
    },
    {
      id: 'batteries',
      name: 'Battery cells',
      anchor: [-0.26, -0.2, 0.26],
      explode: [0, 0, 1.5],
      make: () => group(battery(-0.9), battery(0.22)),
      inventions: [
        {
          name: 'Voltaic pile',
          kind: 'invention',
          year: '1800',
          by: 'Alessandro Volta',
          what: 'Stacked discs of zinc and copper separated by brine-soaked card produced the first steady electric current — the first battery.',
          here: 'Every cell in the torch is a descendant: two different materials and an electrolyte turning a chemical reaction into current.',
          story:
            "The battery began as an argument about frogs. In the 1780s Luigi Galvani saw a dissected frog’s leg twitch when touched with two different metals, and concluded that living tissue held “animal electricity”. Alessandro Volta disagreed: he suspected the two metals themselves made the electricity, and the frog was only acting as a detector. To prove it he removed the animal altogether. He stacked discs of zinc and copper with pieces of card soaked in salt water between them, and got a steady flow of current, something nobody had produced before. On 20 March 1800 he described the pile in a letter to the Royal Society in London.",
          read: [{ label: "Voltaic pile", wiki: "Voltaic_pile" }, { label: "Luigi Galvani", wiki: "Luigi_Galvani" }],
          people: [{ name: 'Alessandro Volta', life: '1745 – 1827', role: 'Italian physicist. The volt, the unit of electric potential, carries his name.', wiki: 'Alessandro_Volta' }],
          uses: ['Car starter batteries', 'Phone and laptop batteries', 'Electroplating', 'Early telegraph lines'],
          timeline: [
            ['1780', 'Luigi Galvani sees frog legs twitch between two metals.'],
            ['1800', 'Volta stacks zinc and copper discs: the first battery.'],
            ['1800', 'Nicholson and Carlisle use a pile to split water into gases.'],
            ['1836', 'The Daniell cell gives steadier current for telegraphs.'],
            ['1859', 'Gaston Planté builds the rechargeable lead–acid battery.'],
          ],
        },
        {
          name: 'Alkaline dry cell',
          kind: 'invention',
          year: '1957',
          by: 'Lewis Urry (Eveready)',
          what: 'Urry used powdered zinc and manganese dioxide in an alkaline electrolyte, giving several times the life of the older zinc–carbon cell.',
          here: 'Two cells in series supply about 3 volts — enough to drive a white LED for hours from something that fits in a palm.',
          story:
            "By the 1950s, zinc–carbon batteries were struggling. New gadgets such as cameras and toys drained them in no time. In 1955 Eveready sent a young Canadian engineer, Lewis Urry, to its laboratory in Parma, Ohio, to make them last longer. Urry decided the old chemistry could not be saved and tried an alkaline electrolyte with manganese dioxide instead. It worked, but could not deliver enough current, until he replaced the solid zinc with zinc powder, giving the reaction far more surface. To convince his managers, he put his cell in a toy car and raced it around the company canteen against one with an ordinary battery. His car kept going long after the other stopped.",
          read: [{ label: "Lewis Urry", wiki: "Lewis_Urry" }, { label: "Alkaline battery", wiki: "Alkaline_battery" }],
          people: [{ name: 'Lewis Urry', life: '1927 – 2004', role: 'Canadian chemical engineer at Eveready’s lab in Parma, Ohio. He proved the cell by racing two toy cars.', wiki: 'Lewis_Urry' }],
          uses: ['TV remotes', 'Toys', 'Smoke alarms', 'Wall clocks', 'Portable radios'],
          timeline: [
            ['1886', 'Carl Gassner patents the zinc–carbon dry cell.'],
            ['1899', 'Waldemar Jungner builds the nickel–cadmium alkaline cell.'],
            ['1957', 'Urry’s powdered-zinc prototype outlasts everything else.'],
            ['1960', 'The patent is granted and alkaline cells begin to reach shops.'],
            ['1991', 'Sony commercialises the lithium-ion rechargeable.'],
          ],
        },
        {
          name: "Dry cell",
          kind: "invention",
          year: "1886",
          by: "Carl Gassner",
          what: "A battery whose liquid is held in a paste, sealed inside a zinc can that is also one of its electrodes. It can be carried, tipped and stored without spilling.",
          here: "These cells are sealed and dry, so the torch works in any position. That is the feature that first made a hand torch possible.",
          story: "In the 1880s the usual battery was the Leclanché cell, a glass jar of liquid with rods standing in it. It ran most doorbells and telephones, but it could not be moved without spilling, and the liquid often dried out, leaving the bell dead. Carl Gassner was an eye and ear doctor in Mainz, Germany, who experimented with physics and chemistry in his spare time. In 1885 he changed the cell in two ways. He mixed the liquid with plaster of Paris so that it set to a firm paste, and he made the outer case itself out of zinc, so that the container was also one of the two electrodes. He added zinc chloride to slow the zinc’s corrosion and make the cell last longer on the shelf. He patented it in Germany on 8 April 1886, and showed dry cells used for portable lighting at the Paris world’s fair of 1900.",
          read: [
            { label: "Zinc–carbon battery", wiki: "Zinc–carbon_battery" },
            { label: "Carl Gassner", wiki: "Carl_Gassner" },
          ],
          people: [
            { name: "Carl Gassner", life: "1855 – 1942", role: "German physician in Mainz, a specialist in diseases of the eye and ear, and an inventor in his spare time.", wiki: "Carl_Gassner" },
          ],
          uses: ["Torches", "Clocks and remote controls", "Portable radios", "Toys", "Doorbells"],
          timeline: [
            ["1876", "Georges Leclanché begins thickening the liquid in his cell with starch."],
            ["1886", "Gassner patents the dry cell in Germany."],
            ["1898", "Conrad Hubert uses dry cells to power the first hand torches."],
            ["1900", "Gassner shows dry cells for portable lighting in Paris."],
          ],
        },
        {
          name: "AA battery size",
          kind: "standard",
          year: "1907",
          by: "American Ever Ready Company; standardised in 1947",
          what: "An agreed size and shape for a small battery, 14.5 millimetres across and about 50 long, so that any maker’s cell fits any maker’s device.",
          here: "Because the size is fixed, replacement cells for this torch can be bought almost anywhere in the world.",
          story: "Early torch makers each sold batteries to fit their own products, and a customer had to go back to the same maker for replacements. The American Ever Ready Company, which grew out of the first torch business, introduced a slim cell in 1907 for small lights, a size that came to be called AA. Other makers copied the size because it sold well, and it was used in pocket torches and electrical novelties for decades with no formal agreement behind it. In 1947 the American National Standards Institute made it an official standard, with fixed dimensions and voltage. The international standard names the size R6. The contents have changed completely since then, from zinc and carbon to alkaline and rechargeable chemistries, but the outside has not, so a torch made decades ago will still take a cell made today.",
          read: [
            { label: "AA battery", wiki: "AA_battery" },
          ],
          people: [
            { name: "American National Standards Institute", life: "Active 1947", role: "The body that made the AA size an official American standard.", wiki: null, link: "American_National_Standards_Institute" },
          ],
          uses: ["Remote controls", "Clocks", "Toys", "Computer mice and keyboards", "Portable radios"],
          timeline: [
            ["1907", "The American Ever Ready Company introduces the size."],
            ["1947", "The American National Standards Institute standardises it."],
            ["1960s", "Alkaline AA cells go on sale in the same size."],
          ],
        },
      ],
    },
    {
      id: 'switch',
      name: 'Push switch',
      anchor: [-0.6, 0.3, 0],
      explode: [-0.9, 0, 0],
      make: () => {
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(0.125, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          mat(0x3d4f63, { roughness: 0.75, sheen: 0.4 })
        );
        dome.scale.y = 0.62;
        dome.position.y = 0.02;
        const g = group(lathe([[0.19, 0], [0.19, 0.03], [0.15, 0.045], [0.13, 0.045], [0.13, 0]], bare(), 48), dome);
        g.rotation.z = Math.PI / 2;
        g.position.set(-0.5, 0.3, 0);
        return g;
      },
      inventions: [
        {
          name: 'Quick-break switch',
          kind: 'invention',
          year: '1884',
          by: 'John Henry Holmes',
          what: 'A spring snaps the contacts apart or together faster than a hand can move, so no arc lingers to burn them away.',
          here: 'One click closes the loop between battery, LED and body. The snap action is why the light comes on cleanly instead of flickering.',
          story:
            "When electric light reached homes in the 1880s, the switches were simple levers that pushed two contacts together. Opened slowly by hand, the current kept jumping the widening gap as a small spark, an arc. Each arc pitted one contact and left residue on the other, so switches wore out quickly, and they could set things on fire. John Henry Holmes, an engineer in Newcastle upon Tyne, where electric lighting was arriving early, solved it by taking the hand out of the timing. In his 1884 switch, moving the lever winds up a spring, which then snaps the contacts apart or together in an instant, too fast for an arc to form.",
          read: [{ label: "Light switch", wiki: "Light_switch" }, { label: "John Henry Holmes", wiki: "John_Henry_Holmes" }],
          people: [{ name: 'John Henry Holmes', life: '1857 – 1935', role: 'English electrical engineer from Newcastle upon Tyne, an early pioneer of domestic electric lighting.', wiki: 'John_Henry_Holmes' }],
          uses: ['Wall light switches', 'Power tools', 'Kettles and appliances', 'Circuit breakers'],
          timeline: [
            ['1840s', 'Telegraph keys become the first everyday electrical switches.'],
            ['1884', 'Holmes invents quick-break snap action in Newcastle.'],
            ['1916', 'William J. Newton invents the toggle light switch.'],
            ['1947', 'The transistor: a switch with no moving parts at all.'],
          ],
        },
      ],
    },
    {
      id: 'led',
      name: 'LED emitter',
      anchor: [0, 1.0, 0],
      explode: [0, 0.5, 0],
      make: () => {
        const chip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.15), mat(0xffe27a, { emissive: 0xfff0c0, emissiveIntensity: 2 }));
        chip.position.y = 0.95;
        chip.userData.noTint = true;
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), clear(0.28, 0xffffff));
        dome.position.y = 0.945;
        const beam = new THREE.SpotLight(0xfff0d8, 40, 40, 0.36, 0.75, 1.7);
        beam.position.y = 1.0;
        beam.target.position.y = 8;
        return group(
          cyl(0.42, 0.42, 0.06, 0.9, mat(0xe9ebee, { roughness: 0.55 })),
          cyl(0.3, 0.3, 0.004, 0.932, metal(0xc98a4b, { roughness: 0.4 }), 48),
          cyl(0.15, 0.15, 0.012, 0.936, mat(0xf4f4f1, { roughness: 0.6 }), 32),
          chip, dome, beam, beam.target
        );
      },
      inventions: [
        {
          name: 'Visible light-emitting diode',
          kind: 'invention',
          year: '1962',
          by: 'Nick Holonyak Jr.',
          what: 'A semiconductor junction that emits light directly when current crosses it — no filament to heat, almost nothing to wear out.',
          here: 'The tiny chip replaces the fragile bulb of older torches and turns far more of the battery’s energy into light instead of heat.',
          story:
            "In 1962 several laboratories raced to build a semiconductor laser. The working ones used gallium arsenide, which glows only in infrared that the eye cannot see. Nick Holonyak, a young physicist at General Electric in Syracuse, wanted light people could see. Instead of a pure crystal, he made an alloy, gallium arsenide phosphide, mixing elements to tune the colour of the light. Colleagues doubted such mixed crystals could be grown well enough to work. On 9 October 1962 his device shone red. Glowing crystals had been seen before, by H. J. Round in 1907 and Oleg Losev in the 1920s, but Holonyak’s was the first visible-light laser diode and the forerunner of the first practical LEDs. The red digits on calculators and watches, and every coloured LED since, grew from that alloy approach.",
          read: [{ label: "History of the LED", wiki: "History_of_the_LED" }, { label: "Nick Holonyak", wiki: "Nick_Holonyak" }],
          people: [{ name: 'Nick Holonyak Jr.', life: '1928 – 2022', role: 'American engineer at General Electric, later a professor at Illinois. He predicted LEDs would replace the light bulb.', wiki: 'Nick_Holonyak' }],
          uses: ['Indicator lights', 'Traffic signals', 'Digital displays', 'Car brake lights'],
          timeline: [
            ['1907', 'H. J. Round reports a crystal of silicon carbide glowing under current.'],
            ['1927', 'Oleg Losev publishes the first detailed study of the effect.'],
            ['1962', 'Holonyak demonstrates the first practical visible (red) LED.'],
            ['1972', 'M. George Craford adds yellow and a tenfold-brighter red.'],
            ['1970s', 'Red LED digits light up calculators and digital watches.'],
          ],
        },
        {
          name: 'Efficient blue LED',
          kind: 'invention',
          year: '1993',
          by: 'Shuji Nakamura, Isamu Akasaki & Hiroshi Amano',
          what: 'Gallium-nitride LEDs finally produced bright blue light, the missing colour for three decades. It earned the 2014 Nobel Prize in Physics.',
          here: 'The emitter is a blue LED under a yellow phosphor coating; the mix reads as white. Without blue, there is no white LED torch.',
          story:
            "By the 1980s there were red and green LEDs, but no bright blue, and without blue there could be no white LED light. Most researchers had given up on gallium nitride, because its crystals were full of defects. Isamu Akasaki kept going, and with his student Hiroshi Amano grew far better crystals on sapphire using a thin buffer layer. In 1989 they made the first gallium nitride p–n junction. Meanwhile at Nichia, a small Japanese chemical firm, Shuji Nakamura built his own growth reactor and found a heating method suited to mass production. In 1993 Nichia launched a blue LED a thousand times brighter than earlier ones. The three shared the 2014 Nobel Prize in Physics.",
          read: [{ label: "History of the LED", wiki: "History_of_the_LED" }, { label: "Shuji Nakamura", wiki: "Shuji_Nakamura" }],
          people: [
            { name: 'Shuji Nakamura', life: 'Born 1954', role: 'Engineer who built the first high-brightness blue LED at Nichia, a small Japanese chemical firm.', wiki: 'Shuji_Nakamura' },
            { name: 'Isamu Akasaki', life: '1929 – 2021', role: 'Japanese physicist who spent decades proving gallium nitride could be grown well enough to work.', wiki: 'Isamu_Akasaki' },
            { name: 'Hiroshi Amano', life: 'Born 1960', role: 'Japanese physicist. As Akasaki’s student he made the first p-type gallium nitride.', wiki: 'Hiroshi_Amano' },
          ],
          uses: ['White LED lighting', 'Phone and TV backlights', 'Blu-ray lasers', 'Car headlamps', 'Street lighting'],
          timeline: [
            ['1972', 'Herbert Maruska and Wally Rhines make a first, dim, blue-violet gallium-nitride LED at Stanford.'],
            ['1989', 'Akasaki and Amano achieve p-type GaN and a true p–n junction.'],
            ['1993', 'Nakamura’s high-brightness blue LED goes into production.'],
            ['Mid-1990s', 'A yellow phosphor over the blue chip produces the white LED.'],
            ['2014', 'All three share the Nobel Prize in Physics.'],
          ],
        },
        {
          name: "White LED",
          kind: "invention",
          year: "1996",
          by: "Nichia",
          what: "A blue LED chip coated with a yellow phosphor. The phosphor turns part of the blue light into yellow, and the eye sees the mix as white.",
          here: "The yellow coating you can see on the emitter is the phosphor. Without it, the torch would shine blue.",
          story: "Once Nichia could make bright blue LEDs in 1993, white light was within reach, but there were two ways to get it. One was to put red, green and blue chips side by side and mix their light, which was costly and gave uneven colour. The other borrowed from the fluorescent lamp, which makes white by shining light onto phosphor powders. Nichia had started out making phosphors for fluorescent lamps and colour televisions, so it knew the materials well. Its engineers coated a blue chip with a yellow phosphor, cerium-doped yttrium aluminium garnet, which glows yellow when blue light hits it. Some of the blue passes straight through and the rest becomes yellow; together they look white. Nichia put the first white LED on sale in 1996. Its engineer Yoshinori Shimizu was named as the inventor on the patent.",
          read: [
            { label: "Light-emitting diode", wiki: "Light-emitting_diode" },
            { label: "Nichia", wiki: "Nichia" },
          ],
          people: [
            { name: "Yoshinori Shimizu", life: "Active 1996", role: "Nichia engineer named as the inventor on the patent for a white LED made with a garnet phosphor.", wiki: null, link: "Light-emitting_diode#White_LEDs" },
            { name: "Nobuo Ogawa", life: "1912 – 2002", role: "Founder of Nichia, which began in 1956 as a maker of phosphors for fluorescent lamps.", wiki: null, link: "Nichia" },
          ],
          uses: ["LED light bulbs", "Screen backlights", "Car headlights", "Street lights", "Phone camera flashes"],
          timeline: [
            ["1956", "Nichia is founded to make phosphors for fluorescent lamps."],
            ["1993", "Nichia launches its bright blue LED."],
            ["1996", "Nichia sells the first white LED: a blue chip under a yellow phosphor."],
            ["1999", "High-power white LEDs bright enough to replace a bulb reach the market."],
          ],
        },
        {
          name: "p–n junction",
          kind: "discovery",
          kindNote: "Ohl came upon the effect in a cracked crystal and then worked out what caused it.",
          year: "1939",
          by: "Russell Ohl",
          what: "The boundary inside a crystal between a region with spare electrons and a region short of them. Current crosses it in one direction only, and it can turn light into electricity or electricity into light.",
          here: "The LED chip is a p–n junction. When current is pushed across the boundary, electrons drop into the gaps waiting on the other side and give up their energy as light.",
          story: "In the 1930s Russell Ohl was working at Bell Labs on crystal detectors for radio and radar. These were erratic: one piece of silicon would work well and the next would not, and nobody knew why. Only a handful of people in the organisation understood what he was doing. In 1939 he found a piece of silicon that behaved strangely. Current would pass through it one way but not the other, and when light fell on it a voltage appeared. Ohl traced the cause to a boundary inside the crystal. Tiny traces of different impurities had gathered on either side of it, leaving one side with spare electrons and the other short of them. The boundary became known as the p–n junction. He went on to patent the modern solar cell. Every diode, LED and transistor since is built from such junctions.",
          read: [
            { label: "p–n junction", wiki: "P–n_junction" },
            { label: "Russell Ohl", wiki: "Russell_Ohl" },
          ],
          people: [
            { name: "Russell Ohl", life: "1898 – 1987", role: "American scientist at Bell Labs, generally recognised for patenting the modern solar cell.", wiki: "Russell_Ohl" },
          ],
          uses: ["Solar panels", "LEDs and laser pointers", "Phone chargers, as diodes", "Transistors and computer chips", "Camera sensors"],
          timeline: [
            ["1939", "Ohl discovers the p–n junction at Bell Labs."],
            ["1947", "The first transistor is made at Bell Labs."],
            ["1949", "William Shockley publishes the theory of the p–n junction."],
            ["1962", "The first practical visible LED is a p–n junction that gives off red light."],
          ],
        },
      ],
    },
    {
      id: 'head',
      name: 'Head housing',
      anchor: [-0.58, 1.7, 0.58],
      explode: [0, 1.0, 0],
      make: () =>
        group(
          lathe(
            [[0.5, 0.8], [0.52, 0.8], [0.52, 0.98], [0.56, 1.03], [0.8, 1.45], [0.82, 1.5], [0.82, 1.95], [0.79, 2.0], [0.75, 2.0], [0.75, 1.5], [0.51, 1.06], [0.5, 0.8]],
            anodised({ side: THREE.DoubleSide })
          ),
          ring(0.82, 0.016, 1.58, anodised()),
          ring(0.82, 0.016, 1.68, anodised()),
          ring(0.82, 0.016, 1.78, anodised()),
          ring(0.52, 0.012, 0.88, anodised())
        ),
      inventions: [
        {
          name: 'Anodising',
          kind: 'process',
          year: '1923',
          by: 'Guy Bengough & John Stuart',
          what: 'Running current through aluminium in an acid bath grows a hard, dyeable oxide skin that is part of the metal rather than a coat of paint.',
          here: 'The matte black finish resists scratches and corrosion, and electrically insulates the outside of a body that is carrying current inside.',
          story:
            "After the First World War, aircraft makers turned to duralumin, an aluminium alloy almost as strong as steel at a third of the weight. It had one serious flaw: it corroded, and seaplanes that sat in salt water suffered most. Guy Bengough had spent years studying why metals corrode in sea water. With John Stuart he found that instead of painting the metal, they could make it the positive electrode in a bath of chromic acid. The current grows a thick layer of aluminium oxide on the surface, part of the metal itself rather than a coating on top. From 1923 it protected British seaplane parts, and a cheaper sulphuric-acid version followed in 1927.",
          read: [{ label: "Anodizing", wiki: "Anodizing" }, { label: "Duralumin", wiki: "Duralumin" }],
          people: [
            { name: 'Guy Dunstan Bengough', life: 'Active 1923', role: 'British metallurgist who studied why metals corrode in sea water.', wiki: null },
            { name: 'John McArthur Stuart', life: 'Active 1923', role: 'British chemist and co-holder of the original anodising patent.', wiki: null },
          ],
          uses: ['Aircraft parts', 'Cookware', 'Phone and laptop casings', 'Climbing carabiners', 'Window frames'],
          timeline: [
            ['1923', 'Chromic-acid anodising protects the duralumin of British seaplanes.'],
            ['1927', 'Gower and O’Brien patent the sulphuric-acid process still used today.'],
            ['1960s', 'Anodised aluminium becomes a standard for building façades.'],
            ['2000s', 'Dyed anodised shells become common on phones, laptops and music players.'],
          ],
        },
      ],
    },
    {
      id: 'reflector',
      name: 'Parabolic reflector',
      anchor: [-0.43, 1.6, 0.43],
      explode: [0, 2.4, 0],
      make: () => lathe(reflectorProfile(), metal(0xe8eaee, { roughness: 0.16, side: THREE.DoubleSide, envMapIntensity: 1.0 })),
      inventions: [
        {
          name: 'Parabolic reflector',
          kind: 'discovery',
          kindNote: 'Curved mirrors are older. What Diocles found was the mathematical shape that brings light to a single point.',
          year: 'c. 200 BC',
          by: 'Diocles',
          what: 'Diocles proved that a parabola sends every ray from its focus out in parallel lines — the geometry behind lighthouses, headlamps and satellite dishes.',
          here: 'The LED sits at the focus. Light that would spill sideways is bounced forward into one tight beam that reaches across a field.',
          story:
            "Greek mathematicians were fascinated by “burning mirrors”, which concentrate sunlight to start a fire; legends even claimed Archimedes set Roman ships alight with them. An ordinary curved mirror, shaped like part of a sphere, blurs the light into a smudge instead of a single point. Around 200 BC, Diocles worked out exactly which shape focuses all the sun’s parallel rays onto one spot: the parabola. He set out the proof in a book called On Burning Mirrors. The Greek original was lost, but the work survived in Arabic translation. Run the light the other way, putting a lamp at the focus, and the same shape sends out a narrow beam.",
          read: [{ label: "Diocles (mathematician)", wiki: "Diocles_(mathematician)" }, { label: "Parabolic reflector", wiki: "Parabolic_reflector" }],
          people: [{ name: 'Diocles', life: 'c. 240 – c. 180 BC', role: 'Greek mathematician. His treatise “On Burning Mirrors” survives only in Arabic translation.', wiki: 'Diocles_(mathematician)' }],
          uses: ['Car headlamps', 'Satellite dishes', 'Radio telescopes', 'Solar concentrators', 'Lighting the Olympic flame'],
          timeline: [
            ['c. 200 BC', 'Diocles proves the focal property of the parabola.'],
            ['1721', 'John Hadley builds a reflecting telescope with a parabolic mirror.'],
            ['18th c.', 'Lighthouses begin using parabolic mirrors to turn a lamp into a beam.'],
            ['1888', 'Heinrich Hertz focuses radio waves with a parabolic reflector.'],
            ['1937', 'Grote Reber builds the first parabolic radio telescope in his yard.'],
          ],
        },
      ],
    },
    {
      id: 'lens',
      name: 'Front lens',
      anchor: [0, 1.93, 0],
      explode: [0, 3.2, 0],
      seeThrough: true,
      make: () => cyl(0.74, 0.74, 0.04, 1.9, glass({ thickness: 0.04, color: 0xf2f8ff })),
      inventions: [
        {
          name: 'Polycarbonate',
          kind: 'material',
          year: '1953',
          by: 'Hermann Schnell (Bayer) & Daniel Fox (GE)',
          what: 'Discovered independently within days of each other: a clear plastic far tougher under impact than glass.',
          here: 'The window keeps water and grit off the reflector and LED, and survives the drops that would shatter a glass lens.',
          story:
            "Polycarbonate was first made in 1898 by the German chemist Alfred Einhorn, but it came out as a brittle oddity, and the idea was set aside for half a century. In 1953 it was found twice within about a week. At Bayer, Hermann Schnell was researching new plastics and produced the first linear polycarbonate. At General Electric in Massachusetts, Daniel Fox was trying to develop a better insulation for electrical wires, and made a branched version that turned out to be clear and unusually tough. The two companies argued over who came first; Bayer won priority. Bayer sold it as Makrolon from 1958, and General Electric as Lexan from 1960.",
          read: [{ label: "Polycarbonate", wiki: "Polycarbonate" }, { label: "Daniel Fox (chemist)", wiki: "Daniel_Fox_(chemist)" }],
          people: [
            { name: 'Hermann Schnell', life: 'Active 1953', role: 'German chemist at Bayer; his polycarbonate was sold as Makrolon.', wiki: 'Hermann_Josef_Schnell' },
            { name: 'Daniel W. Fox', life: 'Died 1989', role: 'American chemist at General Electric; his version was sold as Lexan.', wiki: 'Daniel_Fox_(chemist)' },
          ],
          uses: ['Safety glasses', 'CDs and DVDs', 'Helmet visors', 'Riot shields', 'Spectacle lenses'],
          timeline: [
            ['1898', 'Alfred Einhorn first makes polycarbonate in a lab; nobody finds a use.'],
            ['1953', 'Schnell and Fox rediscover it a week apart.'],
            ['1958', 'Bayer starts commercial production; GE follows in 1960.'],
            ['1969', 'Apollo astronauts walk on the Moon in polycarbonate helmets.'],
            ['1982', 'The compact disc is moulded from polycarbonate.'],
          ],
        },
      ],
    },
  ],
};
