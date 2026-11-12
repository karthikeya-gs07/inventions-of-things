import * as THREE from 'three';
import { mat, metal, cyl, lathe, ring, wire, group } from './helpers.js';

// A round charging pad lying flat on the grid. +Y is up; the cable leaves along +X.
// Layers from the bottom: base, circuit board, ferrite sheet, coil, top cover.
const R = 1.3;

const copper = () => metal(0xc97b3d, { roughness: 0.35 });
const chipMat = () => mat(0x101113, { roughness: 0.35 });

const box = (w, h, d, [x, y, z], material) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  return m;
};

class Spiral extends THREE.Curve {
  constructor(r0, r1, turns, y) {
    super();
    Object.assign(this, { r0, r1, turns, y });
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2;
    const r = this.r0 + (this.r1 - this.r0) * t;
    return target.set(Math.cos(a) * r, this.y, Math.sin(a) * r);
  }
}

export default {
  id: 'charger',
  name: 'Wireless charger',
  blurb:
    'Put a phone on it and the battery fills with no plug. A coil in the pad and a coil in the phone form a transformer with a small gap, an effect found in 1831.',
  timeline: [
    ['1831', 'Michael Faraday discovers that a changing magnetic field drives a current in a nearby wire.'],
    ['1890s', 'Nikola Tesla lights lamps across a stage with no wires.'],
    ['1970s', 'Electric toothbrushes that charge on a sealed stand are on sale.'],
    ['2008', 'Companies form the Wireless Power Consortium to agree one standard.'],
    ['2010', 'Version 1.0 of the Qi standard is released.'],
    ['2012', 'The Nokia Lumia 920 is among the first phones with Qi charging built in.'],
  ],
  parts: [
    {
      id: 'top',
      name: 'Charging surface',
      anchor: [0.45, 0.31, 0.45],
      explode: [0, 1.75, 0],
      make: () =>
        group(
          lathe([[0, 0.25], [1.2, 0.25], [1.2, 0.2], [R, 0.2], [R, 0.225], [1.27, 0.265], [1.16, 0.29], [0, 0.295]], mat(0xdfe2e6, { roughness: 0.75, side: THREE.DoubleSide })),
          ring(0.62, 0.006, 0.296, mat(0xa9aeb6, { roughness: 0.7 }))
        ),
      inventions: [
        {
          name: 'Silicone rubber',
          kind: 'material',
          year: '1901',
          by: 'Frederic Kipping and James Franklin Hyde',
          what: 'A rubbery material whose backbone is silicon and oxygen, the ingredients of sand and glass, instead of carbon. It stays soft and stable from freezing cold to oven heat.',
          here: 'The soft, grippy top stops a glass-backed phone from sliding off. It does not conduct electricity and shrugs off the warmth of charging.',
          story:
            "At the start of the twentieth century the English chemist Frederic Kipping spent decades making compounds that joined silicon to carbon. In 1901 he named one family of them silicones. He studied them for their chemistry and did not look for a use. In 1931 the American glass maker Corning hired its first organic chemist, James Franklin Hyde, because new plastics were starting to compete with glass. Hyde was asked to find a binder for glass fibres that could stand more heat than existing resins. He followed Kipping’s recipes and produced a fluid that set into a rubbery mass, a silicone that kept its properties at high temperatures. It was needed for wartime electrical insulation. In 1943 Corning and Dow Chemical founded Dow Corning to make it.",
          read: [{ label: 'Silicone', wiki: 'Silicone' }, { label: 'James Franklin Hyde', wiki: 'James_Franklin_Hyde' }],
          people: [
            { name: 'Frederic Kipping', life: '1863 – 1949', role: 'English chemist who did much of the pioneering work on silicon compounds and coined the word silicone.', wiki: 'Frederic_Kipping' },
            { name: 'James Franklin Hyde', life: '1903 – 1999', role: 'American chemist at Corning, called the father of silicones. He also invented a way to make very pure glass.', wiki: 'James_Franklin_Hyde' },
          ],
          uses: ['Bakeware and kitchen spatulas', 'Bathroom sealant', 'Medical tubing and implants', 'Phone cases', 'Wire insulation'],
          timeline: [
            ['1901', 'Kipping coins the word “silicone”.'],
            ['1931', 'Hyde joins Corning Glass Works.'],
            ['1943', 'Dow Corning is formed to produce silicone products.'],
          ],
        },
      ],
    },
    {
      id: 'coil',
      name: 'Charging coil',
      anchor: [0.72, 0.24, 0],
      explode: [0, 1.25, 0],
      make: () =>
        group(
          new THREE.Mesh(new THREE.TubeGeometry(new Spiral(0.38, 0.98, 11, 0.215), 520, 0.024, 6), copper()),
          wire([[0.38, 0.215, 0], [0.2, 0.2, -0.12], [0.05, 0.2, -0.5], [0.1, 0.2, -1.0]], 0.02, copper()),
          wire([[0.98, 0.215, 0], [1.02, 0.2, -0.2], [0.7, 0.2, -0.9], [0.3, 0.2, -1.05]], 0.02, copper())
        ),
      inventions: [
        {
          name: 'Electromagnetic induction',
          kind: 'discovery',
          kindNote: 'Faraday did not invent induction; he discovered a law of nature. Every transformer and charger is built on it.',
          year: '1831',
          by: 'Michael Faraday',
          what: 'A magnetic field that is changing drives an electric current in any wire it passes through. Two coils can therefore pass energy to each other without touching.',
          here: 'Current in this coil reverses more than a hundred thousand times a second. The rapidly changing magnetic field reaches a matching coil in the phone and drives a current there.',
          story:
            "In 1820 Hans Christian Ørsted showed that an electric current produces magnetism. Scientists across Europe then asked the reverse question: can magnetism produce electricity? For ten years nobody could make it work, because they were looking for a steady effect. On 29 August 1831, at the Royal Institution in London, Michael Faraday wound two separate coils of wire on opposite sides of an iron ring. He connected one to a battery and watched a meter on the other. The needle jumped at the instant he connected the battery, and again when he disconnected it, but showed nothing in between. Only a changing magnetic field produces a current. Faraday, a blacksmith’s son with almost no schooling, had found the principle behind every generator and transformer.",
          read: [{ label: 'Electromagnetic induction', wiki: 'Electromagnetic_induction' }, { label: 'Michael Faraday', wiki: 'Michael_Faraday' }],
          people: [
            { name: 'Michael Faraday', life: '1791 – 1867', role: 'English scientist who began as a bookbinder’s apprentice and became the leading experimenter of his age.', wiki: 'Michael_Faraday' },
            { name: 'Joseph Henry', life: '1797 – 1878', role: 'American physicist who found induction independently in 1832 and later led the Smithsonian Institution.', wiki: 'Joseph_Henry' },
          ],
          uses: ['Power-station generators', 'Transformers', 'Induction hobs', 'Electric guitar pickups', 'Contactless cards'],
          timeline: [
            ['1820', 'Hans Christian Ørsted finds that an electric current deflects a compass needle.'],
            ['1831', 'Faraday discovers induction with two coils on an iron ring.'],
            ['1832', 'Joseph Henry discovers it independently.'],
            ['1880s', 'Transformers based on induction make long-distance power lines practical.'],
          ],
        },
        {
          name: 'Wireless power transfer',
          kind: 'technique',
          year: '1891',
          by: 'Nikola Tesla',
          what: 'Sending useful electrical power across a gap. It works far better when the sending and receiving coils are tuned to the same frequency, like two matching tuning forks.',
          here: 'The pad and the phone are tuned to each other. The phone also sends signals back through the same coils, to ask for more or less power and to say when it is full.',
          story:
            "After 1890 Nikola Tesla, already famous for his alternating-current motor, began experimenting with currents that alternate very rapidly. With the high-voltage coils that now carry his name he lit lamps held in his hand or placed across a stage, with no wires attached, in a series of public demonstrations. He found that a lamp could be lit from further away if its circuit was tuned to resonate with the transmitter. Tesla then set out to send power around the world. In 1901 he began a great tower at Wardenclyffe, near New York, but the money ran out and it was never finished. His method of tuned coils survived. It was used from the 1960s to power medical implants through the skin, and later in toothbrushes and phones.",
          read: [{ label: 'Wireless power transfer', wiki: 'Wireless_power_transfer' }, { label: 'Qi (standard)', wiki: 'Qi_(standard)' }],
          people: [{ name: 'Nikola Tesla', life: '1856 – 1943', role: 'Serbian-American engineer and inventor, best known for the alternating-current systems that power the world.', wiki: 'Nikola_Tesla' }],
          uses: ['Electric toothbrushes', 'Smartwatches and earbuds', 'Medical implants', 'Electric car charging pads', 'Contactless payment cards'],
          timeline: [
            ['1891', 'Tesla demonstrates lamps lit without wires in public lectures.'],
            ['1892', 'Maurice Hutin and Maurice Leblanc patent a way to power trains by induction.'],
            ['1901', 'Tesla starts building the Wardenclyffe tower. It is never completed.'],
            ['2008', 'The Wireless Power Consortium is formed.'],
            ['2010', 'Version 1.0 of the Qi standard is released.'],
          ],
        },
        {
          name: "Closed-core transformer",
          kind: "invention",
          year: "1885",
          by: "Ottó Bláthy, Miksa Déri and Károly Zipernowsky",
          what: "Two coils sharing one iron core. Alternating current in one coil induces a current in the other, and the ratio of their turns sets the voltage.",
          here: "The coil in the pad and the matching coil in the phone form a transformer split in two, with a gap where the iron core would be.",
          story: "Faraday’s iron ring of 1831 was in effect the first transformer, but he only ever sent brief pulses through it. In 1881 Lucien Gaulard of France and John Dixon Gibbs of England showed a device in London for passing alternating current from one coil to another, and in 1884 it was adopted for an electric lighting system in Turin. It used an open core, a straight bundle of iron, and could not hold the voltage steady. That autumn three engineers at the Ganz works in Budapest, Károly Zipernowsky, Ottó Bláthy and Miksa Déri, concluded that open cores were impractical. Bláthy suggested closing the iron into a loop around the coils, Zipernowsky suggested connecting the devices side by side, and Déri ran the experiments. Their closed-core transformer of 1885 made it practical to bring electric light into homes. Bláthy also gave it its name.",
          read: [
            { label: "Transformer", wiki: "Transformer" },
            { label: "Ottó Bláthy", wiki: "Ottó_Bláthy" },
          ],
          people: [
            { name: "Ottó Bláthy", life: "1860 – 1939", role: "Hungarian engineer who also co-invented the alternating-current electricity meter.", wiki: "Ottó_Bláthy" },
            { name: "Miksa Déri", life: "1854 – 1938", role: "Hungarian engineer and power-station builder who carried out the experiments.", wiki: "Miksa_Déri" },
            { name: "Károly Zipernowsky", life: "1853 – 1942", role: "Vienna-born Hungarian engineer who proposed connecting transformers side by side.", wiki: "Károly_Zipernowsky" },
          ],
          uses: ["Power-station substations", "Phone and laptop chargers", "Doorbells", "Welding machines", "Audio equipment"],
          timeline: [
            ["1831", "Faraday’s iron ring works as a transformer, but only for brief pulses."],
            ["1881", "Gaulard and Gibbs show an open-core device in London."],
            ["1885", "The closed-core transformer is invented at the Ganz works in Budapest."],
            ["1885", "William Stanley builds the first practical American transformer for Westinghouse."],
          ],
        },
      ],
    },
    {
      id: 'ferrite',
      name: 'Ferrite shield',
      anchor: [-0.6, 0.19, 0.5],
      explode: [0, 0.85, 0],
      make: () => group(cyl(1.1, 1.1, 0.03, 0.17, mat(0x2a2b2f, { roughness: 0.65, metalness: 0.35 }), 64)),
      inventions: [
        {
          name: 'Ferrite',
          kind: 'material',
          year: '1930',
          by: 'Yogoro Kato and Takeshi Takei',
          what: 'A dark ceramic made mostly of iron oxide. It guides magnetic fields as iron does, but it does not conduct electricity, so rapidly changing fields do not waste energy heating it.',
          here: 'The sheet under the coil steers the magnetic field upward into the phone. It also keeps the field away from the circuit board and from a metal table underneath.',
          story:
            "Iron is good at guiding magnetism, but in a rapidly changing magnetic field it wastes energy. The field drives swirling currents inside the metal, and they turn into heat. Radio engineers of the 1920s needed a magnetic material without that fault. In 1930 Yogoro Kato and Takeshi Takei, at the Tokyo Institute of Technology, made the first ferrites: ceramics fired from iron oxide mixed with the oxides of other metals. Because a ceramic does not conduct electricity, the wasteful currents cannot flow. The material was cheap and did not rust. In 1935 Kenzo Saito founded a company in Tokyo to manufacture it. That company, TDK, later became known around the world for the magnetic tape in audio cassettes.",
          read: [{ label: 'Ferrite (magnet)', wiki: 'Ferrite_(magnet)' }, { label: 'TDK', wiki: 'TDK' }],
          people: [
            { name: 'Yogoro Kato', life: 'Active 1930', role: 'Japanese chemist and professor at the Tokyo Institute of Technology.', wiki: null, link: 'Ferrite_(magnet)' },
            { name: 'Takeshi Takei', life: 'Active 1930', role: 'Japanese chemist who worked with Kato and made ferrites his life’s work.', wiki: null, link: 'Ferrite_(magnet)' },
          ],
          uses: ['Radio aerials', 'The lumps on computer cables', 'Phone and laptop chargers', 'Fridge magnets', 'Loudspeaker magnets'],
          timeline: [
            ['1930', 'Kato and Takei make the first ferrite compounds.'],
            ['1935', 'TDK is founded in Tokyo to manufacture ferrite.'],
            ['1950', 'A ferrite strong enough for permanent magnets is discovered at Philips.'],
          ],
        },
      ],
    },
    {
      id: 'board',
      name: 'Circuit board',
      anchor: [0.3, 0.13, 0.75],
      explode: [0, 0.42, 0],
      make: () => {
        const g = group(
          cyl(1.16, 1.16, 0.02, 0.09, mat(0x1f5a3c, { roughness: 0.55 }), 64),
          box(0.3, 0.035, 0.3, [0.2, 0.117, 0.55], chipMat()),
          box(0.16, 0.03, 0.22, [0.7, 0.115, 0.2], chipMat()),
          box(0.14, 0.03, 0.1, [-0.2, 0.115, 0.8], chipMat()),
          box(0.2, 0.06, 0.2, [-0.55, 0.13, -0.35], mat(0x3a3c41, { roughness: 0.6 }))
        );
        // Four power transistors in a row, and a few capacitors
        for (let i = 0; i < 4; i++) g.add(box(0.13, 0.03, 0.16, [-0.75 + i * 0.2, 0.115, 0.3], chipMat()));
        for (const [x, z] of [[0.55, -0.5], [0.75, -0.3], [-0.1, -0.75]]) g.add(cyl(0.06, 0.06, 0.07, 0.135, metal(0xb9bcc2, { roughness: 0.4 }), 20).translateX(x).translateZ(z));
        return g;
      },
      inventions: [
        {
          name: 'Printed circuit board',
          kind: 'invention',
          year: '1936',
          by: 'Paul Eisler',
          what: 'A flat insulating board with the wiring printed on it as thin copper tracks. Components are soldered straight onto the board, with no loose wires.',
          here: 'The green disc carries every electronic part of the charger. Machines can make and fill thousands of identical boards an hour.',
          story:
            "In the 1930s every radio was wired by hand, one connection at a time, which was slow and prone to mistakes. Paul Eisler, an engineer from Vienna, could not get engineering work there and spent some years in printing instead. In 1936 he came to England. Living in a boarding house in Hampstead, without a job or a work permit, he built a radio whose wiring was printed as copper foil on a board. Nobody was interested. When war came he was interned as an enemy alien. After his release in 1941 a printing firm backed the idea. It was the United States that first used it widely, in the proximity fuze, a shell that senses its target. Printed circuits spread to all electronics after the war.",
          read: [{ label: 'Paul Eisler', wiki: 'Paul_Eisler' }, { label: 'Printed circuit board', wiki: 'Printed_circuit_board' }],
          people: [{ name: 'Paul Eisler', life: '1907 – 1992', role: 'Austrian engineer who settled in Britain. Few companies paid to use his patents, and he earned little from the invention.', wiki: 'Paul_Eisler' }],
          uses: ['Phones and computers', 'Televisions', 'Cars', 'Washing machines', 'Toys'],
          timeline: [
            ['1903', 'Albert Hanson describes flat foil conductors laminated to an insulating board.'],
            ['1936', 'Eisler builds a radio with a printed circuit in London.'],
            ['1943', 'Eisler applies for his patents, and the United States begins using printed circuits in proximity fuzes.'],
            ['1948', 'The United States opens the technology to commercial use.'],
          ],
        },
        {
          name: 'MOSFET transistor',
          kind: 'invention',
          year: '1959',
          by: 'Mohamed Atalla and Dawon Kahng',
          what: 'An electronic switch with no moving parts. A tiny voltage on one terminal turns a much larger current on or off, and it takes almost no power to hold it there.',
          here: 'Four of them chop the steady current from the cable into the rapid alternating current the coil needs. Millions more, far smaller, are inside the control chip.',
          story:
            "The first transistors, made at Bell Labs in 1947, were not the kind its scientists had set out to build. They had wanted a switch controlled by an electric field, an idea Julius Lilienfeld had patented in 1925. It failed every time, because electrons became trapped at the surface of the semiconductor. In the 1950s researchers at Bell Labs found that a thin layer of oxide grown on silicon tamed the surface. Mohamed Atalla, an Egyptian-born engineer, saw that this made the old idea possible, and in 1959 he and Dawon Kahng, who had come from Korea, proposed a transistor built on that layer. Their team showed it working in 1960. Simple to make and easy to shrink, it became the most widely used transistor of all.",
          read: [{ label: 'MOSFET', wiki: 'MOSFET' }, { label: 'Mohamed M. Atalla', wiki: 'Mohamed_M._Atalla' }],
          people: [
            { name: 'Mohamed Atalla', life: '1924 – 2009', role: 'Egyptian-American engineer at Bell Labs who later founded a company that made security systems for banks.', wiki: 'Mohamed_M._Atalla' },
            { name: 'Dawon Kahng', life: '1931 – 1992', role: 'Korean-American engineer at Bell Labs. He also co-invented the memory cell that flash memory is built on.', wiki: 'Dawon_Kahng' },
          ],
          uses: ['Computer processors', 'Memory chips', 'Phone chargers', 'Electric car inverters', 'LED light bulbs'],
          timeline: [
            ['1925', 'Julius Lilienfeld patents the idea of a field-effect transistor.'],
            ['1947', 'The first working transistor, of a different type, is made at Bell Labs.'],
            ['1959', 'Atalla and Kahng propose the silicon MOS transistor.'],
            ['1960', 'Their team demonstrates a working device.'],
            ['1964', 'The first commercial MOS integrated circuit goes on sale.'],
          ],
        },
      ],
    },
    {
      id: 'base',
      name: 'Base',
      anchor: [-0.9, 0.12, 0.95],
      explode: [0, 0, 0],
      make: () =>
        group(
          lathe([[0, 0.02], [1.18, 0.02], [R, 0.07], [R, 0.2], [1.24, 0.2], [1.24, 0.06], [0, 0.06]], mat(0x2b2e33, { roughness: 0.5, side: THREE.DoubleSide })),
          ring(1.05, 0.03, 0.02, mat(0x101113, { roughness: 0.95 })),
          box(0.05, 0.02, 0.012, [0, 0.13, R + 0.002], mat(0x4d9fff, { emissive: 0x4d9fff, emissiveIntensity: 1.2 }))
        ),
      inventions: [
        {
          name: 'Injection moulding',
          kind: 'process',
          year: '1872',
          by: 'John Wesley Hyatt',
          what: 'Melted plastic is forced into a shaped steel mould, cools in seconds and drops out as a finished part. The same mould can make millions.',
          here: 'The base, with its rim, screw posts and the opening for the socket, comes out of the mould in one piece.',
          story:
            "In 1863 Michael Phelan, a maker of billiard tables, offered ten thousand dollars for a substitute for ivory, which was costly and running short. John Wesley Hyatt, a young printer in Albany, New York, took up the challenge. Working with his brother Isaiah, he found a reliable way to make a hard, mouldable material from treated cotton, and patented it in 1869 as celluloid. It is often counted as the first plastic to succeed commercially. The brothers then needed a way to shape it. In 1872 they patented a machine that worked like a large syringe, with a plunger pushing the softened material through a heated cylinder into a mould. It made buttons, combs and collar stays. Almost every plastic object is now made by its descendants.",
          read: [{ label: 'Injection moulding', wiki: 'Injection_moulding' }, { label: 'John Wesley Hyatt', wiki: 'John_Wesley_Hyatt' }],
          people: [{ name: 'John Wesley Hyatt', life: '1837 – 1920', role: 'American inventor with more than two hundred patents, who began work as a printer at sixteen.', wiki: 'John_Wesley_Hyatt' }],
          uses: ['Toy building bricks', 'Bottle caps', 'Car dashboards', 'Phone and remote-control cases', 'Chairs and storage boxes'],
          timeline: [
            ['1869', 'Hyatt patents celluloid.'],
            ['1872', 'John and Isaiah Hyatt patent an injection moulding machine.'],
            ['1919', 'Arthur Eichengrün develops an injection moulding press.'],
            ['1946', 'James Watson Hendry builds the first screw injection machine, the type used today.'],
          ],
        },
      ],
    },
    {
      id: 'usb',
      name: 'Cable and USB-C socket',
      anchor: [1.62, 0.16, 0],
      explode: [0.75, 0, 0],
      make: () =>
        group(
          box(0.26, 0.07, 0.24, [R + 0.03, 0.125, 0], metal(0xc9ccd2, { roughness: 0.3 })),
          box(0.34, 0.11, 0.3, [R + 0.33, 0.125, 0], mat(0x202226, { roughness: 0.6 })),
          wire([[R + 0.5, 0.125, 0], [R + 0.9, 0.1, 0.02], [R + 1.3, 0.06, 0.2], [R + 1.55, 0.05, 0.6], [R + 1.6, 0.05, 1.1]], 0.045, mat(0x202226, { roughness: 0.7 }))
        ),
      inventions: [
        {
          name: 'USB',
          kind: 'standard',
          year: '1996',
          by: 'Ajay Bhatt and a team at Intel, with six other companies',
          what: 'One standard plug and one set of rules for connecting devices, carrying both data and electrical power down the same cable.',
          here: 'The pad draws its power through a USB-C socket, so the cable and plug that charge a laptop or phone will run it too.',
          story:
            "In the early 1990s the back of a personal computer was a row of different sockets: one shape for the keyboard, another for the mouse, others for printers and joysticks. Adding a device often meant opening the case, fitting a card and adjusting settings by hand. In the mid-1990s seven companies, among them Intel, Microsoft, IBM and Compaq, agreed to replace them all with one simple connector that also supplied power. Ajay Bhatt led the work at Intel, which made the first chips to support it in 1995. Version 1.0 was published in January 1996. It took off after 1998, when Apple’s iMac dropped the older sockets in favour of USB. The small plug that fits either way up, USB-C, followed in 2014.",
          read: [{ label: 'USB', wiki: 'USB' }, { label: 'USB-C', wiki: 'USB-C' }],
          people: [{ name: 'Ajay Bhatt', life: 'Born 1957', role: 'Indian-American computer architect who joined Intel in 1990 and holds more than a hundred patents.', wiki: 'Ajay_Bhatt' }],
          uses: ['Phone and laptop chargers', 'Memory sticks', 'Keyboards and mice', 'Printers', 'Sockets in cars, trains and aircraft seats'],
          timeline: [
            ['1995', 'Seven companies begin developing USB, and Intel makes the first chips for it.'],
            ['1996', 'USB 1.0 is released.'],
            ['1998', 'The iMac ships with USB in place of older ports.'],
            ['2014', 'The reversible USB-C connector is published.'],
          ],
        },
      ],
    },
  ],
};
