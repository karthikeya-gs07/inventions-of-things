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
          year: '1888',
          by: 'John Boyd Dunlop',
          what: 'A rubber tube filled with air under pressure, wrapped around the wheel. The air is the spring: it swallows bumps that a solid tyre passes straight to the rider.',
          here: 'Small equal wheels were safer than the high-wheeler but shook the rider badly. Air-filled tyres fixed that, and they roll faster too.',
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
          year: '1869',
          by: 'Eugène Meyer',
          what: 'Instead of thick wooden spokes that push outward, thin wires pull the rim inward. The hub hangs from the spokes above it, so the wheel can be very light.',
          here: 'Each wheel carries the rider on a few dozen wires thinner than a matchstick. It is still one of the strongest structures for its weight.',
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
          year: '1869',
          by: 'Jules Suriray',
          what: 'A ring of hard steel balls rolling between the axle and the hub. Rolling wastes far less energy than sliding, so the wheel spins almost freely.',
          here: 'Bearings sit in both hubs, the pedals, the cranks and the steering. They are why a bicycle keeps rolling long after you stop pedalling.',
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
          year: '1885',
          by: 'John Kemp Starley',
          what: 'Two wheels of the same size, the rider sitting low between them, and a chain driving the rear wheel. Unlike the high-wheeler, a sudden stop no longer threw the rider over the handlebars.',
          here: 'This is the layout of the frame itself. Almost every bicycle built since has kept the same two triangles.',
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
          year: '1886',
          by: 'Reinhard & Max Mannesmann',
          what: 'A solid steel bar is pierced and rolled into a tube with no welded seam, so there is no weak line along its length.',
          here: 'A tube is far stiffer than a solid rod of the same weight. Seamless tubing let frames be both light and strong.',
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
          year: '1817',
          by: 'Karl Drais',
          what: 'Two wheels in a line, with the front one turned by a handlebar. Drais found that a rider can balance simply by steering into each wobble.',
          here: 'The fork and handlebar are that idea unchanged. Steering is what keeps a bicycle upright; without it you cannot balance at all.',
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
          year: '1882',
          by: 'John Boultbee Brooks',
          what: 'A sheet of thick leather stretched like a hammock between a metal nose and a rear frame. It gives under the rider and slowly moulds to their shape.',
          here: 'It carries most of the rider’s weight while leaving the legs free to turn the pedals.',
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
          year: '1880',
          by: 'Hans Renold',
          what: 'Links joined by pins, with a free-turning roller on each pin. The rollers roll onto the sprocket teeth instead of scraping, so very little power is lost.',
          here: 'The chain lets a small rear wheel turn several times for each turn of the pedals, so the giant front wheel is no longer needed.',
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
          year: '1869',
          by: 'William Van Anden',
          what: 'A ratchet in the hub that grips when you pedal forward and slips when you stop, so the wheel can keep turning on its own.',
          here: 'It is the ticking sound when you coast. Without it the pedals would spin with the wheel all the way down every hill.',
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
          year: 'c. 1864',
          by: 'Pierre Michaux & Pierre Lallement',
          what: 'Cranks turn the push of the legs into rotation. Historians still argue over who fitted them first; the earliest date they agree on is 1864.',
          here: 'The cranks are the lever between rider and machine. On the first pedal bicycles they were fixed straight to the front wheel.',
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
          year: '1887',
          by: 'Browett & Harrison',
          what: 'Two arms reach around the wheel and squeeze a rubber block against each side of the rim, like a hand gripping it.',
          here: 'It turns the whole rim into a brake disc, with no extra weight on the wheel.',
          people: [{ name: 'Browett & Harrison', life: 'Active 1887', role: 'English patentees of the first caliper brake, made as an alternative to the spoon brake.', wiki: null, link: 'Bicycle_brake' }],
          uses: ['Road and city bicycles', 'Wheelchairs', 'Disc brakes use the same squeeze on a smaller disc'],
          timeline: [
            ['1860s', 'Early pedal bicycles press a metal spoon onto the tyre.'],
            ['1887', 'Browett and Harrison patent the caliper brake.'],
            ['1890s', 'Coaster brakes and cable-pulled hand brakes appear.'],
          ],
        },
      ],
    },
  ],
};
