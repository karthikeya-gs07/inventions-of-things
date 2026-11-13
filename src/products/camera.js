import * as THREE from 'three';
import { mat, metal, clear, knurl, cyl, lathe, ring, zcyl, group } from './helpers.js';

// Standing on the grid, lens toward the viewer. +Z is the direction the lens points,
// X runs across the body, +Y is up. The lens mount is centred on MX, MY.
const MX = 0.1, MY = 0.62;

const leather = () => mat(0x1d1f23, { roughness: 0.88 });
const silver = () => metal(0xb7bbc2, { roughness: 0.38 });
const black = () => mat(0x1a1b1e, { roughness: 0.5, metalness: 0.3 });
const rubber = (u, v) => mat(0x131416, { roughness: 0.92, bumpMap: knurl(u, v), bumpScale: 1.2 });

const box = (w, h, d, [x, y, z], material) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  return m;
};

function extrude(shape, depth) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 8 });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

function lowerBody() {
  const s = new THREE.Shape(), r = 0.1;
  s.moveTo(-1.3 + r, 0.05);
  s.lineTo(1.3 - r, 0.05); s.quadraticCurveTo(1.3, 0.05, 1.3, 0.05 + r);
  s.lineTo(1.3, 1.1); s.lineTo(-1.3, 1.1);
  s.lineTo(-1.3, 0.05 + r); s.quadraticCurveTo(-1.3, 0.05, -1.3 + r, 0.05);
  return new THREE.Mesh(extrude(s, 0.56), leather());
}

// Top plate with the viewfinder hump over the lens
function topPlate() {
  const s = new THREE.Shape();
  s.moveTo(-1.3, 1.1);
  s.lineTo(1.3, 1.1); s.lineTo(1.3, 1.36); s.quadraticCurveTo(1.3, 1.42, 1.24, 1.42);
  s.lineTo(0.62, 1.42); s.lineTo(0.5, 1.74); s.quadraticCurveTo(0.48, 1.8, 0.4, 1.8);
  s.lineTo(-0.2, 1.8); s.quadraticCurveTo(-0.28, 1.8, -0.3, 1.74);
  s.lineTo(-0.42, 1.42); s.lineTo(-1.24, 1.42); s.quadraticCurveTo(-1.3, 1.42, -1.3, 1.36);
  s.lineTo(-1.3, 1.1);
  return new THREE.Mesh(extrude(s, 0.56), silver());
}

// Children are built along +Y and then turned to point out of the lens mount (+Z)
function alongLens(...children) {
  const g = group(...children);
  g.rotation.x = Math.PI / 2;
  g.position.set(MX, MY, 0.42);
  return g;
}

function element(r, y, t, material) {
  return lathe([[0, y + t], [r * 0.6, y + t * 0.7], [r, y], [r * 0.6, y - t * 0.7], [0, y - t]], material, 40);
}

