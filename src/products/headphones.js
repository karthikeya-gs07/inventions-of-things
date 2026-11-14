import * as THREE from 'three';
import { mat, metal, cyl, lathe, ring, wire, tube, group } from './helpers.js';

// Standing on its ear cups, facing the viewer. X runs ear to ear, +Y is up.
// Each cup is built in "cup space" (y = 0 at the face that meets the ear, +y pointing
// away from the head) and then turned so that +y points outward along X.
const CX = 0.8, CY = 0.64; // cup centre: distance from the middle, height above the grid

const shellMat = () => mat(0x2b2e33, { roughness: 0.55, side: THREE.DoubleSide });
const soft = () => mat(0x15161a, { roughness: 0.95 });
const steel = () => metal(0xc3c7cd, { roughness: 0.35 });
const copper = () => metal(0xc57a3c, { roughness: 0.4 });

function onCup(sign, ...children) {
  const g = group(...children);
  g.rotation.z = (-sign * Math.PI) / 2;
  g.position.set(sign * CX, CY, 0);
  return g;
}
const both = (build) => group(onCup(1, ...build(1)), onCup(-1, ...build(-1)));

function arc(rx, ry, cy, from, to, n = 24) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    pts.push([Math.cos(a) * rx, cy + Math.sin(a) * ry, 0]);
  }
  return pts;
}

function band(points, r, widen, material) {
  const m = wire(points, r, material);
  m.scale.z = widen;
  return m;
}

function yoke(sign) {
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI;
    pts.push([sign * (CX + 0.17), CY + Math.sin(a) * 0.68, Math.cos(a) * 0.68]);
  }
  const pin = (z) => {
    const p = cyl(0.045, 0.045, 0.08, 0, steel(), 16);
    p.rotation.x = Math.PI / 2;
    p.position.set(sign * (CX + 0.17), CY, z);
    return p;
  };
  return group(
    wire(pts, 0.035, steel()),
    pin(0.64), pin(-0.64),
    tube([sign * (CX + 0.17), CY + 0.66, 0], [sign * 1.0, CY + 1.02, 0], 0.04, steel())
  );
}

