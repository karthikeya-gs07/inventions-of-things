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
        const mount = lathe([[0.5, 0], [0.64, 0], [0.64, 0.1], [0.5, 0.1], [0.5, 0]], metal(0xc9ccd2, { roughness: 0.3 }), 48);
        mount.rotation.x = Math.PI / 2;
        mount.position.set(MX, MY, 0.31);
        return group(
          lowerBody(), topPlate(), grip, mount,
          zcyl(0.5, 0.012, [MX, MY, 0.316], mat(0x08090a, { roughness: 0.9 }), 48),
          zcyl(0.06, 0.05, [0.9, 0.4, 0.33], silver(), 20),
          // Top plate controls: shutter button, two dials, flash shoe
          cyl(0.14, 0.14, 0.04, 1.47, silver(), 32).translateX(-0.95).translateZ(0.1),
          cyl(0.08, 0.08, 0.07, 1.5, metal(0xdadde2, { roughness: 0.25 }), 24).translateX(-0.95).translateZ(0.1),
          cyl(0.2, 0.2, 0.13, 1.515, metal(0xb7bbc2, { roughness: 0.38, bumpMap: knurl(30, 2), bumpScale: 1.2 }), 40).translateX(0.92),
          cyl(0.15, 0.15, 0.11, 1.505, metal(0xb7bbc2, { roughness: 0.38, bumpMap: knurl(24, 2), bumpScale: 1.2 }), 40).translateX(-0.58).translateZ(-0.06),
          box(0.36, 0.03, 0.36, [0.1, 1.845, -0.02], metal(0x8e939b, { roughness: 0.4 }))
        );
      },
      inventions: [
        {
          name: 'The small 35 mm camera',
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
          name: 'Digital camera',
          year: '1975',
          by: 'Steven Sasson',
          what: 'A camera that turns the picture into numbers and stores them, with no film and no chemistry.',
          here: 'The processor on this board reads millions of values from the sensor, turns them into a colour picture and saves it, many times a second.',
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
      ],
    },
  ],
};
