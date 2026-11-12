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