export default {
  id: 'headphones',
  name: 'Headphones',
  blurb:
    'A pair of tiny loudspeakers worn on the head. Modern wireless ones also carry a radio, a battery and microphones that listen to the room so they can erase its noise.',
  timeline: [
    ['1880s', 'Telephone operators wear a single heavy earpiece that rests on the shoulder.'],
    ['1910', 'Nathaniel Baldwin builds sensitive headsets by hand and sells them to the US Navy.'],
    ['1958', 'John C. Koss makes the first stereo headphones for listening to music.'],
    ['1979', 'The Sony Walkman takes headphones out of the house and onto the street.'],
    ['1989', 'Bose sells a noise-cancelling headset to pilots.'],
    ['1999', 'The first Bluetooth device is shown: a hands-free mobile headset.'],
  ],
  parts: [
    {
      id: 'headband',
      name: 'Headband',
      anchor: [0, CY + 1.87, 0.1],
      explode: [0, 0.9, 0],
      make: () =>
        group(
          band(arc(1.0, 0.8, CY + 1.0, 0, Math.PI), 0.05, 3, mat(0x2b2e33, { roughness: 0.55 })),
          band(arc(0.93, 0.72, CY + 1.0, Math.PI * 0.28, Math.PI * 0.72, 14), 0.06, 2.4, soft()),
          yoke(1), yoke(-1)
        ),
      inventions: [
        {
          name: 'Headband headset',
          kind: 'design',
          kindNote: 'Baldwin himself thought joining two earpieces with a band was too trivial to patent.',
          year: '1910',
          by: 'Nathaniel Baldwin',
          what: 'Two earpieces joined by a sprung band over the head, so both ears are covered and both hands stay free.',
          here: 'The arched band presses a cup gently on each ear. Steel sliders and pivoting forks let it fit different heads.',
          story:
            "Nathaniel Baldwin, an engineer in Utah, could not hear the sermons properly in his large church. Around 1910 he began experimenting with sound amplified by compressed air, and from that work made a far more sensitive telephone earpiece. He fitted two of them to a band worn over the head and sent a pair to the United States Navy for testing. The Navy found them better than anything it had and ordered a hundred. Baldwin built the first ones by hand in his kitchen. The Navy suggested he patent the headset assembly, but he declined, considering it trivial; only the earpieces themselves were patented. His company later made headsets for the radio boom of the 1920s.",
          read: [{ label: 'Nathaniel Baldwin', wiki: 'Nathaniel_Baldwin' }, { label: 'Headphones', wiki: 'Headphones' }],
          people: [{ name: 'Nathaniel Baldwin', life: '1878 – 1961', role: 'American inventor and industrialist from Utah. He made his first headsets by hand in his kitchen.', wiki: 'Nathaniel_Baldwin' }],
          uses: ['Aviation headsets', 'Call-centre headsets', 'Ear defenders', 'Gaming headsets', 'Studio monitoring'],
          timeline: [
            ['1880s', 'Telephone operators use a single receiver held on the shoulder.'],
            ['1910', 'Baldwin builds a two-ear headset and offers it to the US Navy.'],
            ['1919', 'Sensitive headphones such as those made by Brandes are common for early radio.'],
            ['1958', 'John C. Koss produces stereo headphones for music.'],
          ],
        },
      ],
    },
    {
      id: 'cups',
      name: 'Ear cups',
      anchor: [-(CX + 0.38), CY + 0.1, 0.25],
      explode: [0, 0, 0],
      make: () =>
        both(() => [
          lathe([[0.56, 0], [0.6, 0.05], [0.6, 0.2], [0.56, 0.3], [0.44, 0.365], [0.2, 0.385], [0, 0.39]], shellMat()),
          ring(0.3, 0.008, 0.384, steel()),
        ]),
      inventions: [
        {
          name: 'Stereophonic sound',
          kind: 'technique',
          year: '1931',
          by: 'Alan Blumlein',
          what: 'Two separate channels of sound, one for each ear. Small differences between them let the brain place each voice and instrument in space.',
          here: 'There are two cups because there are two channels. The left and right cups play slightly different sound, which is why music seems to sit around your head.',
          story:
            "In early 1931 Alan Blumlein, a young engineer in London, went to the cinema with his wife. The early talking pictures had a single set of loudspeakers, so an actor could be on one side of the screen while the voice came from the other. Blumlein told his wife he had found a way to make the sound follow the actor. That year he joined the newly formed company EMI and wrote down his idea, which he called binaural sound: two microphones, two channels and two loudspeakers. His patent, applied for in December 1931, described almost everything stereo would need, including how to cut two channels into one record groove. Blumlein died in 1942, aged 38, while testing a secret airborne radar. Stereo records only reached the shops in the late 1950s.",
          read: [{ label: 'Alan Blumlein', wiki: 'Alan_Blumlein' }, { label: 'Stereophonic sound', wiki: 'Stereophonic_sound' }],
          people: [{ name: 'Alan Blumlein', life: '1903 – 1942', role: 'English electronics engineer with 128 patents in sound, television and radar. He was killed in a wartime test flight.', wiki: 'Alan_Blumlein' }],
          uses: ['Music recordings', 'Cinema sound', 'Television and radio', 'Video games', 'Car audio'],
          timeline: [
            ['1881', 'Paris Opera performances are sent down pairs of telephone lines to listeners with two earpieces.'],
            ['1931', 'Blumlein applies for his patent on two-channel sound.'],
            ['1958', 'Stereo records go on sale, and John C. Koss makes stereo headphones.'],
          ],
        },
        {
          name: "Stereo headphones",
          kind: "design",
          kindNote: "Stereo sound and headphones both existed. Koss and Lange put them together for listening to music.",
          year: "1958",
          by: "John C. Koss and Martin Lange",
          what: "Headphones made for enjoying music in stereo, rather than for telephone and radio operators.",
          here: "Large cups that cover each ear and carry full-range music, one channel to each side, are the kind of headphone Koss introduced.",
          story: "Until the late 1950s headphones were working tools for telephone operators, radio operators and pilots, built to make speech clear rather than to make music sound good. John C. Koss ran a business in Milwaukee renting televisions to hospital patients. Looking for new ideas, he and the engineer Martin Lange developed a portable record player. To show off its sound they gave it a pair of headphones and a switch so the listener could listen privately. At a hi-fi show in Milwaukee in 1958, visitors were more taken with the headphones than with the record player. Koss began making his SP/3 Stereophones from his basement apartment, and other makers soon copied them.",
          read: [
            { label: "Koss Corporation", wiki: "Koss_Corporation" },
            { label: "Headphones", wiki: "Headphones" },
          ],
          people: [
            { name: "John C. Koss", life: "Active 1958", role: "Milwaukee businessman, with only a high-school education, who founded Koss Corporation.", wiki: null, link: "Koss_Corporation" },
            { name: "Martin Lange", life: "Active 1958", role: "Engineer who developed the first Koss headphones with John Koss.", wiki: null, link: "Koss_Corporation" },
          ],
          uses: ["Home hi-fi listening", "Recording studios", "Portable music players", "Gaming", "Radio studios"],
          timeline: [
            ["1953", "John C. Koss starts a hospital television rental business."],
            ["1958", "The Koss SP/3 Stereophones are shown at a hi-fi show in Milwaukee."],
            ["1979", "The Sony Walkman takes headphones out onto the street."],
          ],
        },
      ],
    },
    {
      id: 'cushions',
      name: 'Ear cushions',
      anchor: [CX - 0.14, CY + 0.42, 0.2],
      explode: [0, 0, 1.15],
      make: () =>
        both(() => {
          const pad = ring(0.42, 0.155, -0.1, soft());
          pad.scale.z = 0.8; // flatter than it is wide
          return [pad];
        }),
      inventions: [
        {
          name: 'Memory foam',
          kind: 'material',
          year: '1966',
          by: 'NASA Ames Research Center',
          what: 'A soft foam that gives way slowly under pressure and warmth, takes the shape of whatever presses on it, and slowly springs back.',
          here: 'The foam ring moulds itself around your ear. That makes hours of wear comfortable and seals out sound, which the noise cancelling depends on.',
          story:
            "In the 1960s NASA wanted aircraft seats that would protect pilots and passengers better in a crash and stay comfortable through long flights. In 1966, under a contract from NASA’s Ames Research Center, engineers made a new kind of foam by feeding gas into a polymer. Its open cells let air move slowly, so the foam matched any pressure placed on it and then crept back to its original shape. It was first called slow spring back foam, and then temper foam. It was hard to manufacture reliably. When NASA released it to the public domain in the early 1980s, few companies were willing to work with it. One that did, the Swedish firm Fagerdala, turned it into a mattress in 1991.",
          read: [{ label: 'Memory foam', wiki: 'Memory_foam' }],
          people: [{ name: 'NASA Ames Research Center', life: 'Founded 1939', role: 'The American space agency’s laboratory in California. The foam was developed under its contract to make aircraft cushions safer.', wiki: null, link: 'Ames_Research_Center' }],
          uses: ['Mattresses and pillows', 'Helmet liners', 'Wheelchair cushions', 'Hospital beds', 'Shoe insoles'],
          timeline: [
            ['1966', 'The foam is developed under a NASA contract to improve aircraft cushions.'],
            ['Early 1980s', 'NASA releases memory foam to the public domain.'],
            ['1991', 'Fagerdala sells the Tempur-Pedic Swedish Mattress.'],
          ],
        },
        {
          name: "Polyurethane",
          kind: "material",
          year: "1937",
          by: "Otto Bayer",
          what: "A family of plastics that can be made as a hard solid, a stretchy fibre, a coating or, with gas bubbles blown through it, a soft foam.",
          here: "The foam inside the cushions and the soft skin that covers them are both polyurethane. Memory foam is a special kind of it.",
          story: "In the 1930s the American company DuPont held patents covering the new synthetic fibres and plastics invented by its chemist Wallace Carothers, including nylon. German chemical firms wanted materials of their own that those patents did not reach. At the IG Farben works in Leverkusen, a team led by Otto Bayer tried a different chemical reaction for joining small molecules into long chains, and in 1937 made the first polyurethanes. During the Second World War polyurethane was applied on a small scale as a coating for aircraft. The raw chemicals went on general sale in 1952, and flexible polyurethane foam was in production by 1954. Foam now accounts for about two-thirds of all polyurethane made, in mattresses, sofas and car seats.",
          read: [
            { label: "Polyurethane", wiki: "Polyurethane" },
            { label: "Otto Bayer", wiki: "Otto_Bayer" },
          ],
          people: [
            { name: "Otto Bayer", life: "1902 – 1982", role: "German industrial chemist at IG Farben. He was not related to the founders of the Bayer company.", wiki: "Otto_Bayer" },
          ],
          uses: ["Mattresses and sofas", "Car seats", "Building insulation", "Shoe soles", "Stretch fabrics"],
          timeline: [
            ["1937", "Otto Bayer’s team makes the first polyurethanes."],
            ["1940s", "Polyurethane is used as an aircraft coating in the Second World War."],
            ["1954", "Flexible polyurethane foam goes into production."],
            ["1966", "Memory foam, a slow-recovering polyurethane, is developed for NASA."],
          ],
        },
      ],
    },
    {
      id: 'drivers',
      name: 'Drivers',
      anchor: [-(CX + 0.02), CY - 0.2, 0.15],
      explode: [0, 0, 2.3],
      make: () =>
        both(() => [
          cyl(0.55, 0.55, 0.03, 0.03, mat(0x1d1f23, { roughness: 0.7 }), 48),
          cyl(0.3, 0.3, 0.012, 0.008, metal(0x4a4e55, { roughness: 0.6 }), 40),
          lathe([[0, 0.085], [0.1, 0.075], [0.13, 0.055], [0.29, 0.07], [0.31, 0.05]], mat(0xd9dde2, { roughness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide })),
          cyl(0.13, 0.13, 0.07, 0.11, copper(), 40, true),
          cyl(0.2, 0.2, 0.07, 0.17, metal(0xb8bcc4, { roughness: 0.25 }), 40),
          cyl(0.24, 0.24, 0.025, 0.215, metal(0x55595f, { roughness: 0.5 }), 40),
        ]),
      inventions: [
        {
          name: 'Moving-coil loudspeaker',
          kind: 'invention',
          year: '1925',
          by: 'Chester Rice and Edward Kellogg',
          what: 'A coil of wire glued to a light diaphragm sits in the gap of a magnet. The music signal flowing through the coil pushes it back and forth, and the diaphragm moves the air.',
          here: 'Each cup holds one small driver. The copper coil and the thin dome move thousands of times a second, a fraction of a millimetre from your ear.',
          story:
            "Early loudspeakers and earpieces moved a piece of iron near a magnet. They were loud enough for speech but sounded thin and harsh. Oliver Lodge built an experimental moving-coil speaker in 1898, and in 1915 Peter Jensen and Edwin Pridham made practical ones in California, but these still needed a horn. At General Electric in the early 1920s, Chester Rice and Edward Kellogg set out to find a design that treated all notes equally. They tested many and settled on a light coil driving a cone directly, with its mechanical parts tuned to give an even response from low notes to high. They patented it in 1925. Nearly every loudspeaker and headphone made since works the same way.",
          read: [{ label: 'Loudspeaker', wiki: 'Loudspeaker' }, { label: 'Electrodynamic speaker driver', wiki: 'Electrodynamic_speaker_driver' }],
          people: [
            { name: 'Chester W. Rice', life: '1888 – 1951', role: 'American electrical engineer at General Electric and joint inventor of the moving-coil loudspeaker.', wiki: 'Chester_W._Rice' },
            { name: 'Edward W. Kellogg', life: '1883 – 1960', role: 'American engineer who worked with Rice at General Electric on the 1925 loudspeaker.', wiki: 'Edward_W._Kellogg' },
          ],
          uses: ['Hi-fi and studio loudspeakers', 'Phone and laptop speakers', 'Car audio', 'Earbuds', 'Dynamic microphones, working in reverse'],
          timeline: [
            ['1877', 'Ernst Siemens improves the moving-iron speaker used in telephones.'],
            ['1898', 'Oliver Lodge builds the first experimental moving-coil loudspeaker.'],
            ['1915', 'Peter Jensen and Edwin Pridham make practical moving-coil speakers with horns.'],
            ['1925', 'Rice and Kellogg patent the design used ever since.'],
          ],
        },
        {
          name: 'Neodymium magnet',
          kind: 'material',
          year: '1984',
          by: 'Masato Sagawa, and General Motors',
          what: 'A magnet made from neodymium, iron and boron. It is the strongest kind of permanent magnet you can buy.',
          here: 'A strong magnet lets the driver be small and light. A magnet the size of a coin does the job that once needed a heavy block of iron.',
          story:
            "In the 1970s the strongest magnets were made of samarium and cobalt, both scarce and expensive. Masato Sagawa, a researcher at Fujitsu in Japan, became convinced that a magnet could be built on iron, which is cheap and plentiful, combined with the rare-earth metal neodymium and a little boron. His supervisor did not support the project, so Sagawa resigned and joined Sumitomo Special Metals, where he soon had his magnet working. At almost the same moment a team at General Motors in the United States arrived at the same compound by a different manufacturing route. Both announced it in 1984. The new magnets were far stronger than anything before, and they made small motors, hard disks and light headphones possible.",
          read: [{ label: 'Neodymium magnet', wiki: 'Neodymium_magnet' }, { label: 'Masato Sagawa', wiki: 'Masato_Sagawa' }],
          people: [{ name: 'Masato Sagawa', life: 'Born 1943', role: 'Japanese scientist who conceived the magnet at Fujitsu and completed it at Sumitomo Special Metals.', wiki: 'Masato_Sagawa' }],
          uses: ['Electric car motors', 'Wind turbines', 'Hard disk drives', 'Cordless tools', 'Phone speakers and vibration motors'],
          timeline: [
            ['1960s', 'Samarium-cobalt magnets, the first rare-earth magnets, are developed.'],
            ['1984', 'General Motors and Sumitomo Special Metals independently announce the neodymium magnet.'],
            ['Today', 'It is the most widely used type of rare-earth magnet.'],
          ],
        },
        {
          name: "Electromagnet",
          kind: "invention",
          year: "1824",
          by: "William Sturgeon",
          what: "A coil of wire that becomes a magnet when current flows through it, and stops being one when the current is switched off.",
          here: "The voice coil in each driver is a small electromagnet. The music signal makes its magnetism rise and fall, and that pushes it against the permanent magnet beside it.",
          story: "In 1820 Hans Christian Ørsted showed that an electric current affects a magnet, and within months André-Marie Ampère found that a coil of wire carrying a current could magnetise iron placed inside it. William Sturgeon turned that into a device. He had been apprenticed to a shoemaker, joined the army in 1802, and taught himself mathematics and physics while a soldier. In 1824 he became a lecturer at a military college near London, and he bent an iron bar into a horseshoe, varnished it and wound about eighteen turns of bare copper wire around it. With current from a single battery cell, this piece of iron weighing seven ounces lifted nine pounds, and dropped it the instant the current was cut. In America, Joseph Henry soon wound magnets with many layers of insulated wire that could lift a tonne.",
          read: [
            { label: "Electromagnet", wiki: "Electromagnet" },
            { label: "William Sturgeon", wiki: "William_Sturgeon" },
          ],
          people: [
            { name: "William Sturgeon", life: "1783 – 1850", role: "English shoemaker’s apprentice and soldier turned lecturer. His gravestone calls him simply “The Electrician”.", wiki: "William_Sturgeon" },
          ],
          uses: ["Electric motors", "Doorbells and buzzers", "Loudspeakers", "Scrapyard cranes", "Hospital scanners"],
          timeline: [
            ["1820", "Hans Christian Ørsted shows that a current deflects a compass needle."],
            ["1824", "Sturgeon makes the first electromagnet."],
            ["1830", "Joseph Henry begins winding far stronger magnets with insulated wire."],
          ],
        },
        {
          name: "Telephone receiver",
          kind: "invention",
          year: "1876",
          by: "Alexander Graham Bell",
          what: "A device held to the ear that turns a varying electric current back into sound, using an electromagnet to shake a thin metal disc.",
          here: "A headphone is a telephone receiver made for music. For its first eighty years the headphone was simply two of them on a band.",
          story: "Alexander Graham Bell taught deaf people to speak, as his father had, and his work on the mechanics of speech led him to the idea of sending a voice along a wire. The telegraph could only send clicks. Bell reasoned that if a current could be made to vary in strength exactly as the air varies in pressure during speech, an electromagnet at the far end could shake a thin diaphragm and recreate the sound. In 1876 he was granted an American patent for it. On 10 March that year, in Boston, he spoke into the instrument and his assistant Thomas Watson, in another room and out of earshot, heard the words: Mr Watson, come here, I want to see you. The earpiece, a magnet, a coil and a disc of iron, was the first device ever to turn electricity into speech.",
          read: [
            { label: "Telephone", wiki: "Telephone" },
            { label: "Alexander Graham Bell", wiki: "Alexander_Graham_Bell" },
          ],
          people: [
            { name: "Alexander Graham Bell", life: "1847 – 1922", role: "Scottish-born teacher of the deaf and inventor, who worked in Canada and the United States.", wiki: "Alexander_Graham_Bell" },
          ],
          uses: ["Telephones", "Hearing aids", "Intercoms", "Radio headsets", "Earbuds"],
          timeline: [
            ["1876", "Bell is granted a patent for the telephone."],
            ["1876", "On 10 March Bell speaks to Thomas Watson in the next room."],
            ["1880s", "Telephone operators wear a receiver on the head."],
            ["1910", "Nathaniel Baldwin joins two receivers with a headband."],
          ],
        },
      ],
    },
    {
      id: 'mics',
      name: 'Noise-cancelling microphones',
      anchor: [CX + 0.41, CY + 0.25, 0.03],
      explode: [0, 0, -1.2],
      make: () => {
        const g = new THREE.Group();
        for (const sign of [1, -1])
          for (const dy of [0.2, -0.2]) {
            const grille = cyl(0.045, 0.045, 0.02, 0, metal(0x8d9199, { roughness: 0.4 }), 20);
            grille.rotation.z = Math.PI / 2;
            grille.position.set(sign * (CX + 0.385), CY + dy, 0);
            const capsule = cyl(0.04, 0.04, 0.07, 0, metal(0xc8a14b, { roughness: 0.4 }), 20);
            capsule.rotation.z = Math.PI / 2;
            capsule.position.set(sign * (CX + 0.34), CY + dy, 0);
            g.add(grille, capsule);
          }
        return g;
      },
      inventions: [
        {
          name: 'Active noise cancellation',
          kind: 'technique',
          year: '1936',
          by: 'Paul Lueg',
          what: 'A microphone listens to the noise around you. Electronics make a mirror image of that sound wave and play it, so the two cancel and you hear less.',
          here: 'Small microphones on each cup pick up the room. The driver plays the opposite wave on top of your music, which works best on steady rumbles such as engines.',
          story:
            "The idea is older than the electronics that could carry it out. In 1936 the German physicist Paul Lueg was granted a patent for cancelling a sound by playing its mirror image through a loudspeaker. In the 1950s Lawrence Fogel patented systems to quieten helicopter and aeroplane cockpits, and in 1957 Willard Meeker built a working set of noise-cancelling earmuffs. The step to a product began on a flight on 19 April 1978. Amar Bose, a professor of engineering, tried the airline’s new headphones and was disappointed by how much engine noise came through. He came up with a design for cancelling the noise instead. His company spent about a decade developing it, and offered a headset to pilots in 1989.",
          read: [{ label: 'Active noise control', wiki: 'Active_noise_control' }, { label: 'Noise-cancelling headphones', wiki: 'Noise-cancelling_headphones' }],
          people: [
            { name: 'Paul Lueg', life: 'Active 1936', role: 'German physicist who received the first patent for cancelling sound with sound.', wiki: null, link: 'Active_noise_control' },
            { name: 'Amar Bose', life: '1929 – 2013', role: 'American engineer, professor at MIT and founder of Bose Corporation, which brought noise-cancelling headsets to market.', wiki: 'Amar_Bose' },
          ],
          uses: ['Pilot headsets', 'Car cabins', 'Earbuds', 'Air-conditioning ducts', 'Aircraft cabins'],
          timeline: [
            ['1936', 'Paul Lueg is granted the first patent for a noise control system.'],
            ['1950s', 'Lawrence Fogel patents noise cancelling for cockpits.'],
            ['1957', 'Willard Meeker builds a working noise-cancelling earmuff.'],
            ['1986', 'The pilots of the first non-stop flight around the world wear Bose prototypes.'],
            ['1989', 'Bose introduces its first aviation headset.'],
          ],
        },
        {
          name: 'Electret microphone',
          kind: 'invention',
          year: '1962',
          by: 'Gerhard Sessler and James West',
          what: 'A microphone built around a thin plastic film that holds a permanent electric charge. Sound moves the film, and the movement becomes a signal, with no high-voltage supply needed.',
          here: 'The capsules behind each grille are a few millimetres across and use almost no power, so several can run all day from a small battery.',
          story:
            "The best microphones of the 1950s were condenser microphones. They sounded excellent but needed a supply of a few hundred volts to charge them, which made them costly and fragile. Materials that hold a permanent electric charge, called electrets, had been known since the 1920s, and people had tried to use them in microphones, but the charge leaked away. At Bell Laboratories, Gerhard Sessler and James West looked at the problem again. They found that a very thin Teflon foil with a metal coating could trap a charge almost permanently. Their foil electret microphone, published in 1962, was small, cheap and rugged. It became the most common kind of microphone, built into telephones, recorders and hearing aids.",
          read: [{ label: 'Electret microphone', wiki: 'Electret_microphone' }, { label: 'James West', wiki: 'James_Edward_Maceo_West' }],
          people: [
            { name: 'Gerhard Sessler', life: 'Born 1931', role: 'German physicist who worked at Bell Laboratories and later became a professor in Darmstadt.', wiki: 'Gerhard_M._Sessler' },
            { name: 'James West', life: 'Born 1931', role: 'American inventor and acoustician with more than 250 patents, most of them on microphones and electrets.', wiki: 'James_Edward_Maceo_West' },
          ],
          uses: ['Telephones', 'Hearing aids', 'Laptops and webcams', 'Voice recorders', 'Clip-on microphones'],
          timeline: [
            ['1920s', 'Electret materials are known, but lose their charge too quickly to be useful.'],
            ['1962', 'Sessler and West publish the foil electret microphone.'],
            ['Today', 'Electret and related silicon microphones are in almost every phone and headset.'],
          ],
        },
        {
          name: "Carbon microphone",
          kind: "invention",
          year: "1878",
          by: "David Edward Hughes, Emile Berliner and Thomas Edison",
          what: "The first good microphone. Sound presses on a thin plate and squeezes grains of carbon behind it, which changes how easily current passes through them.",
          here: "Every microphone in these headphones descends from it: a device that turns the pressure of sound into a matching electrical signal.",
          story: "Bell’s first telephone used the same instrument to speak into and to listen with, and its signal was so faint that it faded out after a few miles. The telephone needed a separate, stronger transmitter. Around 1878 three men found the same answer independently. David Edward Hughes in England, and Emile Berliner and Thomas Edison in the United States, each noticed that loosely touching pieces of carbon pass more current when pressed together. Sound pressing on a diaphragm could therefore control a strong current from a battery, instead of having to generate a weak one itself. Edison was awarded the first patent, in 1877, though Hughes had demonstrated a working device in front of many witnesses. Hughes also gave it the name microphone. Carbon microphones were used in nearly every telephone for a hundred years.",
          read: [
            { label: "Carbon microphone", wiki: "Carbon_microphone" },
            { label: "David Edward Hughes", wiki: "David_Edward_Hughes" },
          ],
          people: [
            { name: "David Edward Hughes", life: "1831 – 1900", role: "British-American inventor and musician, who also invented a printing telegraph.", wiki: "David_Edward_Hughes" },
            { name: "Emile Berliner", life: "1851 – 1929", role: "German-born American inventor, who went on to invent the flat gramophone record.", wiki: "Emile_Berliner" },
          ],
          uses: ["Telephones for a century", "Early radio broadcasting", "Hearing aids", "Military field telephones"],
          timeline: [
            ["1876", "Bell’s telephone uses one instrument to speak and to listen."],
            ["1877", "Edison is awarded the first patent for a carbon transmitter."],
            ["1878", "Hughes demonstrates his microphone and gives it its name."],
            ["1962", "The electret microphone begins to replace it."],
          ],
        },
      ],
    },
    {
      id: 'board',
      name: 'Bluetooth board',
      anchor: [CX + 0.26, CY - 0.1, 0.2],
      explode: [0, 0, -2.2],
      make: () => {
        const chip = (w, d, x, z) => {
          const c = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, d), mat(0x101113, { roughness: 0.4 }));
          c.position.set(x, 0.285, z);
          return c;
        };
        const antenna = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.005, 0.04), metal(0xc8a14b, { roughness: 0.4 }));
        antenna.position.set(0, 0.274, -0.3);
        return onCup(1, cyl(0.4, 0.4, 0.02, 0.26, mat(0x1f5a3c, { roughness: 0.55 }), 40), chip(0.18, 0.18, -0.05, 0.02), chip(0.1, 0.07, 0.18, 0.15), chip(0.07, 0.1, -0.2, -0.16), antenna);
      },
      inventions: [
        {
          name: 'Bluetooth',
          kind: 'standard',
          year: '1994',
          by: 'Jaap Haartsen and Sven Mattisson, at Ericsson',
          what: 'A short-range radio link that lets devices from different makers talk to each other without a cable, hopping quickly between frequencies to dodge interference.',
          here: 'A chip and a small antenna in one cup receive the music from your phone. Cutting the cord to a headset is what Bluetooth was first made for.',
          story:
            "In 1989 Nils Rydbeck, the head of technology at Ericsson Mobile in Lund, Sweden, started a project for a short-range radio link. The aim was a wireless headset for mobile phones. From 1994 the design work was done by the Dutch engineer Jaap Haartsen and the Swede Sven Mattisson, and by 1997 they had a working system. Ericsson saw that the link would only be useful if other companies adopted it, so it joined Intel, Nokia, Toshiba and IBM to make it an open standard. Jim Kardach of Intel proposed the code name Bluetooth, after Harald Bluetooth, the tenth-century king who united the tribes of Denmark. It was meant to be temporary, but it stuck. The first Bluetooth product, shown in 1999, was a hands-free headset.",
          read: [{ label: 'Bluetooth', wiki: 'Bluetooth' }, { label: 'Jaap Haartsen', wiki: 'Jaap_Haartsen' }],
          people: [
            { name: 'Jaap Haartsen', life: 'Born 1963', role: 'Dutch engineer who developed the Bluetooth radio at Ericsson in Lund with Sven Mattisson.', wiki: 'Jaap_Haartsen' },
            { name: 'Jim Kardach', life: 'Active 1997', role: 'Intel engineer who proposed the name, taken from a book about Vikings he was reading.', wiki: null, link: 'Bluetooth#Etymology' },
          ],
          uses: ['Wireless speakers', 'Keyboards and mice', 'Car hands-free systems', 'Fitness trackers', 'Hearing aids'],
          timeline: [
            ['1989', 'Nils Rydbeck starts the short-link radio project at Ericsson.'],
            ['1994', 'Haartsen and Mattisson begin the main design work.'],
            ['1997', 'Jim Kardach proposes the name Bluetooth.'],
            ['1998', 'Five companies launch the Bluetooth Special Interest Group.'],
            ['1999', 'The first Bluetooth device, a hands-free headset, is revealed.'],
          ],
        },
        {
          name: "Transistor",
          kind: "invention",
          year: "1947",
          by: "John Bardeen, Walter Brattain and William Shockley",
          what: "A tiny switch and amplifier made of solid crystal, with no moving parts. A small signal on one terminal controls a much larger current through the other two.",
          here: "The chips on this board hold millions of transistors. They decode the radio signal, cancel the noise and strengthen the music enough to drive the speakers.",
          story: "In the 1940s every radio and telephone amplifier used vacuum tubes, glass bulbs that were bulky, ran hot and burned out like light bulbs. Bell Labs, the research arm of the American telephone company, set a group of physicists to find something solid to replace them. Between 17 November and 23 December 1947, John Bardeen and Walter Brattain pressed two gold contacts, a hair’s breadth apart, onto a crystal of germanium. A signal fed into one contact came out of the other stronger than it went in. Their group leader William Shockley saw what it could become, and over the following months worked out a sturdier design. A colleague, John Pierce, named it the transistor. The first transistor products were hearing aids and pocket radios. The three shared the Nobel Prize in Physics in 1956.",
          read: [
            { label: "Transistor", wiki: "Transistor" },
            { label: "John Bardeen", wiki: "John_Bardeen" },
          ],
          people: [
            { name: "John Bardeen", life: "1908 – 1991", role: "American physicist, the only person to win the Nobel Prize in Physics twice.", wiki: "John_Bardeen" },
            { name: "Walter Brattain", life: "1902 – 1987", role: "American physicist at Bell Labs who built the first transistor with Bardeen.", wiki: "Walter_Brattain" },
            { name: "William Shockley", life: "1910 – 1989", role: "American physicist who led the group and designed the junction transistor.", wiki: "William_Shockley" },
          ],
          uses: ["Computers and phones", "Radios and televisions", "Hearing aids", "Car engine control", "Every chip"],
          timeline: [
            ["1925", "Julius Lilienfeld patents the idea of a solid amplifier."],
            ["1947", "Bardeen and Brattain make the first working transistor at Bell Labs."],
            ["1956", "Bardeen, Brattain and Shockley receive the Nobel Prize in Physics."],
            ["1959", "The MOSFET, the type used in chips today, is invented."],
          ],
        },
        {
          name: "Pulse-code modulation",
          kind: "technique",
          year: "1937",
          by: "Alec Reeves",
          what: "Turning sound into numbers. The height of the sound wave is measured thousands of times a second, and each measurement is sent as a number instead of as a wavering signal.",
          here: "Your music reaches the headphones as a stream of numbers. A chip on this board turns the numbers back into a smooth wave for the speakers.",
          story: "A telephone signal sent down a long line picks up hiss and crackle at every stage, and each amplifier along the way strengthens the noise together with the voice. Alec Reeves, an English engineer working in Paris for the International Telephone and Telegraph company, saw a way round it in 1937. Measure the voice signal at regular moments, turn each measurement into a number, and send the numbers as simple on-and-off pulses. A pulse can be damaged quite badly and still be recognised as a pulse, so the numbers arrive exactly, and the voice can be rebuilt with no added noise. He patented it in France in 1938. The electronics of the day were too slow to make it practical. It was first used for secret telephone calls between Allied leaders in the Second World War, and later became the basis of the compact disc and all digital audio.",
          read: [
            { label: "Pulse-code modulation", wiki: "Pulse-code_modulation" },
            { label: "Alec Reeves", wiki: "Alec_Reeves" },
          ],
          people: [
            { name: "Alec Reeves", life: "1902 – 1971", role: "English scientist with 82 patents, who later did early work on sending signals through glass fibre.", wiki: "Alec_Reeves" },
          ],
          uses: ["Compact discs", "Digital telephone networks", "Music streaming", "Video sound tracks", "Voice recorders"],
          timeline: [
            ["1937", "Reeves conceives pulse-code modulation for voice in Paris."],
            ["1938", "He files a French patent."],
            ["1943", "His US patent is granted."],
            ["1982", "The compact disc brings digital audio into homes."],
          ],
        },
        {
          name: "Frequency hopping",
          kind: "technique",
          kindNote: "The idea was described by others earlier, including Nikola Tesla in 1903. Lamarr and Antheil patented a way to do it.",
          year: "1942",
          by: "Hedy Lamarr and George Antheil",
          what: "A radio link in which sender and receiver jump together from one frequency to another many times a second, in a pattern only they know.",
          here: "Bluetooth hops between frequencies many hundreds of times a second. That is how these headphones keep playing in a room full of other phones and Wi-Fi signals.",
          story: "Hedy Lamarr was one of the most famous film stars in Hollywood. Before leaving Austria she had been married to an arms dealer, and at his business meetings she had heard that navies wanted a way to steer a torpedo by radio, and that an enemy could jam the signal by broadcasting on the same frequency. She had no technical training but invented things in her spare time, even between takes on set. With her friend the avant-garde composer George Antheil she designed a system in which transmitter and torpedo changed frequency together, kept in step by perforated paper rolls like those in a player piano, switching among 88 frequencies, the number of keys on a piano. They were granted a patent in 1942. The Navy did not use it. Later systems used the same principle with electronics, and in 1997 Lamarr was honoured for it.",
          read: [
            { label: "Frequency-hopping spread spectrum", wiki: "Frequency-hopping_spread_spectrum" },
            { label: "Hedy Lamarr", wiki: "Hedy_Lamarr" },
          ],
          people: [
            { name: "Hedy Lamarr", life: "1914 – 2000", role: "Austrian-born American film star and self-taught inventor.", wiki: "Hedy_Lamarr" },
            { name: "George Antheil", life: "1900 – 1959", role: "American avant-garde composer and pianist, who had written music for synchronised player pianos.", wiki: "George_Antheil" },
          ],
          uses: ["Bluetooth", "Military radios", "Cordless phones", "Radio-controlled models", "Some Wi-Fi and satellite links"],
          timeline: [
            ["1903", "Nikola Tesla describes changing frequencies in a patent."],
            ["1942", "Lamarr and Antheil receive a patent for their Secret Communications System."],
            ["1962", "The US Navy uses frequency hopping during the Cuban Missile Crisis."],
            ["1997", "Lamarr receives a Pioneer Award for the work."],
          ],
        },
      ],
    },
    {
      id: 'battery',
      name: 'Battery',
      anchor: [-(CX + 0.26), CY + 0.05, 0.2],
      explode: [0, 0, -2.2],
      make: () => {
        const cell = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.09, 0.4), metal(0xbfc3c9, { roughness: 0.45 }));
        cell.position.y = 0.25;
        const label = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.005, 0.28), mat(0x23262b, { roughness: 0.6 }));
        label.position.y = 0.298;
        const tab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.06), mat(0xb9892e, { roughness: 0.5 }));
        tab.position.set(0, 0.25, 0.22);
        return onCup(-1, cell, label, tab);
      },
      inventions: [
        {
          name: 'Lithium-ion battery',
          kind: 'invention',
          year: '1985',
          by: 'Akira Yoshino',
          what: 'A rechargeable battery in which lithium ions move between two electrodes that soak them up like sponges. It stores a lot of energy for its weight.',
          here: 'A flat cell tucked into one cup runs the radio, the microphones and the amplifiers for a day or more, and recharges hundreds of times.',
          story:
            "Lithium is the lightest metal and gives up its electrons eagerly, which makes it ideal for a battery and also dangerous. In the 1970s Stanley Whittingham built the first rechargeable lithium battery, but its lithium metal could catch fire and it was never sold. In 1980 John Goodenough, at Oxford, found a better positive electrode, lithium cobalt oxide, which nearly doubled the voltage. The last step came from Akira Yoshino at the Japanese company Asahi Kasei. In 1985 he replaced the lithium metal with carbon that holds lithium ions safely between its layers. His prototype had no pure lithium in it at all. Sony put the battery on sale in 1991. The three shared the Nobel Prize in Chemistry in 2019.",
          read: [{ label: 'Lithium-ion battery', wiki: 'Lithium-ion_battery' }, { label: 'Akira Yoshino', wiki: 'Akira_Yoshino' }],
          people: [
            { name: 'Akira Yoshino', life: 'Born 1948', role: 'Japanese chemist at Asahi Kasei who built the first safe, practical lithium-ion battery.', wiki: 'Akira_Yoshino' },
            { name: 'John B. Goodenough', life: '1922 – 2023', role: 'American scientist who found the lithium cobalt oxide electrode. He received the Nobel Prize at 97.', wiki: 'John_B._Goodenough' },
            { name: 'M. Stanley Whittingham', life: 'Born 1941', role: 'British-American chemist who made the first rechargeable lithium battery in the 1970s.', wiki: 'M._Stanley_Whittingham' },
          ],
          uses: ['Mobile phones', 'Laptops', 'Electric cars', 'Cordless tools', 'Home energy storage'],
          timeline: [
            ['1970s', 'Whittingham builds a rechargeable lithium battery with a titanium disulfide electrode.'],
            ['1980', 'Goodenough introduces the lithium cobalt oxide electrode.'],
            ['1985', 'Yoshino makes the first prototype with a carbon electrode.'],
            ['1991', 'Sony and Asahi Kasei put the lithium-ion battery on sale.'],
            ['2019', 'Whittingham, Goodenough and Yoshino receive the Nobel Prize in Chemistry.'],
          ],
        },
      ],
    },
  ],
};
