import * as THREE from 'three';
import { mat, metal, tube, zcyl, hoop, group } from './helpers.js';

// Side-on in the XY plane, wheels standing on the grid. +X is forward, +Z is the drive side.
const REAR = [-1.5, 1.0], FRONT = [1.5, 1.0], BB = [-0.3, 0.85];
const SEAT = [-0.55, 2.15], HEAD_TOP = [0.95, 2.2], HEAD_BOT = [1.05, 1.85];
const at = ([x, y], z = 0) => [x, y, z];

const paint = () => mat(0xa33b2f, { roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.5 });
const alloy = () => metal(0xc3c7cd, { roughness: 0.45 });
const steel = () => metal(0x8e939b, { roughness: 0.5 });
const darkSteel = () => metal(0x3a3d43, { roughness: 0.55 });
const rubber = () => mat(0x141517, { roughness: 0.92 });

function spokes([cx, cy]) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.006, 0.006, 0.8, 5);
  const m = steel();
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const s = new THREE.Mesh(geo, m);
    s.position.set(cx + Math.cos(a) * 0.45, cy + Math.sin(a) * 0.45, i % 2 ? 0.035 : -0.035);
    s.rotation.z = a - Math.PI / 2;
    g.add(s);
  }
  return g;
}

export default {
  id: 'bicycle',
  name: 'Bicycle',
  blurb:
    'The most efficient vehicle ever built took about seventy years to assemble: steering first, then pedals, wire wheels, a chain, and finally air-filled tyres.',
  timeline: [
    ['1817', 'Karl Drais rides his steerable two-wheeled “running machine” near Mannheim. It has no pedals.'],
    ['Early 1860s', 'Pierre Michaux and Pierre Lallement fit cranks and pedals to the front wheel.'],
    ['1870s', 'The penny-farthing grows its front wheel for speed, on light wire spokes.'],
    ['1885', 'John Kemp Starley’s Rover puts a chain to the rear wheel between two equal wheels: the safety bicycle.'],
    ['1888', 'John Boyd Dunlop’s pneumatic tyre makes the small-wheeled safety comfortable.'],
    ['1937', 'Derailleur gears are allowed in the Tour de France.'],
  ],
  parts: [
    {
      id: 'tyres',
      name: 'Tyres',
      anchor: [-1.0, 1.87, 0.07],
      explode: [0, 0, -1.7],
      make: () => group(hoop(0.93, 0.07, at(REAR), rubber()), hoop(0.93, 0.07, at(FRONT), rubber())),
      inventions: [
        {
          name: 'Pneumatic tyre',
          kind: 'invention',
          year: '1888',
          by: 'John Boyd Dunlop',
          what: 'A rubber tube filled with air under pressure, wrapped around the wheel. The air is the spring: it swallows bumps that a solid tyre passes straight to the rider.',
          here: 'Small equal wheels were safer than the high-wheeler but shook the rider badly. Air-filled tyres fixed that, and they roll faster too.',
          story:
            "In 1887 John Boyd Dunlop, a vet in Belfast, wanted to give his young son a smoother ride on his tricycle over the city’s rough streets. Using his experience with rubber, he made a tube from sheet rubber, filled it with air, and fitted it to a wooden disc. He rolled it across his yard beside a metal wheel from the tricycle: the metal wheel soon stopped, but the air-filled one kept going until it hit a gatepost and bounced back. He fitted tyres to the tricycle, then to bicycles. Patented in 1888, they were proved by a racer, Willie Hume, who won race after race on them. Dunlop later learned that Robert Thomson had patented the same idea decades earlier.",
          read: [{ label: "John Boyd Dunlop", wiki: "John_Boyd_Dunlop" }, { label: "Robert William Thomson", wiki: "Robert_William_Thomson" }],
          people: [
            { name: 'John Boyd Dunlop', life: '1840 – 1921', role: 'Scottish veterinary surgeon working in Ireland. He made his first air tyre in 1887 for his son’s tricycle.', wiki: 'John_Boyd_Dunlop' },
            { name: 'Robert William Thomson', life: '1822 – 1873', role: 'Scottish inventor who patented a pneumatic tyre in 1845, aged 23. It was decades ahead of any market for it.', wiki: 'Robert_William_Thomson' },
          ],
          uses: ['Cars and lorries', 'Aircraft landing gear', 'Motorcycles', 'Wheelbarrows', 'Wheelchairs'],
          timeline: [
            ['1845', 'Robert William Thomson patents the first pneumatic tyre.'],
            ['1887', 'Dunlop builds an air tyre for his son’s tricycle.'],
            ['1888', 'Dunlop patents it, and production for bicycles begins.'],
            ['1889', 'Riders on pneumatic tyres win races in Ireland and then England.'],
          ],
        },
        {
          name: "Schrader valve",
          kind: "invention",
          year: "1891",
          by: "August and George Schrader",
          what: "A small spring-loaded valve in the tyre. Air can be pumped in, but the pressure inside holds the valve shut.",
          here: "The valve stem poking through the rim is how the tyre is pumped up, and how it keeps its air.",
          story: "August Schrader was a German immigrant who ran a shop selling rubber goods in New York. From 1845 he made fittings and valves for rubber products made by the Goodyear brothers, and he also designed a diving helmet and an air pump to go with it. Around 1890, hearing of the success English cyclists were having with air-filled tyres, he saw that tyres would need a reliable valve. By 1891 his company had one: a stem with a spring-loaded core that opens only when a pump pushes air against it. His son George, who is generally credited with the experimental work, patented the valve in 1893. It is still used on nearly every car tyre in the world, and on many bicycles.",
          read: [
            { label: "Schrader valve", wiki: "Schrader_valve" },
            { label: "August Schrader", wiki: "August_Schrader" },
          ],
          people: [
            { name: "August Schrader", life: "1807 – 1894", role: "German-American maker of rubber goods, valves and diving equipment in New York.", wiki: "August_Schrader" },
            { name: "George Schrader", life: "1858 – 1915", role: "August’s son, credited with the experimental work behind the valve, which he patented in 1893.", wiki: "George_Schrader" },
          ],
          uses: ["Car and lorry tyres", "Motorcycle and aircraft tyres", "Air-conditioning and fridge pipes", "Lawnmower tyres", "Inflatable boats"],
          timeline: [
            ["1845", "August Schrader begins making valves for rubber goods."],
            ["1891", "The Schrader valve is produced."],
            ["1893", "George Schrader patents it."],
            ["Today", "It is used on virtually every motor vehicle in the world."],
          ],
        },
      ],
    },
    {
      id: 'wheels',
      name: 'Spoked wheels',
      anchor: [0.9, 0.4, 0.04],
      explode: [0, 0, -1.0],
      make: () =>
        group(hoop(0.85, 0.03, at(REAR), alloy()), hoop(0.85, 0.03, at(FRONT), alloy()), spokes(REAR), spokes(FRONT)),
      inventions: [
        {
          name: 'Wire tension wheel',
          kind: 'invention',
          year: '1869',
          by: 'Eugène Meyer',
          what: 'Instead of thick wooden spokes that push outward, thin wires pull the rim inward. The hub hangs from the spokes above it, so the wheel can be very light.',
          here: 'Each wheel carries the rider on a few dozen wires thinner than a matchstick. It is still one of the strongest structures for its weight.',
          story:
            "The first pedal bicycles had heavy wooden wheels with iron rims, and were nicknamed “boneshakers”. Because the pedals turned the front wheel directly, the only way to go faster was to make that wheel bigger, but a big wooden wheel was far too heavy. In 1869 Eugène Meyer, a mechanic in Paris, patented wheels held together by thin wire spokes pulled tight, like the strings of an instrument. The hub hangs from the spokes above it rather than standing on the ones below, so the wheel can be large and very light. This made the tall penny-farthing possible. In 1874 James Starley angled the spokes so the wheel could also carry pedalling and braking forces.",
          read: [{ label: "Eugène Meyer (inventor)", wiki: "Eugène_Meyer_(inventor)" }, { label: "Bicycle wheel", wiki: "Bicycle_wheel" }],
          people: [
            { name: 'Eugène Meyer', life: 'Active 1869', role: 'French mechanic from Alsace working in Paris. He raced his own bicycles to promote them.', wiki: null, link: 'Eugène_Meyer_(inventor)' },
            { name: 'James Starley', life: '1830 – 1881', role: 'English inventor, often called the father of the bicycle industry. He patented tangent spokes in 1874.', wiki: 'James_Starley' },
          ],
          uses: ['Motorcycles', 'Wheelchairs', 'Early cars and aircraft', 'Ferris wheels'],
          timeline: [
            ['1808', 'George Cayley proposes tension wheels for flying machines.'],
            ['1869', 'Eugène Meyer receives the first patent for wire wheels on bicycles.'],
            ['1874', 'James Starley patents tangent spokes, which carry pedalling and braking forces better.'],
          ],
        },
      ],
    },
    {
      id: 'hubs',
      name: 'Hubs',
      anchor: [-1.5, 1.04, 0.17],
      explode: [0, 0, -0.45],
      make: () =>
        group(
          zcyl(0.055, 0.3, at(REAR), alloy()), zcyl(0.085, 0.02, at(REAR, 0.06), alloy()), zcyl(0.085, 0.02, at(REAR, -0.06), alloy()),
          zcyl(0.05, 0.26, at(FRONT), alloy()), zcyl(0.08, 0.02, at(FRONT, 0.06), alloy()), zcyl(0.08, 0.02, at(FRONT, -0.06), alloy())
        ),
      inventions: [
        {
          name: 'Bicycle ball bearing',
          kind: 'invention',
          kindNote: 'Ball bearings are older. Suriray’s patent was for using them in bicycles.',
          year: '1869',
          by: 'Jules Suriray',
          what: 'A ring of hard steel balls rolling between the axle and the hub. Rolling wastes far less energy than sliding, so the wheel spins almost freely.',
          here: 'Bearings sit in both hubs, the pedals, the cranks and the steering. They are why a bicycle keeps rolling long after you stop pedalling.',
          story:
            "On early bicycles the axles turned in plain metal sleeves. The surfaces slid against each other, wasting a lot of the rider’s effort as friction and wearing out quickly. The idea of rolling balls had been patented for carriage axles by Philip Vaughan in Wales as early as 1794, but it had not been applied to bicycles. Jules Suriray, a bicycle mechanic in Paris, did so and was granted a patent on 2 August 1869. In November that year his bearings were fitted to the bicycle ridden by James Moore in the world’s first long-distance road race, from Paris to Rouen. Moore won, and ball bearings soon became standard on bicycles.",
          read: [{ label: "Jules Suriray", wiki: "Jules_Suriray" }, { label: "Ball bearing", wiki: "Ball_bearing" }],
          people: [{ name: 'Jules Suriray', life: 'Active 1869', role: 'Parisian bicycle mechanic who patented the use of ball bearings in bicycles.', wiki: null, link: 'Jules_Suriray' }],
          uses: ['Car wheels', 'Electric motors', 'Skateboards', 'Hard disk drives', 'Fans'],
          timeline: [
            ['1794', 'Philip Vaughan patents the first ball bearing, for carriage axles.'],
            ['Aug 1869', 'Suriray patents ball bearings for bicycles in Paris.'],
            ['Nov 1869', 'James Moore wins the first road race, Paris–Rouen, on a bicycle fitted with them.'],
            ['1907', 'SKF is founded in Sweden to make the self-aligning ball bearing.'],
          ],
        },
      ],
    },
    {
      id: 'frame',
      name: 'Diamond frame',
      anchor: [0.2, 2.2, 0.05],
      explode: [0, 0, 0],
      make: () =>
        group(
          tube(at(BB), at(SEAT), 0.045, paint()),
          tube(at(SEAT), at(HEAD_TOP), 0.042, paint()),
          tube(at(BB), at(HEAD_BOT), 0.048, paint()),
          tube([0.94, 2.26, 0], [1.065, 1.8, 0], 0.06, paint()),
          tube(at(BB, 0.05), at(REAR, 0.11), 0.024, paint()),
          tube(at(BB, -0.05), at(REAR, -0.11), 0.024, paint()),
          tube([-0.57, 2.06, 0.04], at(REAR, 0.11), 0.02, paint()),
          tube([-0.57, 2.06, -0.04], at(REAR, -0.11), 0.02, paint()),
          zcyl(0.075, 0.16, at(BB), paint())
        ),
      inventions: [
        {
          name: 'Safety bicycle',
          kind: 'design',
          kindNote: 'Every part of it existed already. The invention was the arrangement: two equal wheels and a chain to the back.',
          year: '1885',
          by: 'John Kemp Starley',
          what: 'Two wheels of the same size, the rider sitting low between them, and a chain driving the rear wheel. Unlike the high-wheeler, a sudden stop no longer threw the rider over the handlebars.',
          here: 'This is the layout of the frame itself. Almost every bicycle built since has kept the same two triangles.',
          story:
            "By the 1870s the fastest bicycle was the penny-farthing, its rider perched high above a huge front wheel. It was fast but dangerous: hitting a stone or braking hard could pitch the rider head-first over the handlebars, a fall known as “taking a header”. Many people would not risk it. Inventors looked for a safer layout. Harry Lawson designed a rear-chain-driven machine in 1879, but it did not sell. In 1885 John Kemp Starley, in Coventry, produced the Rover: two wheels of similar size, the rider seated low between them, and a chain to the rear wheel. It was as fast as a high-wheeler and far safer, and it set the shape of almost every bicycle since.",
          read: [{ label: "Safety bicycle", wiki: "Safety_bicycle" }, { label: "John Kemp Starley", wiki: "John_Kemp_Starley" }],
          people: [{ name: 'John Kemp Starley', life: '1855 – 1901', role: 'English inventor and industrialist in Coventry, nephew of James Starley. His firm later became the Rover car company.', wiki: 'John_Kemp_Starley' }],
          uses: ['City and racing bicycles', 'Mountain bikes', 'Early motorcycles', 'Electric bikes'],
          timeline: [
            ['1876', 'Harry John Lawson designs the first bicycle to be called a “safety”.'],
            ['1879', 'Lawson’s Bicyclette drives the rear wheel with a chain, but does not sell.'],
            ['1885', 'Starley’s Rover Safety Bicycle is the first recognisably modern bicycle.'],
            ['1888', 'Pneumatic tyres remove the last advantage of the big wheel.'],
          ],
        },
        {
          name: 'Seamless steel tube',
          kind: 'process',
          year: '1886',
          by: 'Reinhard & Max Mannesmann',
          what: 'A solid steel bar is pierced and rolled into a tube with no welded seam, so there is no weak line along its length.',
          here: 'A tube is far stiffer than a solid rod of the same weight. Seamless tubing let frames be both light and strong.',
          story:
            "Metal pipes used to be made by bending a flat plate into a tube and joining the edges with a weld. That seam was the weak line where pipes split under pressure. The German brothers Reinhard and Max Mannesmann, sons of a steel-file maker, found a way to make a tube from a solid bar with no seam at all. They fed a hot steel bar between rollers set at an angle to each other, and the rolling twisted and pulled the centre of the bar open into a hollow. They patented the process in 1886 and set up tube mills over the next few years, just as the cycling boom created huge demand for strong, light steel tubing.",
          read: [{ label: "Mannesmann", wiki: "Mannesmann" }, { label: "Bicycle frame", wiki: "Bicycle_frame" }],
          people: [
            { name: 'Reinhard Mannesmann', life: '1856 – 1922', role: 'German engineer who, with his brother, received the first patent for rolling seamless steel pipe.', wiki: null, link: 'Mannesmann' },
            { name: 'Max Mannesmann', life: '1857 – 1915', role: 'German engineer and co-inventor of the Mannesmann rolling process.', wiki: null, link: 'Mannesmann' },
          ],
          uses: ['Oil and gas pipelines', 'Boiler tubes', 'Scaffolding', 'Hydraulic cylinders'],
          timeline: [
            ['1886', 'The Mannesmann brothers patent their rolling process.'],
            ['1887 – 1889', 'They found tube mills to put it into production.'],
            ['1890s', 'The bicycle boom creates a large demand for light steel tube.'],
          ],
        },
      ],
    },
    {
      id: 'steering',
      name: 'Fork & handlebar',
      anchor: [1.3, 1.42, 0.12],
      explode: [1.0, 0, 0],
      make: () =>
        group(
          tube([1.07, 1.8, 0.1], at(FRONT, 0.1), 0.028, paint()),
          tube([1.07, 1.8, -0.1], at(FRONT, -0.1), 0.028, paint()),
          zcyl(0.036, 0.26, [1.07, 1.8, 0], paint()),
          tube(at(HEAD_TOP), [0.9, 2.46, 0], 0.03, alloy()),
          zcyl(0.024, 1.1, [0.9, 2.46, 0], alloy()),
          zcyl(0.034, 0.2, [0.9, 2.46, 0.47], rubber()),
          zcyl(0.034, 0.2, [0.9, 2.46, -0.47], rubber())
        ),
      inventions: [
        {
          name: 'Steerable two-wheeler',
          kind: 'invention',
          year: '1817',
          by: 'Karl Drais',
          what: 'Two wheels in a line, with the front one turned by a handlebar. Drais found that a rider can balance simply by steering into each wobble.',
          here: 'The fork and handlebar are that idea unchanged. Steering is what keeps a bicycle upright; without it you cannot balance at all.',
          story:
            "In 1815 the volcano Tambora erupted in Indonesia. Its ash darkened the skies, and 1816 became “the year without a summer” in Europe, with crops failing and oats too scarce to feed horses. Historians have suggested this led Karl Drais, a German forest official in Mannheim, to look for a way to travel without horses. His answer was a wooden frame on two wheels in a line, with a handlebar to turn the front wheel. The rider sat astride it and pushed along the ground with their feet. He discovered that by steering, a rider could balance on just two wheels. On 12 June 1817 he rode it about 7 km, faster than walking.",
          read: [{ label: "Karl Drais", wiki: "Karl_Drais" }, { label: "Year Without a Summer", wiki: "Year_Without_a_Summer" }],
          people: [{ name: 'Karl Drais', life: '1785 – 1851', role: 'German forest official and prolific inventor. His first ride, in June 1817, covered about 7 km.', wiki: 'Karl_Drais' }],
          uses: ['Children’s balance bikes', 'Kick scooters', 'Motorcycles'],
          timeline: [
            ['1817', 'Drais makes the first ride on his running machine near Mannheim.'],
            ['1818', 'He shows it in Paris, where it becomes the draisienne.'],
            ['Early 1860s', 'Pedals are added and riders’ feet leave the ground.'],
          ],
        },
      ],
    },
    {
      id: 'saddle',
      name: 'Saddle',
      anchor: [-0.62, 2.53, 0.1],
      explode: [0, 0.8, 0],
      make: () => {
        const seat = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat(0x6a4326, { roughness: 0.7 }));
        seat.scale.set(0.33, 0.05, 0.15);
        seat.position.set(-0.6, 2.47, 0);
        return group(tube(at(SEAT), [-0.6, 2.42, 0], 0.03, alloy()), seat);
      },
      inventions: [
        {
          name: 'Leather tension saddle',
          kind: 'invention',
          year: '1882',
          by: 'John Boultbee Brooks',
          what: 'A sheet of thick leather stretched like a hammock between a metal nose and a rear frame. It gives under the rider and slowly moulds to their shape.',
          here: 'It carries most of the rider’s weight while leaving the legs free to turn the pedals.',
          story:
            "John Boultbee Brooks ran a business in Birmingham making leather harnesses and horse equipment. According to his family’s story, when his horse died he borrowed a bicycle to get to work, and found its hard saddle so uncomfortable that he decided to make a better one. His design stretched a thick sheet of leather between a metal nose and a sprung rear frame, like a hammock. It gives a little under the rider and, over time, moulds to their shape. Brooks filed his first saddle patent in 1882, and his company has made leather saddles ever since.",
          read: [{ label: "Brooks England", wiki: "Brooks_England" }, { label: "Bicycle saddle", wiki: "Bicycle_saddle" }],
          people: [{ name: 'John Boultbee Brooks', life: 'Founded his firm in 1866', role: 'English leather-goods maker in Birmingham. His company, Brooks, still makes leather saddles.', wiki: null, link: 'Brooks_England' }],
          uses: ['Touring bicycles', 'City bicycles', 'Early motorcycles'],
          timeline: [
            ['1866', 'Brooks starts making leather goods in Birmingham.'],
            ['1882', 'The firm files its first saddle patent.'],
            ['1880s', 'Saddle production begins, as the safety bicycle takes off.'],
          ],
        },
      ],
    },
    {
      id: 'chain',
      name: 'Chain drive',
      anchor: [-0.16, 1.02, 0.15],
      explode: [0, 0, 0.8],
      make: () =>
        group(
          zcyl(0.22, 0.018, at(BB, 0.13), alloy(), 48),
          zcyl(0.08, 0.018, at(REAR, 0.13), steel()),
          hoop(0.226, 0.013, at(BB, 0.13), darkSteel()),
          hoop(0.086, 0.013, at(REAR, 0.13), darkSteel()),
          tube([BB[0], BB[1] + 0.226, 0.13], [REAR[0], REAR[1] + 0.086, 0.13], 0.013, darkSteel(), 8),
          tube([BB[0], BB[1] - 0.226, 0.13], [REAR[0], REAR[1] - 0.086, 0.13], 0.013, darkSteel(), 8)
        ),
      inventions: [
        {
          name: 'Bush roller chain',
          kind: 'invention',
          year: '1880',
          by: 'Hans Renold',
          what: 'Links joined by pins, with a free-turning roller on each pin. The rollers roll onto the sprocket teeth instead of scraping, so very little power is lost.',
          here: 'The chain lets a small rear wheel turn several times for each turn of the pedals, so the giant front wheel is no longer needed.',
          story:
            "Chains for driving machines were around long before bicycles; Leonardo da Vinci sketched one with rollers in the 1500s. But the chains of the 1800s were made of solid blocks or bare pins that slid and scraped against the sprocket teeth, wasting power and wearing out quickly. Hans Renold, a Swiss engineer, settled in Manchester and in 1879 started a business making chain. In 1880 he patented a better design: each pin was surrounded by a hardened sleeve, or bush, with a free roller turning on the outside. The rollers roll onto the teeth instead of rubbing. His bush roller chain is the design used on bicycles, motorbikes and machines today.",
          read: [{ label: "Hans Renold", wiki: "Hans_Renold" }, { label: "Roller chain", wiki: "Roller_chain" }],
          people: [{ name: 'Hans Renold', life: '1852 – 1943', role: 'Swiss-born engineer who settled in Manchester and built a chain-making firm that still carries his name.', wiki: 'Hans_Renold' }],
          uses: ['Motorcycles', 'Engine timing chains', 'Conveyors', 'Forklifts', 'Farm machinery'],
          timeline: [
            ['16th c.', 'Leonardo da Vinci sketches a chain with rollers.'],
            ['1800', 'James Fussell patents an early roller chain.'],
            ['1879', 'Lawson’s Bicyclette drives its rear wheel by chain.'],
            ['1880', 'Renold patents the bush roller chain still used today.'],
          ],
        },
        {
          name: 'Freewheel',
          kind: 'invention',
          year: '1869',
          by: 'William Van Anden',
          what: 'A ratchet in the hub that grips when you pedal forward and slips when you stop, so the wheel can keep turning on its own.',
          here: 'It is the ticking sound when you coast. Without it the pedals would spin with the wheel all the way down every hill.',
          story:
            "On the first pedal bicycles, the pedals were fixed to the wheel. Whenever the wheel turned, the pedals turned too, so on a downhill they spun wildly and riders had to take their feet off and rest them on pegs. In 1869 William Van Anden of Poughkeepsie, New York, invented a freewheel for the bicycle: a ratchet in the hub that grips when the rider pushes forward and slips when they stop, letting the wheel spin on its own. It was ahead of its time. Only in the 1890s, once chain-driven safety bicycles were common, did rear freewheels spread, letting riders coast and leading on to coaster brakes.",
          read: [{ label: "Freewheel", wiki: "Freewheel" }, { label: "Bicycle brake", wiki: "Bicycle_brake" }],
          people: [{ name: 'William Van Anden', life: 'Active 1869', role: 'American inventor from Poughkeepsie, New York, who devised the freewheel for the bicycle.', wiki: null, link: 'Freewheel' }],
          uses: ['Helicopter rotors', 'Car starter motors', 'Automatic gearboxes'],
          timeline: [
            ['1869', 'Van Anden invents the bicycle freewheel.'],
            ['1890s', 'The rear freewheel becomes common, and the coaster brake follows.'],
          ],
        },
      ],
    },
    {
      id: 'cranks',
      name: 'Cranks & pedals',
      anchor: [0.08, 0.9, 0.3],
      explode: [0, 0, 1.5],
      make: () => {
        const pedal = (x, z) => {
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.16), darkSteel());
          p.position.set(x, BB[1], z);
          return p;
        };
        return group(
          zcyl(0.032, 0.42, at(BB), steel()),
          tube(at(BB, 0.19), [0.08, BB[1], 0.19], 0.026, alloy()),
          tube(at(BB, -0.19), [-0.68, BB[1], -0.19], 0.026, alloy()),
          pedal(0.08, 0.29), pedal(-0.68, -0.29)
        );
      },
      inventions: [
        {
          name: 'Pedal crank drive',
          kind: 'invention',
          year: 'c. 1864',
          by: 'Pierre Michaux & Pierre Lallement',
          what: 'Cranks turn the push of the legs into rotation. Historians still argue over who fitted them first; the earliest date they agree on is 1864.',
          here: 'The cranks are the lever between rider and machine. On the first pedal bicycles they were fixed straight to the front wheel.',
          story:
            "Early riders of Drais’s machine pushed themselves along with their feet. In Paris in the early 1860s, someone had the idea of fixing cranks and pedals to the front wheel so the rider’s feet could leave the ground. Exactly who is still disputed. The blacksmith Pierre Michaux and his son Ernest were said to have done it while repairing a running machine. Pierre Lallement, a young mechanic, claimed he built one first; he later moved to America and in 1866 received the only US patent for the pedal bicycle. Historians agree only that it happened by 1864. Michaux’s workshop went on to make the first pedal bicycles in large numbers.",
          read: [{ label: "History of the bicycle", wiki: "History_of_the_bicycle" }, { label: "Pierre Lallement", wiki: "Pierre_Lallement" }],
          people: [
            { name: 'Pierre Lallement', life: '1843 – 1891', role: 'French mechanic who took out the first, and only, American patent for the pedal bicycle in 1866.', wiki: 'Pierre_Lallement' },
            { name: 'Pierre Michaux', life: '1813 – 1883', role: 'Paris blacksmith and carriage-parts maker whose workshop sold the first mass-produced pedal velocipedes.', wiki: 'Pierre_Michaux' },
          ],
          uses: ['Exercise bikes', 'Pedal boats', 'Hand-crank generators', 'Children’s tricycles'],
          timeline: [
            ['Early 1860s', 'Michaux and Lallement add cranks and pedals to the front wheel.'],
            ['1866', 'Lallement is granted his US patent.'],
            ['1870s', 'The penny-farthing enlarges the driven wheel to go faster.'],
            ['1885', 'The chain moves the cranks to the middle of the frame.'],
          ],
        },
      ],
    },
    {
      id: 'brake',
      name: 'Rim brake',
      anchor: [1.1, 1.9, 0.09],
      explode: [1.5, 0.6, 0],
      make: () => {
        const pad = (z) => {
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.03), rubber());
          p.position.set(1.12, 1.76, z);
          p.rotation.z = 1.1;
          return p;
        };
        return group(
          zcyl(0.016, 0.18, [1.1, 1.89, 0], alloy(), 12),
          tube([1.1, 1.89, 0.075], [1.12, 1.77, 0.062], 0.014, alloy(), 8),
          tube([1.1, 1.89, -0.075], [1.12, 1.77, -0.062], 0.014, alloy(), 8),
          pad(0.055), pad(-0.055)
        );
      },
      inventions: [
        {
          name: 'Caliper brake',
          kind: 'invention',
          year: '1887',
          by: 'Browett & Harrison',
          what: 'Two arms reach around the wheel and squeeze a rubber block against each side of the rim, like a hand gripping it.',
          here: 'It turns the whole rim into a brake disc, with no extra weight on the wheel.',
          story:
            "The first pedal bicycles slowed down with a “spoon” brake: a metal shoe pressed onto the tyre by a lever. It wore the tyre down, and on penny-farthings many riders simply slowed by resisting the pedals. In 1887 two English inventors, Browett and Harrison, patented a different approach. Two arms reach around the wheel and squeeze a block of rubber against each side of the rim, gripping it like a hand. Using the rim as the braking surface meant the tyre was not worn away, a big advantage once soft air-filled tyres arrived the following year. The same squeezing principle is used in the disc brakes of modern bicycles and cars.",
          read: [{ label: "Bicycle brake", wiki: "Bicycle_brake" }],
          people: [{ name: 'Browett & Harrison', life: 'Active 1887', role: 'English patentees of the first caliper brake, made as an alternative to the spoon brake.', wiki: null, link: 'Bicycle_brake' }],
          uses: ['Road and city bicycles', 'Wheelchairs', 'Disc brakes use the same squeeze on a smaller disc'],
          timeline: [
            ['1860s', 'Early pedal bicycles press a metal spoon onto the tyre.'],
            ['1887', 'Browett and Harrison patent the caliper brake.'],
            ['1890s', 'Coaster brakes and cable-pulled hand brakes appear.'],
          ],
        },
        {
          name: "Bowden cable",
          kind: "invention",
          year: "1896",
          by: "Ernest Monnington Bowden",
          what: "A steel wire that slides inside a flexible tube. Pulling one end pulls the other, even around bends, so a lever in one place can work a brake somewhere else.",
          here: "Squeezing the brake lever pulls the inner wire, which closes the brake on the rim, however the handlebar is turned.",
          story: "Early bicycle brakes were worked by rigid rods running from the lever to the brake. Ernest Monnington Bowden, an Irishman living in London, patented a better link in 1896: a cable that slides inside a flexible casing. Because the casing takes the push and the wire takes the pull, the whole thing can bend freely along the frame. He meant it for bicycle brakes. The Bowden brake was launched the same year to great enthusiasm in the cycling press: a lever on the handlebar pulled a stirrup that pressed rubber pads against the rim of the rear wheel. Bowden died in 1904. The invention is often credited to a different man, Sir Frank Bowden, owner of the Raleigh bicycle company, but no evidence has been found to support that.",
          read: [
            { label: "Bowden cable", wiki: "Bowden_cable" },
            { label: "Bicycle brake", wiki: "Bicycle_brake" },
          ],
          people: [
            { name: "Ernest Monnington Bowden", life: "1860 – 1904", role: "Irish inventor living in London who patented the cable in 1896, for use with bicycle brakes.", wiki: null, link: "Bowden_cable#History" },
          ],
          uses: ["Bicycle gear changers", "Motorcycle clutches and throttles", "Car handbrakes", "Light aircraft throttles", "Lawnmower controls"],
          timeline: [
            ["1896", "Bowden patents his cable, and the Bowden brake is launched."],
            ["1904", "Ernest Bowden dies; the invention is later wrongly credited to Frank Bowden of Raleigh."],
            ["20th c.", "Bowden cables spread to motorcycles, cars and aircraft controls."],
          ],
        },
      ],
    },
  ],
};