export default {
  id: 'camera',
  name: 'Mirrorless camera',
  blurb:
    'A digital camera with no mirror inside. Light goes straight through the lens onto a sensor, and a small screen in the viewfinder shows you exactly what the sensor sees.',
  timeline: [
    ['1925', 'The Leica I puts a small, precise camera using 35 mm film on sale.'],
    ['1975', 'Steven Sasson at Kodak builds the first self-contained digital camera.'],
    ['2004', 'The Epson R-D1 is a digital camera with interchangeable lenses and no mirror, but still an optical viewfinder.'],
    ['2008', 'The Panasonic Lumix G1 is the first mirrorless camera, with an electronic viewfinder in place of the mirror.'],
    ['2013', 'The Sony α7 is the first mirrorless camera with a full-frame sensor.'],
    ['2018', 'Nikon and Canon launch full-frame mirrorless systems with new lens mounts.'],
  ],
  parts: [
    {
      id: 'body',
      name: 'Camera body',
      anchor: [-0.98, 0.75, 0.6],
      explode: [0, 0, 0],
      make: () => {
        const grip = cyl(0.26, 0.26, 1.0, 0.6, leather(), 32);
        grip.scale.set(1.1, 1, 0.8);
        grip.position.set(-0.98, 0.6, 0.34);
        return group(
          lowerBody(), topPlate(), grip,
          zcyl(0.5, 0.012, [MX, MY, 0.316], mat(0x08090a, { roughness: 0.9 }), 48),
          // Top plate controls: shutter button, two dials, flash shoe
          cyl(0.14, 0.14, 0.04, 1.47, silver(), 32).translateX(-0.95).translateZ(0.1),
          cyl(0.08, 0.08, 0.07, 1.5, metal(0xdadde2, { roughness: 0.25 }), 24).translateX(-0.95).translateZ(0.1),
          cyl(0.2, 0.2, 0.13, 1.515, metal(0xb7bbc2, { roughness: 0.38, bumpMap: knurl(30, 2), bumpScale: 1.2 }), 40).translateX(0.92),
          cyl(0.15, 0.15, 0.11, 1.505, metal(0xb7bbc2, { roughness: 0.38, bumpMap: knurl(24, 2), bumpScale: 1.2 }), 40).translateX(-0.58).translateZ(-0.06)
        );
      },
      inventions: [
        {
          name: 'The small 35 mm camera',
          kind: 'invention',
          year: '1913',
          by: 'Oskar Barnack',
          what: 'A camera small enough for a coat pocket, taking pictures 24 by 36 millimetres on the film made for cinema. Small negatives were enlarged afterwards.',
          here: 'The shape of this body, a grip, a lens in the middle and a finder on top, comes from that camera. A “full-frame” sensor is still 24 by 36 millimetres.',
          story:
            "Before the First World War a serious camera was a heavy box that used glass plates and stood on a tripod. Oskar Barnack, an engineer at the Leitz microscope works in Wetzlar, Germany, loved photography but suffered from asthma, and he wanted a camera light enough to carry on his walks. In 1913 he built one around 35 millimetre cinema film, running it sideways so each picture was twice the size of a movie frame. The film’s perforations let it advance precisely. The war delayed the project, and the prototypes had a mixed reception. In 1924 Ernst Leitz decided to manufacture it all the same, and the Leica, short for Leitz camera, was shown at the Leipzig fair in 1925. It changed photography: reporters could now work quickly, close to their subjects.",
          read: [{ label: 'Oskar Barnack', wiki: 'Oskar_Barnack' }, { label: 'Leica Camera', wiki: 'Leica_Camera' }],
          people: [{ name: 'Oskar Barnack', life: '1879 – 1936', role: 'German engineer and photographer at the Leitz works. He also took some of the first news photographs made on 35 mm film.', wiki: 'Oskar_Barnack' }],
          uses: ['Film cameras of the 20th century', 'Press and street photography', 'Digital SLR cameras', 'The “full-frame” sensor size', 'Lens focal lengths, still quoted for this format'],
          timeline: [
            ['1913', 'Barnack builds his prototype, later called the Ur-Leica.'],
            ['1924', 'Ernst Leitz decides to put the camera into production.'],
            ['1925', 'The Leica I is presented at the Leipzig spring fair.'],
            ['2013', 'The Sony Alpha 7 puts a sensor of the same size in a mirrorless body.'],
          ],
        },
        {
          name: 'Digital camera',
          kind: 'invention',
          year: '1975',
          by: 'Steven Sasson',
          what: 'A camera that turns the picture into numbers and stores them, with no film and no chemistry.',
          here: 'Everything that makes this a digital camera, a sensor in place of film and memory in place of a darkroom, goes back to this prototype.',
          story:
            "In 1975 Steven Sasson was a young engineer at Kodak, the company that dominated photographic film. His supervisor, Gareth Lloyd, gave him a small, open assignment: see whether a camera could be built around a new kind of light-sensitive chip. Sasson put one together from the chip, a lens and a cassette recorder, all running on batteries. It weighed 3.6 kilograms. The picture was black and white, 100 dots across by 100 down, and took 23 seconds to record onto the tape. A separate machine showed it on a television. Kodak applied for a patent in 1977 but did not sell such a camera. Sasson’s prototype was not shown in public until 2000.",
          read: [{ label: 'Steven Sasson', wiki: 'Steven_Sasson' }, { label: 'Digital camera', wiki: 'Digital_camera' }],
          people: [{ name: 'Steven Sasson', life: 'Born 1950', role: 'American electrical engineer who joined Kodak straight from university and stayed until he retired in 2009.', wiki: 'Steven_Sasson' }],
          uses: ['Phone cameras', 'Video calls', 'Medical imaging', 'Satellites and space telescopes', 'Security cameras'],
          timeline: [
            ['1969', 'The charge-coupled device, the first practical image chip, is invented at Bell Labs.'],
            ['1975', 'Sasson builds a self-contained digital camera at Kodak.'],
            ['1981', 'Sony demonstrates the Mavica, a filmless camera that records to a small disk.'],
            ['1988', 'Fujifilm shows the DS-1P, which saves digital pictures on a memory card.'],
          ],
        },
        {
          name: "Photography",
          kind: "invention",
          year: "1826",
          by: "Nicéphore Niépce and Louis Daguerre",
          what: "Capturing the picture formed by a lens on a surface that light itself changes, so the image stays after the light has gone.",
          here: "Everything else in this camera exists to do that one thing better: catch the image thrown by the lens and keep it.",
          story: "By 1800 artists had long used the camera obscura, a dark box with a lens that throws a picture of the world onto a screen, but the only way to keep the picture was to trace it by hand. Around 1800 Thomas Wedgwood and Humphry Davy caught shadows on paper treated with silver salts, but could not stop them fading. Nicéphore Niépce, a French inventor, tried a different substance: bitumen, a kind of tar that hardens where light falls on it. In 1826 or 1827 he coated a pewter plate with it, put it in a camera obscura at an upstairs window of his house, and left it there. The exposure took at least eight hours, perhaps several days. That plate is the oldest surviving photograph. In 1829 he went into partnership with Louis Daguerre, a Paris stage designer. Niépce died in 1833, and Daguerre went on to a process on silvered plates that needed only minutes. In 1839 the French government bought it and gave it to the world.",
          read: [
            { label: "History of photography", wiki: "History_of_photography" },
            { label: "View from the Window at Le Gras", wiki: "View_from_the_Window_at_Le_Gras" },
          ],
          people: [
            { name: "Nicéphore Niépce", life: "1765 – 1833", role: "French inventor who made the oldest surviving photograph. He died financially ruined, six years before photography was announced.", wiki: "Nicéphore_Niépce" },
            { name: "Louis Daguerre", life: "1787 – 1851", role: "French painter and theatre designer whose daguerreotype was the first practical photographic process.", wiki: "Louis_Daguerre" },
          ],
          uses: ["Portraits and family albums", "News reporting", "Astronomy", "Medical X-rays", "Printing and chip making"],
          timeline: [
            ["c. 1800", "Thomas Wedgwood and Humphry Davy record shadows with silver salts but cannot fix them."],
            ["1826 – 1827", "Niépce makes the oldest surviving photograph from his window."],
            ["1829", "Niépce and Daguerre become partners."],
            ["1839", "Daguerre’s process is made public as a gift from France to the world."],
            ["1839", "Henry Fox Talbot shows a rival process on paper in London."],
          ],
        },
        {
          name: "Camera obscura",
          kind: "discovery",
          kindNote: "The effect is natural: light through a small hole forms a picture by itself. People noticed it, studied it and later built it into a box.",
          year: "c. 400 BC",
          by: "Mozi, and Ibn al-Haytham",
          what: "Light passing through a small hole into a dark space forms an upside-down picture of the scene outside. The word camera comes from the Latin for this “dark room”.",
          here: "A camera body is still a dark box with one opening. The lens stands where the hole was, and the sensor where the picture lands.",
          story: "Light travels in straight lines, so rays from the top of a scene that pass through a small hole land at the bottom of the wall behind it, and the picture arrives upside down. One of the earliest written records of this is in a Chinese text of the fourth century BC named after the philosopher Mozi. In the early eleventh century the scholar Ibn al-Haytham, working in Cairo, studied the effect carefully and used it to show that light moves in straight lines. He also used it to watch eclipses without harming the eyes. From the second half of the sixteenth century a glass lens was put in the hole, which gave a brighter and sharper picture, and painters used the device as a drawing aid. The name camera obscura was first used in 1604. In the 1820s Niépce put a light-sensitive plate where the picture fell, and the dark room became the camera.",
          read: [
            { label: "Camera obscura", wiki: "Camera_obscura" },
            { label: "Ibn al-Haytham", wiki: "Ibn_al-Haytham" },
          ],
          people: [
            { name: "Ibn al-Haytham", life: "c. 965 – c. 1040", role: "Scholar from Basra who worked in Cairo. His Book of Optics shaped the study of light for centuries.", wiki: "Ibn_al-Haytham" },
            { name: "Mozi", life: "c. 470 – c. 391 BC", role: "Chinese philosopher. The text that bears his name describes the inverted image formed through a small hole.", wiki: "Mozi" },
          ],
          uses: ["Pinhole cameras", "Safe viewing of solar eclipses", "Drawing aids for painters", "The human eye works the same way"],
          timeline: [
            ["4th century BC", "The Chinese text Mozi describes an inverted image formed through a small hole."],
            ["c. 1027", "Ibn al-Haytham explains in his Book of Optics that light travels in straight lines."],
            ["Late 1500s", "A lens is fitted in the opening, giving a brighter picture."],
            ["1604", "The term camera obscura is first used."],
          ],
        },
      ],
    },
    {
      id: 'lens',
      name: 'Lens barrel',
      anchor: [MX, MY + 0.69, 1.38],
      explode: [0, 0, 1.9],
      make: () =>
        alongLens(
          lathe(
            [[0.46, 0], [0.6, 0], [0.62, 0.04], [0.62, 0.2], [0.65, 0.24], [0.65, 0.62], [0.63, 0.66], [0.63, 0.74], [0.67, 0.78], [0.67, 1.12], [0.7, 1.16], [0.7, 1.3], [0.66, 1.33], [0.6, 1.33], [0.56, 1.22], [0.5, 1.15]],
            mat(0x1a1b1e, { roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide })
          ),
          cyl(0.662, 0.662, 0.34, 0.43, rubber(44, 3), 64, true),
          cyl(0.682, 0.682, 0.3, 0.95, rubber(60, 5), 64, true),
          ring(0.635, 0.012, 0.7, metal(0xd0d3d8, { roughness: 0.3 })),
          cyl(0.47, 0.47, 0.012, 0.004, metal(0xc9ccd2, { roughness: 0.3 }), 48)
        ),
      inventions: [
        {
          name: 'Autofocus',
          kind: 'invention',
          kindNote: 'No single inventor: several companies developed it in turn.',
          year: '1977',
          by: 'Leitz, Konica and Minolta',
          what: 'The camera measures whether the picture is sharp and drives a small motor that moves glass inside the lens until it is.',
          here: 'Motors inside the barrel shift a group of lens elements. In a mirrorless camera the image sensor itself tells them which way to go and how far.',
          story:
            "For over a century, focusing meant turning a ring by hand while judging sharpness by eye. Between 1960 and 1973 the German firm Leitz patented a series of ways for a camera to do the judging itself, and in 1976 it showed a working prototype called Correfot. Leitz did not turn it into a product. The first autofocus camera people could buy came from Japan: the Konica C35 AF of 1977, a simple point-and-shoot. A year later Polaroid sold a camera that focused by timing echoes of ultrasound. Putting autofocus into cameras with interchangeable lenses was harder. The Pentax ME F managed it in 1981, and in 1985 the Minolta 7000 put the sensors and the motor inside the body. Within a few years every maker had followed.",
          read: [{ label: 'Autofocus', wiki: 'Autofocus' }, { label: 'Minolta Maxxum 7000', wiki: 'Minolta_Maxxum_7000' }],
          people: [
            { name: 'Leitz', life: 'Active 1976', role: 'The German maker of Leica cameras. It patented autofocus between 1960 and 1973 and showed a prototype, but did not sell one.', wiki: null, link: 'Leica_Camera' },
            { name: 'Konica', life: 'Active 1977', role: 'Japanese camera maker. Its C35 AF was the first mass-produced autofocus camera.', wiki: null, link: 'Konica_C35_AF' },
          ],
          uses: ['Phone cameras', 'Video cameras', 'Webcams', 'Barcode scanners', 'Microscopes'],
          timeline: [
            ['1976', 'Leitz shows its Correfot autofocus prototype at the Photokina fair.'],
            ['1977', 'The Konica C35 AF is the first mass-produced autofocus camera.'],
            ['1978', 'The Polaroid SX-70 Sonar OneStep focuses using ultrasound.'],
            ['1981', 'The Pentax ME F is the first autofocus 35 mm SLR.'],
            ['1985', 'The Minolta 7000 builds the autofocus sensors and motor into the body.'],
          ],
        },
        {
          name: "Zoom lens",
          kind: "invention",
          year: "1902",
          by: "Clile C. Allen",
          what: "A lens whose magnification can be changed smoothly, by sliding groups of glass inside it, while the picture stays in focus.",
          here: "Turning the wide ring on the barrel moves glass inside the lens, taking the view from wide to close-up without changing lenses.",
          story: "Changing how much of a scene a camera takes in once meant changing the lens. Telescopes had been built with adjustable magnification as early as 1834, but the picture went out of focus each time the magnification changed. In 1902 the American Clile C. Allen patented the first true zoom lens, in which the picture stayed nearly sharp as it was enlarged. Cinema used the idea first: a zoom can be seen in the opening shot of the 1927 film It, and a zoom lens for movie cameras was in production by 1932. Television followed in the 1950s. Photographers waited longest. The first zoom in regular production for 35 millimetre still cameras was the Zoomar of 1959, which went from 36 to 82 millimetres. Early zooms were less sharp than fixed lenses, but computer design and better glass closed the gap.",
          read: [
            { label: "Zoom lens", wiki: "Zoom_lens" },
          ],
          people: [
            { name: "Clile C. Allen", life: "Active 1902", role: "American inventor who patented the first true zoom lens.", wiki: null, link: "Zoom_lens#History" },
          ],
          uses: ["Television and cinema cameras", "Phone cameras", "Binoculars and telescopes", "Projectors", "Microscopes"],
          timeline: [
            ["1834", "A telescope with variable magnification is reported to the Royal Society."],
            ["1902", "Clile C. Allen patents the first true zoom lens."],
            ["1932", "The Cooke Varo zoom for movie cameras goes into production."],
            ["1959", "The Zoomar is the first zoom in regular production for 35 mm still cameras."],
          ],
        },
        {
          name: "Ultrasonic motor",
          kind: "invention",
          year: "1987",
          by: "Toshiiku Sashida, and Canon",
          what: "A motor with no coils or magnets. A ring of special ceramic vibrates faster than we can hear, and the ripples in it push a second ring around.",
          here: "A ring-shaped motor inside the barrel moves the focusing glass. It is fast, precise and almost silent, which matters when recording video.",
          story: "The first autofocus lenses were turned by a small electric motor through gears, which made them slow and noisy. Some materials change shape very slightly when a voltage is applied, and engineers had long tried to turn that tiny movement into rotation. Practical motors appeared in the 1970s in the work of the Japanese engineer Toshiiku Sashida. His later designs sent a wave travelling around a ring, like a ripple, so that a second ring pressed against it was carried round in either direction. Canon took up the idea, and in 1987 built it into lenses for its new EOS cameras under the name USM, for ultrasonic motor. The ring fits neatly around the glass, starts and stops instantly, and makes almost no sound. Other makers followed with their own versions.",
          read: [
            { label: "Ultrasonic motor", wiki: "Ultrasonic_motor" },
            { label: "Canon EF lens mount", wiki: "Canon_EF_lens_mount" },
          ],
          people: [
            { name: "Toshiiku Sashida", life: "Active 1970s", role: "Japanese engineer who built some of the earliest practical ultrasonic motors.", wiki: null, link: "Ultrasonic_motor" },
            { name: "Canon", life: "Active 1987", role: "Japanese camera maker that made the ultrasonic motor famous by building it into autofocus lenses.", wiki: null, link: "Canon_Inc." },
          ],
          uses: ["Phone camera focusing", "Car seat and steering adjusters", "Watches", "Medical devices", "Microscope stages"],
          timeline: [
            ["1970s", "Sashida builds early practical ultrasonic motors."],
            ["Early 1980s", "Canon, Nikon and others file patents on ultrasonic motors."],
            ["1987", "Canon puts an ultrasonic motor into its autofocus lenses."],
          ],
        },
      ],
    },
    {
      id: 'glass',
      name: 'Lens elements',
      anchor: [MX, MY + 0.1, 1.64],
      explode: [0, 0, 3.3],
      make: () => {
        const coated = (color) => mat(color, { roughness: 0.04, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 1, iridescenceIOR: 1.6, side: THREE.DoubleSide });
        return alongLens(
          lathe([[0, 1.2], [0.2, 1.19], [0.38, 1.168], [0.52, 1.14]], coated(0x1a1430), 48),
          element(0.44, 0.9, 0.05, clear(0.4, 0xc9d8ff)),
          element(0.38, 0.62, 0.07, clear(0.4, 0xd8ffe6)),
          element(0.32, 0.34, 0.04, clear(0.4, 0xe6d8ff))
        );
      },
      inventions: [
        {
          name: 'Anti-reflective coating',
          kind: 'process',
          year: '1935',
          by: 'Olexander Smakula',
          what: 'A transparent layer a fraction of a wavelength of light thick. Light reflected from its top and its bottom cancels out, so more light passes through the glass.',
          here: 'The purple and green tint on the front of the lens is the coating. A zoom lens has a dozen or more pieces of glass, and without coatings most of the light would be lost or scattered as haze.',
          story:
            "Every surface of bare glass reflects about four per cent of the light that hits it. In a lens made of many pieces of glass the losses add up, and the stray reflections bounce around inside as haze and ghost images. In 1886 Lord Rayleigh noticed something odd: old glass that had tarnished with age let through more light than new glass. The thin tarnish layer was reducing reflection. In 1904 Harold Dennis Taylor found a chemical way to produce such a layer on purpose. The modern method came in 1935 from Olexander Smakula, a Ukrainian physicist at Carl Zeiss in Germany. He deposited a film of exactly the right thickness for the reflections from its two faces to cancel. Coated lenses made complex designs such as zooms practical.",
          read: [{ label: 'Anti-reflective coating', wiki: 'Anti-reflective_coating' }, { label: 'Olexander Smakula', wiki: 'Alexander_Smakula' }],
          people: [{ name: 'Olexander Smakula', life: '1900 – 1983', role: 'Ukrainian physicist who invented interference coatings at Carl Zeiss and later worked at MIT in the United States.', wiki: 'Alexander_Smakula' }],
          uses: ['Spectacles', 'Binoculars and telescopes', 'Phone screens and camera lenses', 'Solar panels', 'Microscopes'],
          timeline: [
            ['1886', 'Lord Rayleigh finds that tarnished glass transmits more light.'],
            ['1904', 'Harold Dennis Taylor develops a chemical method of making such a layer.'],
            ['1935', 'Smakula invents interference coatings at Carl Zeiss.'],
            ['Today', 'Lenses carry many layers, tuned to cancel reflections across all colours.'],
          ],
        },
        {
          name: "The lens",
          kind: "invention",
          kindNote: "Nobody knows who made the first lens. Polished crystals that may have been lenses survive from the seventh century BC.",
          year: "Antiquity",
          by: "Unknown makers",
          what: "A piece of glass with curved faces. It bends rays of light so that they meet, forming an image of whatever is in front of it.",
          here: "Everything the camera records has first passed through these pieces of glass. Together they bring the scene to a sharp picture exactly on the sensor.",
          story: "The word lens is Latin for lentil, because a lens bulging on both sides has the shape of the seed. Polished pieces of rock crystal survive from the ancient world, such as one found at Nimrud, in today’s Iraq, from the seventh century BC, though nobody is sure whether they were used as lenses or worn as ornaments. The oldest certain mention is in a Greek comedy of 424 BC, The Clouds by Aristophanes, which talks of a burning-glass used to start fires. Between the eleventh and thirteenth centuries, readers laid “reading stones”, half-spheres of glass, on their pages to enlarge the letters. Then, in northern Italy in the late thirteenth century, craftsmen began grinding thin lenses to wear in front of the eyes. Spectacle making in Venice and Florence was the start of the optical industry, and of every telescope, microscope and camera lens since.",
          read: [
            { label: "Lens", wiki: "Lens" },
            { label: "Glasses", wiki: "Glasses" },
          ],
          people: [
            { name: "Spectacle makers of Venice and Florence", life: "Active late 1200s", role: "Unnamed craftsmen who began grinding and polishing lenses for spectacles, founding the optical industry.", wiki: null, link: "Lens#History" },
          ],
          uses: ["Spectacles and contact lenses", "Telescopes and binoculars", "Microscopes", "Projectors", "Magnifying glasses"],
          timeline: [
            ["7th century BC", "The Nimrud lens, a polished rock crystal, is made in Assyria."],
            ["424 BC", "Aristophanes mentions a burning-glass in his play The Clouds."],
            ["11th c.", "Reading stones are used to magnify writing."],
            ["Late 1200s", "Spectacles are invented in northern Italy."],
          ],
        },
        {
          name: "Achromatic lens",
          kind: "invention",
          year: "c. 1730",
          by: "Chester Moore Hall, and John Dollond",
          what: "Two lenses of different kinds of glass joined together. The colour error of one cancels the colour error of the other, so all colours focus at the same point.",
          here: "A camera lens has several such pairs. Without them every edge in the picture would have a coloured fringe.",
          story: "A simple lens bends blue light more than red, so it cannot bring all colours to the same focus, and bright objects get coloured fringes. Isaac Newton thought the fault could not be cured. Around 1730 Chester Moore Hall, an English barrister who made optics his hobby, found a cure: join a lens of ordinary crown glass to one of heavier flint glass, shaped so that their errors cancel. He wanted to keep it secret, so he ordered the two lenses from two different opticians. Both passed the work on to the same craftsman, George Bass, who saw that the pieces were for one customer, put them together and saw what they did. In the 1750s Bass mentioned it to John Dollond, a former silk weaver turned optician. Dollond worked out how to make such lenses, patented them, and won the Royal Society’s Copley Medal in 1758.",
          read: [
            { label: "Achromatic lens", wiki: "Achromatic_lens" },
            { label: "John Dollond", wiki: "John_Dollond" },
          ],
          people: [
            { name: "Chester Moore Hall", life: "1703 – 1771", role: "English lawyer and amateur optician who made the first achromatic lenses and telescope.", wiki: "Chester_Moore_Hall" },
            { name: "John Dollond", life: "1706 – 1761", role: "Son of a refugee silk weaver. He left weaving in 1752 to make optical instruments and later served King George III.", wiki: "John_Dollond" },
          ],
          uses: ["Telescopes", "Microscopes", "Binoculars", "Projectors", "Rifle sights"],
          timeline: [
            ["c. 1730", "Chester Moore Hall makes the first achromatic lenses, in 1729 or 1733."],
            ["1750s", "George Bass tells John Dollond about Hall’s lenses."],
            ["1758", "Dollond receives the Copley Medal for his achromatic lenses."],
          ],
        },
        {
          name: "Calculated photographic lens",
          kind: "invention",
          year: "1840",
          by: "Joseph Petzval",
          what: "The first camera lens designed by calculation, using the laws of optics, instead of by grinding glass and trying it out.",
          here: "Every lens for this camera is designed the same way, now by computer: the path of light through each piece of glass is worked out before any glass is cut.",
          story: "The first photographs of 1839 needed many minutes of exposure, far too long for a person to sit still. A lens that gathered more light was the obvious cure, but lenses were then made by experience, grinding and testing until they worked. Joseph Petzval, a professor of mathematics in Vienna, decided to calculate one instead. The sums were enormous, so Archduke Louis of Austria, who commanded the artillery, lent him eight gunners and three corporals, because gunnery was one of the few trades that trained men to calculate. The lens was built in 1840 by the optician Voigtländer. It gathered about twenty-two times as much light as the lens on Daguerre’s camera, and brought portraits down to under a minute. The two men later fell out, and Voigtländer moved production abroad, beyond the reach of Petzval’s patent. By 1862 he had sold sixty thousand.",
          read: [
            { label: "Petzval lens", wiki: "Petzval_lens" },
            { label: "Joseph Petzval", wiki: "Joseph_Petzval" },
          ],
          people: [
            { name: "Joseph Petzval", life: "1807 – 1891", role: "Mathematician and physicist born in the Kingdom of Hungary, in what is now Slovakia, and professor in Vienna.", wiki: "Joseph_Petzval" },
          ],
          uses: ["Portrait lenses", "Cinema projector lenses", "Telescopes", "All modern lens design"],
          timeline: [
            ["1839", "The first photographs need exposures of many minutes."],
            ["1840", "Petzval designs his portrait lens and Voigtländer builds it."],
            ["1845", "Petzval and Voigtländer fall out over the rights."],
            ["1862", "Voigtländer has made 60,000 Petzval lenses."],
          ],
        },
        {
          name: "Optical glass",
          kind: "material",
          year: "1884",
          by: "Otto Schott, with Ernst Abbe and Carl Zeiss",
          what: "Glass made to a precise recipe so that it bends and spreads light by a known, chosen amount.",
          here: "The elements in this lens are made of several different glasses. Lens designers pick each one from a catalogue, as a cook picks ingredients.",
          story: "By the 1870s lens makers could calculate what they wanted, but could not get the glass to build it. Only a few kinds existed, and no two batches behaved quite alike. The physicist Ernst Abbe, who designed microscopes for the instrument maker Carl Zeiss in Jena, wrote about how much this held optics back. A young glass chemist, Otto Schott, read him. In 1879 Schott made a new glass containing lithium and sent Abbe a sample to measure. It was the start of a long collaboration. Schott moved to Jena in 1882 and worked through one ingredient after another, silica, soda, potash, lime, lead and 28 other elements, recording what each did to the glass. In 1884 the three men founded a glassworks in Jena to make the results. Schott went on to develop borosilicate glass there, the heat-proof glass of laboratory flasks and oven dishes.",
          read: [
            { label: "Otto Schott", wiki: "Otto_Schott" },
            { label: "Optical glass", wiki: "Optical_glass" },
          ],
          people: [
            { name: "Otto Schott", life: "1851 – 1935", role: "German chemist who turned glass making from a craft into a science, and invented borosilicate glass.", wiki: "Otto_Schott" },
          ],
          uses: ["Microscopes", "Telescopes", "Spectacle lenses", "Optical fibre", "Laboratory glassware"],
          timeline: [
            ["1879", "Schott sends Ernst Abbe a sample of a new lithium glass."],
            ["1882", "Schott moves to Jena to work with Abbe and Zeiss."],
            ["1884", "The three found the Schott glassworks in Jena."],
            ["1887 – 1893", "Schott develops borosilicate glass."],
          ],
        },
      ],
    },
    {
      id: 'mount',
      name: 'Lens mount',
      anchor: [MX + 0.45, MY - 0.4, 0.42],
      explode: [0, 0, 0.3],
      make: () => {
        const ringM = lathe([[0.5, 0], [0.64, 0], [0.64, 0.1], [0.5, 0.1], [0.5, 0]], metal(0xc9ccd2, { roughness: 0.3 }), 48);
        ringM.rotation.x = Math.PI / 2;
        ringM.position.set(MX, MY, 0.31);
        const g = group(ringM, zcyl(0.06, 0.05, [0.9, 0.4, 0.33], silver(), 20));
        // Row of gold contacts that carry power and data to the lens
        for (let i = 0; i < 9; i++) {
          const a = Math.PI * 1.5 + (i - 4) * 0.11;
          g.add(zcyl(0.016, 0.02, [MX + Math.cos(a) * 0.455, MY + Math.sin(a) * 0.455, 0.335], metal(0xd4af37, { roughness: 0.3 }), 10));
        }
        // Three bayonet lugs
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 + 0.5;
          const lug = box(0.2, 0.05, 0.02, [MX + Math.cos(a) * 0.5, MY + Math.sin(a) * 0.5, 0.4], metal(0xb9bcc2, { roughness: 0.35 }));
          lug.rotation.z = a + Math.PI / 2;
          g.add(lug);
        }
        return g;
      },
      inventions: [
        {
          name: "Electronic lens mount",
          kind: "design",
          kindNote: "The bayonet fitting and electrical contacts both existed. Canon’s step was to remove every mechanical link between camera and lens.",
          year: "1987",
          by: "Canon",
          what: "A twist-and-lock fitting that holds the lens in exactly the right place, with a row of electrical contacts through which the camera powers and controls it.",
          here: "The gold pins in the mount carry power and instructions to the motors in the lens, and bring back what the lens is doing. That is how a lens can focus and set its aperture by itself.",
          story: "A camera with interchangeable lenses needs a joint that holds the lens precisely, time after time. Early lenses screwed in. The bayonet, in which tabs on the lens drop into slots and lock with a short twist, was quicker and always left the lens at the same angle, so levers and pins could line up between lens and camera. For decades those links were mechanical: a lever in the camera closed the aperture, and with autofocus, a shaft from a motor in the body turned the focusing ring. In 1987 Canon abandoned its existing mount and introduced the EF mount for its new EOS cameras. EF stood for electro-focus. Each lens had its own motors, and nothing passed through the mount except electricity: power and data, through a row of contacts. By 2014 Canon had made a hundred million EF lenses. Mirrorless mounts all work this way.",
          read: [
            { label: "Lens mount", wiki: "Lens_mount" },
            { label: "Canon EF lens mount", wiki: "Canon_EF_lens_mount" },
          ],
          people: [
            { name: "Canon", life: "Active 1987", role: "Japanese camera maker. Its EF mount was the first to rely on electrical contacts alone.", wiki: null, link: "Canon_EF_lens_mount" },
          ],
          uses: ["Mirrorless and SLR cameras", "Cinema cameras", "Lens adapters", "Smart teleconverters"],
          timeline: [
            ["1987", "Canon introduces the all-electronic EF mount."],
            ["2008", "The Micro Four Thirds mount is the first designed for mirrorless cameras."],
            ["2014", "Canon makes its 100-millionth EF lens."],
            ["2018", "Nikon and Canon launch new mounts for mirrorless cameras."],
          ],
        },
      ],
    },
    {
      id: 'aperture',
      name: 'Aperture',
      anchor: [MX, MY + 0.3, 0.9],
      explode: [0, 1.0, 2.5],
      make: () => {
        const g = [lathe([[0.3, 0.47], [0.42, 0.47], [0.42, 0.49], [0.3, 0.49], [0.3, 0.47]], mat(0x101113, { roughness: 0.5 }), 48)];
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2;
          const blade = box(0.3, 0.004, 0.16, [Math.cos(a) * 0.24, 0.48 + i * 0.0015, Math.sin(a) * 0.24], metal(0x2b2d31, { roughness: 0.4 }));
          blade.rotation.y = -a + 0.9;
          g.push(blade);
        }
        return alongLens(...g);
      },
      inventions: [
        {
          name: "Iris diaphragm",
          kind: "invention",
          kindNote: "Its inventor is not known. The historian of optics Rudolf Kingslake could not trace it; some credit Niépce, around 1820.",
          year: "1858",
          by: "Unknown; patented by Charles Harrison and Joseph Schnitzer",
          what: "A ring of thin overlapping blades that swing together to make a round hole larger or smaller, like the iris of an eye.",
          here: "Seven blades inside the lens set how much light gets through. A small opening also brings more of the scene, near and far, into focus.",
          story: "As early as 1567 the Venetian nobleman Daniele Barbaro noticed that the picture in a camera obscura became sharper if part of the lens was covered. Early photographers controlled the light in the same crude way, by sliding a brass strip with a hole in it into the lens. These were called Waterhouse stops, after John Waterhouse, who introduced them in 1858, and a photographer carried a set of them with holes of different sizes. In the same year the American lens maker Charles Harrison and Joseph Schnitzer patented something better: six blades inside the lens that could be moved together to shrink the opening. Who first thought of copying the eye in this way is not known; some give the credit to Niépce, around 1820. The iris became standard, and the size of its opening, the f-number, is still the first setting a photographer learns.",
          read: [
            { label: "Diaphragm (optics)", wiki: "Diaphragm_(optics)" },
            { label: "Aperture", wiki: "Aperture" },
          ],
          people: [
            { name: "Charles C. Harrison", life: "Active 1858", role: "American lens maker who, with Joseph Schnitzer, patented an adjustable stop of six moving blades.", wiki: null, link: "Diaphragm_(optics)#History" },
          ],
          uses: ["Microscopes", "Telescopes", "Stage spotlights", "Laser equipment", "The pupil of the eye works the same way"],
          timeline: [
            ["1567", "Daniele Barbaro notes that covering part of a lens sharpens the picture."],
            ["c. 1820", "Niépce may have used an iris diaphragm."],
            ["1858", "John Waterhouse introduces interchangeable stops."],
            ["1858", "Harrison and Schnitzer patent a six-bladed adjustable stop."],
            ["1867", "J. H. Brown has made a popular improved iris diaphragm."],
          ],
        },
      ],
    },
    {
      id: 'flash',
      name: 'Flash shoe',
      anchor: [0.1, 1.88, -0.02],
      explode: [0, 0.65, 0],
      make: () =>
        group(
          box(0.36, 0.03, 0.36, [0.1, 1.845, -0.02], metal(0x8e939b, { roughness: 0.4 })),
          box(0.05, 0.05, 0.36, [-0.055, 1.875, -0.02], metal(0x8e939b, { roughness: 0.4 })),
          box(0.05, 0.05, 0.36, [0.255, 1.875, -0.02], metal(0x8e939b, { roughness: 0.4 })),
          cyl(0.04, 0.04, 0.012, 1.866, metal(0xd4af37, { roughness: 0.3 }), 16).translateX(0.1).translateZ(-0.02)
        ),
      inventions: [
        {
          name: "Electronic flash",
          kind: "invention",
          year: "1931",
          by: "Harold Edgerton",
          what: "A glass tube of gas that gives a brilliant burst of light when a stored electric charge is released through it. It lasts a tiny fraction of a second and can be fired again and again.",
          here: "A flash unit slides into this shoe. The contact in the middle fires it at the exact moment the shutter is open.",
          story: "Early photographers lit dark scenes by burning magnesium. Flash powder, introduced in Germany in 1887, was a small explosion in an open tray, with smoke and some danger. Flashbulbs, sold from 1929, sealed the burning metal inside glass, but each bulb worked only once. Harold Edgerton was not thinking of photography at all. As a student at the Massachusetts Institute of Technology he was studying electric motors, and used flashing lamps to make the spinning parts appear to stand still. In 1931 he introduced a flash tube that reached full brightness almost instantly and went out again just as fast. A colleague, Charles Stark Draper, encouraged him to point it at everyday things, starting with water running from a tap. His pictures of a bullet passing through an apple and of bursting balloons showed people things too quick to see. He later worked with the explorer Jacques Cousteau, and was known as Papa Flash.",
          read: [
            { label: "Flash (photography)", wiki: "Flash_(photography)" },
            { label: "Harold Edgerton", wiki: "Harold_Edgerton" },
          ],
          people: [
            { name: "Harold Edgerton", life: "1903 – 1990", role: "American professor of electrical engineering at MIT, who turned the stroboscope from a laboratory tool into a way of seeing fast events.", wiki: "Harold_Edgerton" },
          ],
          uses: ["Phone and camera flashes", "Studio lighting", "Aircraft and tower warning lights", "High-speed photography", "Stage strobe lights"],
          timeline: [
            ["1887", "Adolf Miethe and Johannes Gaedicke introduce flash powder."],
            ["1929", "Flashbulbs go on sale in Germany."],
            ["1931", "Edgerton introduces the electronic flash tube."],
            ["1937", "Edgerton begins working with the photographer Gjon Mili on multiple-flash pictures."],
          ],
        },
      ],
    },
    {
      id: 'shutter',
      name: 'Shutter',
      anchor: [MX + 0.25, MY + 0.12, 0.4],
      explode: [0, 0, 1.15],
      make: () => {
        const g = group(box(0.8, 0.56, 0.012, [MX, MY, 0.378], mat(0x0e0f11, { roughness: 0.6 })));
        for (let i = 0; i < 4; i++)
          g.add(box(0.74, 0.135, 0.006, [MX, MY - 0.19 + i * 0.127, 0.388 + i * 0.004], metal(0x4b4f56, { roughness: 0.45 })));
        return g;
      },
      inventions: [
        {
          name: 'Focal-plane shutter',
          kind: 'invention',
          year: '1883',
          by: 'Ottomar Anschütz',
          what: 'A blind placed just in front of the film or sensor. A slit in it sweeps across the picture, and the narrower the slit, the shorter the exposure.',
          here: 'Thin metal blades sit a few millimetres in front of the sensor. They can give exposures as short as a few thousandths of a second, and the lens can be changed without letting light in.',
          story:
            "Early photographs needed exposures of seconds, so the photographer simply took the cap off the lens and put it back. As plates became more sensitive in the 1870s, exposures dropped to fractions of a second, too short to time by hand. A slit moving past the plate could do it. William England used a falling slit in a one-off camera as early as 1861. In 1883 the German photographer Ottomar Anschütz patented a camera with a roller blind inside it, just in front of the plate, pulled across by a spring. By narrowing the slit he could freeze fast movement. The firm Goerz began making his camera in 1890. The Leica of 1925 used cloth blinds of the same kind, and today’s metal blades work on the same principle.",
          read: [{ label: 'Focal-plane shutter', wiki: 'Focal-plane_shutter' }, { label: 'Ottomar Anschütz', wiki: 'Ottomar_Anschütz' }],
          people: [{ name: 'Ottomar Anschütz', life: '1846 – 1907', role: 'German photographer and inventor, known for sharp pictures of animals and people in motion.', wiki: 'Ottomar_Anschütz' }],
          uses: ['Film SLR cameras', 'Digital SLR cameras', 'Rangefinder cameras', 'Medium-format cameras'],
          timeline: [
            ['1861', 'William England uses a sliding slit at the focal plane in a single camera.'],
            ['1883', 'Anschütz patents a camera with an internal roller-blind shutter.'],
            ['1890', 'Goerz manufactures the Anschütz camera.'],
            ['1925', 'The Leica uses a cloth focal-plane shutter that travels sideways.'],
          ],
        },
      ],
    },
    {
      id: 'sensor',
      name: 'Image sensor',
      anchor: [MX, MY, 0.36],
      explode: [0, 0, 0.55],
      make: () =>
        group(
          box(0.82, 0.56, 0.014, [MX, MY, 0.33], mat(0x1f5a3c, { roughness: 0.55 })),
          box(0.72, 0.48, 0.02, [MX, MY, 0.347], mat(0x24304a, { roughness: 0.12, metalness: 0.6, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.9 }))
        ),
      inventions: [
        {
          name: 'CMOS image sensor',
          kind: 'invention',
          year: '1993',
          by: 'Eric Fossum and a team at NASA’s Jet Propulsion Laboratory',
          what: 'A silicon chip covered in millions of light-sensitive cells. Each cell has its own tiny amplifier, and the chip can carry the camera’s circuits as well.',
          here: 'This rectangle is the film of a digital camera. With no mirror in the way, it is lit all the time, so it also feeds the viewfinder and measures focus.',
          story:
            "The first chips that could capture a picture were charge-coupled devices, invented at Bell Labs in 1969. They gave clean images, but they shifted the charge from every cell across the whole chip to one output, which needed special manufacturing and a lot of power. The alternative, giving each cell its own amplifier, had been proposed in the 1960s, and Olympus built such a sensor in Japan in 1985, but the pictures were noisy. In the early 1990s a team at NASA’s Jet Propulsion Laboratory, including Eric Fossum, Sunetra Mendis and Sabrina Kemeny, was looking for smaller cameras for spacecraft. They moved the charge inside each cell in a way that cancelled most of the noise, and made the chip on ordinary factory lines. Their sensor is now in nearly every phone and camera.",
          read: [{ label: 'Active-pixel sensor', wiki: 'Active-pixel_sensor' }, { label: 'Eric Fossum', wiki: 'Eric_Fossum' }],
          people: [{ name: 'Eric Fossum', life: 'Born 1957', role: 'American engineer who led image sensor research at the Jet Propulsion Laboratory and co-founded Photobit to sell the new sensors.', wiki: 'Eric_Fossum' }],
          uses: ['Phone cameras', 'Webcams', 'Car reversing cameras', 'Medical endoscopes', 'Space probes'],
          timeline: [
            ['1960s', 'Peter Noble proposes a sensor with an amplifier in every cell.'],
            ['1969', 'The charge-coupled device is invented at Bell Labs.'],
            ['1985', 'A team at Olympus builds an early active-pixel sensor.'],
            ['1993', 'The Jet Propulsion Laboratory develops its CMOS active-pixel sensor.'],
            ['1995', 'Fossum and Sabrina Kemeny co-found Photobit to commercialise it.'],
          ],
        },
        {
          name: 'Bayer colour filter',
          kind: 'invention',
          year: '1976',
          by: 'Bryce Bayer',
          what: 'A mosaic of tiny colour filters over the sensor: half green, a quarter red and a quarter blue. The camera works out the full colour of every point from its neighbours.',
          here: 'The sensor’s cells only measure brightness. The filter laid over them is why the picture is in colour.',
          story:
            "A light-sensitive cell cannot tell colours apart; it only counts light. Early colour video cameras solved this with three separate sensors and a prism, which was bulky and costly. In 1974 Bryce Bayer, a researcher at Kodak, was asked by his colleague Peter Dillon what pattern of colour filters would work best on a single sensor. Bayer wrote his answer in his lab notebook on 24 May 1974. He gave green twice as many cells as red or blue, arranged like a chessboard, because the human eye gets most of its sense of sharpness from green light. Kodak applied for a patent in 1975 and it was granted in July 1976. Almost every colour digital camera since has used his pattern.",
          read: [{ label: 'Bayer filter', wiki: 'Bayer_filter' }, { label: 'Bryce Bayer', wiki: 'Bryce_Bayer' }],
          people: [{ name: 'Bryce Bayer', life: '1929 – 2012', role: 'American scientist who spent his whole career at Eastman Kodak, from 1951 until he retired in 1986.', wiki: 'Bryce_Bayer' }],
          uses: ['Phone cameras', 'Video cameras', 'Webcams', 'Dash cams', 'Machine-vision cameras'],
          timeline: [
            ['1974', 'Bryce Bayer records the pattern in his laboratory notebook.'],
            ['1975', 'Kodak files a patent application titled “Color imaging array”.'],
            ['1976', 'The patent is granted.'],
          ],
        },
        {
          name: "Image stabilisation",
          kind: "invention",
          kindNote: "No single inventor: Nikon, Canon and Minolta each made a key step.",
          year: "1994",
          by: "Nikon, Canon and Minolta",
          what: "Motion sensors detect the camera shaking, and electromagnets move a lens element or the sensor itself to cancel the movement, so pictures stay sharp in an unsteady hand.",
          here: "In many mirrorless cameras the sensor floats on magnets and shifts constantly to follow the tremor of your hands.",
          story: "Long exposures and long lenses magnify every small tremor of the hands, and blur was one of the commonest ways to spoil a photograph. In 1994 Nikon built the first stabilised lens into a compact film camera, the Zoom-Touch 105 VR. Two small motion sensors measured the shake, and electromagnets moved a floating lens element to cancel it. Canon brought the idea to interchangeable lenses in 1995 with its EF 75–300 mm IS. In 2003 Minolta took a different route in its DiMAGE A1: instead of moving glass in the lens, it moved the image sensor. That works with any lens fitted to the camera, and it is now common in mirrorless cameras. Sony, building on Minolta’s design, put five-axis sensor stabilisation in its full-frame Alpha 7 II in 2014.",
          read: [
            { label: "Image stabilization", wiki: "Image_stabilization" },
          ],
          people: [
            { name: "Nikon", life: "Active 1994", role: "Japanese camera maker that built the first optically stabilised lens into a compact camera.", wiki: null, link: "Nikon" },
            { name: "Minolta", life: "Active 2003", role: "Japanese camera maker that first stabilised pictures by moving the sensor.", wiki: null, link: "Minolta" },
          ],
          uses: ["Phone cameras", "Stabilised binoculars", "Video cameras", "Telephoto lenses"],
          timeline: [
            ["1994", "Nikon’s Zoom-Touch 105 VR has the first two-axis stabilised lens."],
            ["1995", "Canon’s EF 75–300 mm IS brings stabilisation to interchangeable lenses."],
            ["2003", "The Minolta DiMAGE A1 stabilises the picture by moving the sensor."],
            ["2014", "Sony’s Alpha 7 II adds five-axis sensor stabilisation to a full-frame camera."],
          ],
        },
        {
          name: "Photoelectric effect",
          kind: "discovery",
          kindNote: "A law of nature, discovered and then explained. Every image sensor depends on it.",
          year: "1887",
          by: "Heinrich Hertz, and Albert Einstein",
          what: "Light can knock electrons loose from a material. More light frees more electrons, so the amount of electric charge measures how bright the light was.",
          here: "Each of the sensor’s millions of cells is a tiny piece of silicon that turns the light falling on it into electric charge. The camera counts that charge.",
          story: "In 1887 Heinrich Hertz was doing the experiments that proved radio waves exist. His detector was a small gap across which a spark jumped. He noticed that the spark jumped more easily when ultraviolet light shone on the gap: light was helping electricity leave the metal. Others measured the effect and found it puzzling. Brighter light released more electrons, but not faster ones, and light below a certain colour released none, however bright. In 1905 Albert Einstein, then a clerk in the Swiss patent office, proposed an explanation. Light comes in separate packets of energy, later called photons, and each packet frees one electron or none. The idea was a foundation of quantum physics, and it was for this, not relativity, that he received the Nobel Prize for 1921. A camera sensor counts photons in exactly this way.",
          read: [
            { label: "Photoelectric effect", wiki: "Photoelectric_effect" },
            { label: "Heinrich Hertz", wiki: "Heinrich_Hertz" },
          ],
          people: [
            { name: "Heinrich Hertz", life: "1857 – 1894", role: "German physicist who proved that radio waves exist, and noticed the photoelectric effect along the way.", wiki: "Heinrich_Hertz" },
            { name: "Albert Einstein", life: "1879 – 1955", role: "German-born physicist. His Nobel Prize was awarded for explaining the photoelectric effect.", wiki: "Albert_Einstein" },
          ],
          uses: ["Solar panels", "Automatic doors and light sensors", "Night-vision devices", "Television cameras", "Light meters"],
          timeline: [
            ["1887", "Hertz observes that ultraviolet light helps a spark to jump."],
            ["1905", "Einstein explains the effect with packets of light."],
            ["1921", "Einstein is awarded the Nobel Prize in Physics for it."],
          ],
        },
        {
          name: "Charge-coupled device",
          kind: "invention",
          year: "1969",
          by: "Willard Boyle and George Smith",
          what: "The first practical image chip. Light builds up electric charge in rows of tiny cells, and the charges are then passed along from cell to cell, like buckets along a line, to be read out one by one.",
          here: "This camera’s sensor is the later CMOS type, but the charge-coupled device came first. It made digital cameras possible and showed how to build the light-catching cells that every sensor still uses.",
          story: "In the late 1960s Willard Boyle and George Smith at Bell Labs were working on a new kind of computer memory. Bell Labs was also developing a memory that stored data as tiny magnetic bubbles, and the two men asked whether the same thing could be done with electric charge on silicon. They realised that a charge could be held on a very small capacitor, and that with the right voltages a row of them would hand the charge along from one to the next. In their notebook in 1969 they called these charge bubble devices. Silicon also releases charge when light falls on it, so a grid of such cells could record a picture. Colleagues including Michael Tompsett showed that in 1970, and Tompsett filed the first patent on using it for imaging. Steven Sasson’s first digital camera of 1975 was built around one. Boyle and Smith shared the Nobel Prize in Physics in 2009.",
          read: [
            { label: "Charge-coupled device", wiki: "Charge-coupled_device" },
            { label: "Willard Boyle", wiki: "Willard_Boyle" },
          ],
          people: [
            { name: "Willard Boyle", life: "1924 – 2011", role: "Canadian physicist at Bell Labs and co-inventor of the charge-coupled device.", wiki: "Willard_Boyle" },
            { name: "George E. Smith", life: "1930 – 2025", role: "American physicist at Bell Labs who shared the 2009 Nobel Prize with Boyle.", wiki: "George_E._Smith" },
          ],
          uses: ["Space telescopes", "Scientific and medical cameras", "Early digital cameras and camcorders", "Barcode scanners", "Fax machines and scanners"],
          timeline: [
            ["1969", "Boyle and Smith invent the charge-coupled device at Bell Labs."],
            ["1970", "A team at Bell Labs demonstrates it capturing an image."],
            ["1975", "Sasson builds the first digital camera around one."],
            ["2009", "Boyle and Smith receive the Nobel Prize in Physics."],
          ],
        },
        {
          name: "Three-colour method",
          kind: "technique",
          year: "1855",
          by: "James Clerk Maxwell",
          what: "Any colour the eye can see can be recorded as three measurements, of red, green and blue light, and rebuilt by mixing those three again.",
          here: "The sensor records only red, green and blue. Every colour in the finished picture is a mixture of the three, which is why the Bayer filter over the sensor has just those colours.",
          story: "Around 1800 Thomas Young suggested that the eye does not need a separate detector for every colour: three kinds, most sensitive to red, green and blue, would be enough. In an 1855 paper on colour vision the young Scottish physicist James Clerk Maxwell drew the practical conclusion. Photograph a scene three times, through a red, a green and a blue filter, and project the three pictures on top of each other through the same filters, and the colours should reappear. He asked the photographer Thomas Sutton to try it for a lecture he gave in 1861. The subject was a bow of ribbon with coloured stripes. Maxwell himself remarked that the result was imperfect, and said better materials were needed. But the principle was right. Colour film, colour television, every screen and every digital camera work by his three-colour method.",
          read: [
            { label: "Color photography", wiki: "Color_photography" },
            { label: "James Clerk Maxwell", wiki: "James_Clerk_Maxwell" },
          ],
          people: [
            { name: "James Clerk Maxwell", life: "1831 – 1879", role: "Scottish physicist, best known for the theory that unites electricity, magnetism and light.", wiki: "James_Clerk_Maxwell" },
            { name: "Thomas Sutton", life: "Died 1875", role: "English photographer and inventor who took the three pictures for Maxwell’s demonstration.", wiki: "Thomas_Sutton_(photographer)" },
          ],
          uses: ["Phone and computer screens", "Colour television", "Colour film", "Colour printing", "Stage lighting"],
          timeline: [
            ["1855", "Maxwell proposes the three-colour method in a paper on colour vision."],
            ["1861", "Thomas Sutton photographs a ribbon three times for Maxwell’s lecture."],
            ["1976", "Bryce Bayer’s filter applies the method to a single image sensor."],
          ],
        },
      ],
    },
    {
      id: 'evf',
      name: 'Electronic viewfinder',
      anchor: [0.1, 1.6, -0.44],
      explode: [0, 0.45, -0.9],
      make: () =>
        group(
          box(0.52, 0.32, 0.13, [0.1, 1.58, -0.37], mat(0x131416, { roughness: 0.92 })),
          zcyl(0.1, 0.02, [0.1, 1.58, -0.435], mat(0x101a2c, { roughness: 0.05, clearcoat: 1, emissive: 0x2a5fa8, emissiveIntensity: 0.6 }), 32),
          box(0.2, 0.15, 0.02, [0.1, 1.58, -0.29], mat(0x0b0c0e, { roughness: 0.3, emissive: 0x4d9fff, emissiveIntensity: 0.5 }))
        ),
      inventions: [
        {
          name: 'OLED display',
          kind: 'invention',
          year: '1987',
          by: 'Ching Wan Tang and Steven Van Slyke',
          what: 'A display in which each dot is a thin film of carbon-based material that gives off its own light when a current passes through it.',
          here: 'A screen the size of a fingernail sits behind the eyepiece, in place of the mirror and prism of older cameras. Because every dot makes its own light, black is truly black.',
          story:
            "In the early 1950s André Bernanose and his colleagues in France found that some organic, meaning carbon-based, materials glow when electricity is applied. For decades it stayed a laboratory curiosity. A glowing crystal made in 1963 needed four hundred volts. At Eastman Kodak, the chemists Ching Wan Tang and Steven Van Slyke tried a different structure: two very thin layers of different organic materials, one to carry positive charges and one to carry negative ones. The charges met at the boundary and gave off light there. Their device, reported in 1987, glowed brightly at a low voltage. It took ten more years to reach a product, a Pioneer car stereo in 1997. Today these displays are in most phones.",
          read: [{ label: 'OLED', wiki: 'OLED' }, { label: 'Ching Wan Tang', wiki: 'Ching_Wan_Tang' }],
          people: [
            { name: 'Ching Wan Tang', life: 'Born 1947', role: 'Chemist born in Hong Kong who worked at Eastman Kodak and later became a professor in Rochester and Hong Kong.', wiki: 'Ching_Wan_Tang' },
            { name: 'Steven Van Slyke', life: 'Born 1956', role: 'American chemist and co-inventor of the device at Kodak, who went on to develop it for manufacture.', wiki: 'Steven_Van_Slyke' },
          ],
          uses: ['Phone screens', 'Televisions', 'Smartwatches', 'Virtual-reality headsets', 'Car dashboards'],
          timeline: [
            ['Early 1950s', 'André Bernanose observes light from organic materials under high voltage.'],
            ['1987', 'Tang and Van Slyke build the first practical device at Kodak.'],
            ['1997', 'Pioneer sells a car stereo with an OLED display.'],
            ['2003', 'A Kodak digital camera carries the first full-colour OLED screen.'],
          ],
        },
        {
          name: "Mirrorless design",
          kind: "design",
          kindNote: "Every part existed already. The step was to take the mirror out and let the sensor feed the viewfinder.",
          year: "2008",
          by: "Panasonic",
          what: "A camera with interchangeable lenses and no mirror. The sensor is exposed all the time and sends its picture to a small screen in the viewfinder.",
          here: "Look into the eyepiece and you see a screen, not the scene. It shows the picture as the sensor will record it, with the brightness and colour already applied.",
          story: "For fifty years the serious camera was the single-lens reflex. A mirror behind the lens sent the view up to the eye, and swung out of the way with a slap at the moment of exposure. The mirror and the glass prism above it made the camera bulky, and the lens had to sit well forward to leave room. Once sensors could run continuously, the mirror was no longer needed. Early digital cameras without one, such as the Epson R-D1 of 2004, kept an optical window to look through. In October 2008 Panasonic released the Lumix G1 in Japan, with the sensor feeding an electronic viewfinder. It was the first camera of the Micro Four Thirds system, and the word mirrorless was coined to describe it. Olympus, Samsung and Sony followed. By 2023 mirrorless cameras had overtaken reflex cameras, and nearly every maker had switched to them.",
          read: [
            { label: "Mirrorless camera", wiki: "Mirrorless_camera" },
            { label: "Panasonic Lumix DMC-G1", wiki: "Panasonic_Lumix_DMC-G1" },
          ],
          people: [
            { name: "Panasonic", life: "Active 2008", role: "Japanese electronics company that released the first mirrorless camera, the Lumix G1.", wiki: null, link: "Panasonic_Lumix_DMC-G1" },
          ],
          uses: ["Photography", "Film and video production", "Vlogging cameras", "Drone cameras"],
          timeline: [
            ["2004", "The Epson R-D1 has no mirror but keeps an optical viewfinder."],
            ["2008", "The Panasonic Lumix G1 is the first mirrorless camera."],
            ["2013", "The Sony Alpha 7 brings a full-frame sensor to mirrorless."],
            ["2023", "Mirrorless cameras have overtaken reflex cameras."],
          ],
        },
      ],
    },
    {
      id: 'screen',
      name: 'Rear screen',
      anchor: [0.3, 0.6, -0.37],
      explode: [0, 0, -1.6],
      make: () =>
        group(
          box(1.56, 0.98, 0.05, [0.3, 0.6, -0.338], mat(0x141518, { roughness: 0.6 })),
          box(1.4, 0.84, 0.01, [0.3, 0.6, -0.366], mat(0x0b1320, { roughness: 0.06, clearcoat: 1, metalness: 0.2 }))
        ),
      inventions: [
        {
          name: 'Liquid-crystal display',
          kind: 'invention',
          year: '1968',
          by: 'George Heilmeier and a team at RCA',
          what: 'A thin layer of liquid whose molecules line up when a voltage is applied, letting more or less light through. A grid of such cells forms a picture.',
          here: 'The flat screen on the back shows the picture before and after you take it. It is thin and uses little power, which a battery-powered camera needs.',
          story:
            "In 1888 the Austrian botanist Friedrich Reinitzer was studying a substance related to cholesterol and saw that it seemed to melt twice: first into a cloudy liquid, then, at a higher temperature, into a clear one. The physicist Otto Lehmann examined it and named such materials liquid crystals. For seventy years they were a curiosity. In 1962 Richard Williams at the American company RCA found that an electric field changed how they looked. His colleague George Heilmeier saw what that could mean: a flat screen in place of the bulky television tube. By 1968 his team had working displays. They used too much power, but in 1970 Martin Schadt and Wolfgang Helfrich in Switzerland found a better effect, which soon appeared in watches and calculators.",
          read: [{ label: 'Liquid-crystal display', wiki: 'Liquid-crystal_display' }, { label: 'George H. Heilmeier', wiki: 'George_H._Heilmeier' }],
          people: [
            { name: 'George Heilmeier', life: '1936 – 2014', role: 'American engineer at RCA Laboratories, credited with the first liquid-crystal displays.', wiki: 'George_H._Heilmeier' },
            { name: 'Friedrich Reinitzer', life: '1857 – 1927', role: 'Austrian botanist and chemist who discovered liquid crystals by accident.', wiki: 'Friedrich_Reinitzer' },
          ],
          uses: ['Televisions and monitors', 'Laptops', 'Calculators and watches', 'Car dashboards', 'Projectors'],
          timeline: [
            ['1888', 'Friedrich Reinitzer discovers the liquid-crystal state.'],
            ['1962', 'Richard Williams at RCA finds that electric fields change liquid crystals.'],
            ['1968', 'RCA shows its first liquid-crystal displays.'],
            ['1970', 'Martin Schadt and Wolfgang Helfrich patent the low-power twisted nematic effect.'],
          ],
        },
        {
          name: "Touchscreen",
          kind: "invention",
          year: "1965",
          by: "Eric Johnson",
          what: "A screen that senses where a finger touches it, so the picture itself becomes the control.",
          here: "Tap the rear screen to choose where the camera focuses, or swipe through the pictures you have taken.",
          story: "In the early 1960s computers were controlled with keyboards and switches. Eric Johnson, an engineer at the Royal Radar Establishment in Malvern, England, was looking for a quicker way for operators to work with a display. He laid fine wires across the front of a screen and used the fact that a fingertip changes the electrical capacitance of a wire it touches, so the equipment could tell which spot had been pressed. He described the idea in a short article in 1965 and more fully in 1967. It was the first touchscreen worked by a finger. In the early 1970s Frank Beck and Bent Stumpe at CERN, the European physics laboratory, built transparent touchscreens for the controls of a particle accelerator, in use from 1973. Touchscreens stayed a specialist tool for decades, until phones made them universal.",
          read: [
            { label: "Touchscreen", wiki: "Touchscreen" },
          ],
          people: [
            { name: "Eric Johnson", life: "Active 1965", role: "British engineer at the Royal Radar Establishment in Malvern who built the first finger-driven touchscreen.", wiki: null, link: "Touchscreen#History" },
          ],
          uses: ["Phones and tablets", "Cash machines", "Ticket machines", "Car dashboards", "Shop tills"],
          timeline: [
            ["1965", "Eric Johnson describes a capacitive touchscreen."],
            ["1967", "He publishes a fuller account with photographs and diagrams."],
            ["1973", "Touchscreens built at CERN go into use."],
          ],
        },
      ],
    },
    {
      id: 'board',
      name: 'Processor board',
      anchor: [0.6, 0.62, -0.16],
      explode: [0, 0, -0.85],
      make: () =>
        group(
          box(1.7, 0.8, 0.02, [0.15, 0.58, -0.12], mat(0x1f5a3c, { roughness: 0.55 })),
          box(0.34, 0.34, 0.03, [0.2, 0.6, -0.145], mat(0x101113, { roughness: 0.35 })),
          box(0.2, 0.26, 0.03, [0.72, 0.52, -0.145], mat(0x101113, { roughness: 0.35 })),
          box(0.16, 0.12, 0.03, [-0.3, 0.72, -0.145], mat(0x101113, { roughness: 0.35 })),
          box(0.22, 0.08, 0.04, [-0.45, 0.36, -0.15], metal(0xb9bcc2, { roughness: 0.4 }))
        ),
      inventions: [
        {
          name: "Microprocessor",
          kind: "invention",
          year: "1971",
          by: "Ted Hoff, Federico Faggin, Masatoshi Shima and Stanley Mazor",
          what: "The central processor of a whole computer, built on a single chip.",
          here: "The processor on this board reads millions of values from the sensor, turns them into a colour picture, runs the autofocus and draws both screens, many times a second.",
          story: "In 1969 Busicom, a Japanese calculator company, asked the young American firm Intel to make a set of seven custom chips for a new range of calculators, with the processor spread across three of them. Busicom’s engineer Masatoshi Shima had done the logic design. Intel’s Ted Hoff proposed something simpler and more general: a processor on a single chip that ran instructions stored in memory, so the same chip could be programmed to do different jobs. With Stanley Mazor he worked the idea out with Shima. In 1970 the chip itself was designed by Federico Faggin, a new Intel recruit who had developed the silicon-gate method at Fairchild that made it possible to fit enough transistors. The first one worked in March 1971, and it went on sale as the Intel 4004 on 15 November 1971.",
          read: [
            { label: "Intel 4004", wiki: "Intel_4004" },
            { label: "Microprocessor", wiki: "Microprocessor" },
          ],
          people: [
            { name: "Federico Faggin", life: "Born 1941", role: "Italian-American physicist who designed the 4004 and led the project.", wiki: "Federico_Faggin" },
            { name: "Ted Hoff", life: "Born 1937", role: "American engineer at Intel who proposed putting the whole processor on one chip.", wiki: "Marcian_Hoff" },
            { name: "Masatoshi Shima", life: "Born 1943", role: "Japanese engineer at Busicom who did the logic design, and later joined Intel.", wiki: "Masatoshi_Shima" },
          ],
          uses: ["Computers and phones", "Cars", "Washing machines", "Toys", "Medical devices"],
          timeline: [
            ["1969", "Busicom asks Intel to design a set of calculator chips."],
            ["1970", "Faggin begins designing the single-chip processor, with Shima."],
            ["1971", "The Intel 4004 goes on sale on 15 November."],
          ],
        },
        {
          name: "JPEG",
          kind: "standard",
          year: "1992",
          by: "The Joint Photographic Experts Group",
          what: "A shared method for shrinking photographs by throwing away fine detail the eye barely notices, usually to about a tenth of their size.",
          here: "The processor squeezes each picture into a JPEG before saving it, so thousands fit on the card and any phone or computer can open them.",
          story: "A single digital photograph holds millions of numbers, far too many to store or send easily in the 1980s. In 1972 the engineer Nasir Ahmed proposed compressing images with a mathematical tool called the discrete cosine transform. It breaks a picture into patterns of detail, from broad to fine, and the finest patterns, which the eye notices least, can be stored roughly or dropped. He published it with T. Natarajan and K. R. Rao in 1974. In the 1980s the international standards bodies set up a joint committee of experts, the Joint Photographic Experts Group, to agree one method everyone would use. Their standard, published in 1992 and named after the committee, was built on that transform. It usually shrinks a photo about tenfold with little visible loss, and became the most widely used image format in the world.",
          read: [
            { label: "JPEG", wiki: "JPEG" },
            { label: "Nasir Ahmed", wiki: "Nasir_Ahmed_(engineer)" },
          ],
          people: [
            { name: "Nasir Ahmed", life: "Born 1940", role: "American engineer who proposed the discrete cosine transform, the mathematics at the heart of JPEG.", wiki: "Nasir_Ahmed_(engineer)" },
          ],
          uses: ["Phone photos", "Web pages", "Messaging apps", "Digital photo frames", "Scanned documents"],
          timeline: [
            ["1972", "Nasir Ahmed proposes the discrete cosine transform for compressing images."],
            ["1974", "Ahmed, Natarajan and Rao publish it."],
            ["1992", "The JPEG standard is published."],
            ["2015", "Several billion JPEG images are made every day."],
          ],
        },
        {
          name: "Integrated circuit",
          kind: "invention",
          year: "1958",
          by: "Jack Kilby, and Robert Noyce",
          what: "A whole electronic circuit, its transistors and the connections between them, made together on one small piece of semiconductor.",
          here: "Every dark rectangle on this board is one. The processor, the memory, the sensor and the chips that drive the screens are all integrated circuits.",
          story: "By the late 1950s engineers could design circuits far too complicated to build. Every transistor had to be made separately and wired to the others by hand, and each soldered joint was a chance of failure. Jack Kilby joined Texas Instruments in mid-1958. As a new employee he had no right to a summer holiday, so he was almost alone in the laboratory when the others went away. He used the time to try an idea: make every part of a circuit out of the same piece of semiconductor. He showed a working example on 12 September 1958. Its parts were still joined by fine gold wires. A few months later Robert Noyce, at Fairchild Semiconductor in California, made the practical version, in which the connections are laid down flat on the surface of a silicon chip. Modern chips follow Noyce’s design. Kilby received the Nobel Prize in Physics in 2000.",
          read: [
            { label: "Integrated circuit", wiki: "Integrated_circuit" },
            { label: "Jack Kilby", wiki: "Jack_Kilby" },
          ],
          people: [
            { name: "Jack Kilby", life: "1923 – 2005", role: "American engineer at Texas Instruments, who also co-invented the handheld calculator.", wiki: "Jack_Kilby" },
            { name: "Robert Noyce", life: "1927 – 1990", role: "American physicist who co-founded Fairchild Semiconductor and Intel.", wiki: "Robert_Noyce" },
          ],
          uses: ["Computers and phones", "Cars", "Bank cards", "Hearing aids", "Spacecraft"],
          timeline: [
            ["1958", "Kilby demonstrates the first integrated circuit on 12 September."],
            ["1959", "Noyce develops the monolithic silicon chip at Fairchild."],
            ["1971", "The Intel 4004 puts a whole processor on one chip."],
            ["2000", "Kilby receives the Nobel Prize in Physics."],
          ],
        },
      ],
    },
    {
      id: 'battery',
      name: 'Battery',
      anchor: [-0.92, 0.86, 0.2],
      explode: [-1.0, 0, 0.9],
      make: () =>
        group(
          box(0.3, 0.7, 0.16, [-0.92, 0.5, 0.12], mat(0x24262b, { roughness: 0.5 })),
          box(0.26, 0.04, 0.12, [-0.92, 0.87, 0.12], metal(0xc8a14b, { roughness: 0.4 }))
        ),
      inventions: [
        {
          name: 'Lithium-ion battery',
          kind: 'invention',
          year: '1985',
          by: 'Akira Yoshino',
          what: 'A rechargeable battery in which lithium ions move between two electrodes that soak them up like sponges. It stores a lot of energy for its weight.',
          here: 'A flat lithium-ion pack slides into the grip. It powers the sensor, both screens and the focus motors for hundreds of shots, and can be recharged hundreds of times.',
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
    {
      id: 'card',
      name: 'Memory card',
      anchor: [-1.12, 0.45, -0.1],
      explode: [-0.95, 0, 0],
      make: () =>
        group(
          box(0.32, 0.24, 0.022, [-1.1, 0.45, -0.1], mat(0x1c1d21, { roughness: 0.5 })),
          box(0.2, 0.18, 0.004, [-1.13, 0.45, -0.113], mat(0x2f6fd0, { roughness: 0.5 }))
        ),
      inventions: [
        {
          name: 'Flash memory',
          kind: 'invention',
          year: '1980',
          by: 'Fujio Masuoka',
          what: 'A memory chip that keeps its contents with the power off and can be erased and rewritten electrically, a whole block at a time.',
          here: 'The card stores thousands of pictures on a chip the size of a fingernail, with no moving parts and no battery.',
          story:
            "Around 1980, memory chips came in two kinds. Some were fast but forgot everything when the power went off. Others kept their data, but were awkward to erase: one type had to be put under ultraviolet light, and another could be erased electrically but only one small piece at a time, which made it expensive. Fujio Masuoka, an engineer at Toshiba in Japan, designed a chip with a much simpler cell that erased a whole block in one go. A colleague, Shoji Ariizumi, said the erasing reminded him of the flash of a camera, and the name stuck. Masuoka presented one version in 1984 and a denser one in 1987. Toshiba began selling flash memory in 1987, and Intel followed with a chip of its own in 1988.",
          read: [{ label: 'Flash memory', wiki: 'Flash_memory' }, { label: 'Fujio Masuoka', wiki: 'Fujio_Masuoka' }],
          people: [{ name: 'Fujio Masuoka', life: 'Born 1943', role: 'Japanese engineer who invented both main types of flash memory at Toshiba and later became a professor at Tohoku University.', wiki: 'Fujio_Masuoka' }],
          uses: ['Phones and tablets', 'USB sticks', 'Solid-state drives in computers', 'Music players', 'Cars and appliances'],
          timeline: [
            ['1980', 'Masuoka invents flash memory at Toshiba.'],
            ['1984', 'He presents the first type, known as NOR flash.'],
            ['1987', 'He presents the denser NAND flash, the type used in memory cards.'],
            ['1988', 'Intel introduces a commercial NOR flash chip.'],
          ],
        },
        {
          name: "SD card",
          kind: "standard",
          year: "1999",
          by: "SanDisk, Panasonic and Toshiba",
          what: "An agreed size, shape and set of electrical rules for a small memory card, so one card fits devices from any maker.",
          here: "The card in this slot is an SD card. It will also fit a laptop, a card reader or another make of camera.",
          story: "In the late 1990s nearly every camera maker had its own memory card. SanDisk’s CompactFlash of 1994 was an early success, but Sony then introduced its Memory Stick, and Olympus and Fujifilm their own card, and a card from one camera would not fit another. In 1996 SanDisk, Siemens and Nokia had developed a card the size of a postage stamp, the MultiMediaCard, but few products adopted it. In August 1999 SanDisk joined Panasonic and Toshiba to announce a successor, the Secure Digital card, with copy protection built in and a small sliding tab to prevent accidental erasing. In January 2000 the three founded the SD Association to publish the rules and license the logo. It now has about a thousand member companies, and the SD card outlasted its rivals.",
          read: [
            { label: "SD card", wiki: "SD_card" },
          ],
          people: [
            { name: "SD Association", life: "Founded 2000", role: "Non-profit body set up by SanDisk, Panasonic and Toshiba to develop and promote the standard.", wiki: null, link: "SD_card" },
          ],
          uses: ["Phones, as microSD", "Drones and action cameras", "Games consoles", "Dash cams", "Small computers"],
          timeline: [
            ["1994", "SanDisk introduces CompactFlash."],
            ["1999", "SanDisk, Panasonic and Toshiba announce the SD card in August."],
            ["2000", "The SD Association is formed in January."],
          ],
        },
      ],
    },
  ],
};
