import { mat, metal, wood, pencilPaint, cyl, lathe, group } from './helpers.js';

// Built along local +Y (eraser -> point), laid along world +X. Local -X is up.
export default {
  id: 'pencil',
  name: 'Pencil',
  blurb:
    'The cheapest writing tool on the desk took 400 years to settle into its present form — a mine, a kiln, a rubber tree and a patent dispute.',
  rotation: [0, 0, -Math.PI / 2],
  position: [0, 0.2, 0],
  timeline: [
    ['1500s', 'A deposit of unusually pure graphite is found at Borrowdale, England, and used to mark sheep.'],
    ['c. 1560', 'The Bernacottis encase a graphite stick in juniper wood.'],
    ['1662', 'A way to bind graphite powder back into solid sticks is found in Germany.'],
    ['1795', 'Conté’s fired graphite–clay core makes hardness controllable.'],
    ['1858', 'Hymen Lipman patents the pencil with an eraser on the end.'],
    ['1889', 'Hardtmuth shows its yellow-barrelled Koh-i-Noor in Paris; rivals copy the colour.'],
  ],
  parts: [
    {
      id: 'eraser',
      name: 'Eraser',
      anchor: [-0.13, -2.3, 0.13],
      explode: [0, -1.0, 0],
      make: () =>
        lathe([[0, -2.5], [0.15, -2.5], [0.185, -2.47], [0.19, -2.43], [0.19, -2.08], [0, -2.08]], mat(0xdf8a93, { roughness: 0.92, sheen: 0.5 }), 48),
      inventions: [
        {
          name: 'Rubber eraser',
          kind: 'discovery',
          kindNote: 'Rubber already existed. What was discovered, apparently by accident, was that it rubs out pencil.',
          year: '1770',
          by: 'Edward Nairne',
          what: 'Nairne sold cubes of natural rubber for rubbing out pencil marks — before that, people used balled-up bread. The job gave rubber its English name.',
          here: 'Rubber grips graphite particles more strongly than paper does, lifting them off the page as it crumbles.',
          story:
            "For centuries, pencil mistakes were rubbed out with lumps of crustless bread. Rubber, a strange elastic substance brought to Europe from South America, was little more than a curiosity. In 1770 the scientist Joseph Priestley noted in a book that he had found “a substance excellently adapted to the purpose of wiping from paper the mark of black lead pencil”, and that it was sold by Edward Nairne, a London maker of scientific instruments. Nairne sold small cubes of it for a high price. A popular story says he discovered it by picking up rubber instead of bread by mistake. The material was named after the job: “rubber”, the thing that rubs out.",
          read: [{ label: "Eraser", wiki: "Eraser" }, { label: "Edward Nairne", wiki: "Edward_Nairne" }],
          people: [{ name: 'Edward Nairne', life: '1726 – 1806', role: 'English optician and scientific-instrument maker with a shop in Cornhill, London.', wiki: 'Edward_Nairne' }],
          uses: ['Pencil tips', 'Artists’ kneaded erasers', 'Drafting and technical drawing', 'Typewriter erasers'],
          timeline: [
            ['Before 1770', 'Pencil marks are rubbed out with crustless bread.'],
            ['1770', 'Nairne sells rubber cubes; Joseph Priestley notes how well they work.'],
            ['1839', 'Vulcanisation makes erasers that neither rot nor go sticky.'],
            ['1858', 'Lipman fixes the eraser to the end of the pencil.'],
            ['20th c.', 'Vinyl and plastic erasers replace natural rubber.'],
          ],
        },
        {
          name: 'Vulcanisation',
          kind: 'process',
          year: '1839',
          by: 'Charles Goodyear',
          what: 'Heating rubber with sulphur cross-links its molecules, so it stays springy instead of going sticky in heat and brittle in cold.',
          here: 'It is why the eraser on a pencil left in a drawer for years still works instead of rotting or hardening.',
          story:
            "In the 1830s America caught “rubber fever”. Rubber raincoats, shoes and boots sold fast, then turned into stinking, sticky glue in summer heat and cracked in winter cold, and the companies collapsed. Charles Goodyear, a failed hardware merchant, became convinced rubber could be fixed. For years he experimented in poverty, mixing rubber with anything he could think of, and was jailed for debt more than once. In 1839, according to his own account, a lump of rubber mixed with sulphur touched a hot stove. Instead of melting, it charred like leather and stayed flexible. Heat and sulphur together were the answer. Goodyear spent years perfecting the process and died in debt.",
          read: [{ label: "Charles Goodyear", wiki: "Charles_Goodyear" }, { label: "Vulcanization", wiki: "Vulcanization" }],
          people: [{ name: 'Charles Goodyear', life: '1800 – 1860', role: 'Self-taught American inventor. He died deep in debt; the tyre company was named in his honour decades later.', wiki: 'Charles_Goodyear' }],
          uses: ['Car tyres', 'Shoe soles', 'Hoses and seals', 'Rubber bands', 'Hockey pucks'],
          timeline: [
            ['c. 1600 BC', 'Mesoamericans cure latex with plant juice to make bouncing balls.'],
            ['1839', 'Goodyear drops a rubber–sulphur mix on a hot stove and it chars instead of melting.'],
            ['1844', 'Goodyear’s US patent is granted, months after Thomas Hancock’s in Britain.'],
            ['1888', 'John Boyd Dunlop patents the pneumatic tyre.'],
            ['1909', 'Fritz Hofmann makes the first synthetic rubber.'],
          ],
        },
      ],
    },
    {
      id: 'ferrule',
      name: 'Ferrule',
      anchor: [-0.15, -1.95, 0.15],
      explode: [0, -0.5, 0],
      make: () =>
        lathe(
          [[0.2, -2.15], [0.215, -2.14], [0.215, -2.08], [0.228, -2.06], [0.215, -2.04], [0.215, -2.0], [0.228, -1.98], [0.215, -1.96],
            [0.215, -1.87], [0.228, -1.85], [0.215, -1.83], [0.215, -1.76], [0.2, -1.75]],
          metal(0xd0d3d8, { roughness: 0.28 }), 64
        ),
      inventions: [
        {
          name: 'Pencil with attached eraser',
          kind: 'design',
          kindNote: 'In 1875 the US Supreme Court ruled that joining a pencil and an eraser was not an invention, because neither did anything new.',
          year: '1858',
          by: 'Hymen Lipman',
          what: 'Lipman patented fixing an eraser to the end of a pencil. The patent sold for $100,000, then was struck down by the US Supreme Court as merely two known things joined.',
          here: 'The crimped metal sleeve is the join: it clamps wood on one side and rubber on the other so writing and correcting live in one tool.',
          story:
            "Anyone who writes with a pencil also needs an eraser, and a separate one is easily lost. Hymen Lipman, a stationer in Philadelphia who had also started the first envelope company in the United States, patented a simple fix in 1858: a pencil with the eraser fixed to one end. In 1862 he sold the patent to Joseph Reckendorfer for $100,000, a fortune at the time. Reckendorfer sued the pencil maker Faber for copying it, but in 1875 the US Supreme Court threw out the patent. Putting two existing things together, the court said, was not an invention if neither did anything new. The idea was free for everyone, and spread everywhere.",
          read: [{ label: "Hymen Lipman", wiki: "Hymen_Lipman" }, { label: "Eraser", wiki: "Eraser" }],
          people: [{ name: 'Hymen Lipman', life: '1817 – 1893', role: 'Jamaican-born stationer in Philadelphia, also credited with America’s first envelope company.', wiki: 'Hymen_Lipman' }],
          uses: ['Most pencils sold in North America', 'Mechanical pencils', 'Digital styluses with an “eraser” end'],
          timeline: [
            ['1858', 'Lipman is granted his US patent on 30 March.'],
            ['1862', 'He sells it to Joseph Reckendorfer for $100,000.'],
            ['1875', 'Reckendorfer v. Faber: the Supreme Court voids the patent.'],
            ['Today', 'The metal ferrule remains the standard way to attach the eraser.'],
          ],
        },
      ],
    },
    {
      id: 'casing',
      name: 'Wood casing',
      anchor: [-0.19, -0.3, 0.11],
      explode: [0, 0, 0],
      make: () =>
        cyl(0.22, 0.22, 3.5, -0.05, mat(0xffffff, { map: pencilPaint(), roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.45, flatShading: true }), 6),
      inventions: [
        {
          name: 'Wood-cased pencil',
          kind: 'invention',
          year: 'c. 1560',
          by: 'Simonio & Lyndiana Bernacotti',
          what: 'An Italian couple hollowed out a juniper stick to hold a graphite rod; soon after, makers switched to two grooved halves glued around the core.',
          here: 'The casing keeps hands clean and stops the brittle core snapping. The hexagonal shape came later — it stops the pencil rolling off the desk.',
          story:
            "In the 1500s a deposit of unusually pure graphite was found at Borrowdale in the north of England. It was solid enough to be sawn into sticks, and people began writing and drawing with it. But graphite is soft and brittle: it snapped easily and blackened the hands of anyone who held it. Around 1560 an Italian couple, Simonio and Lyndiana Bernacotti, made what are probably the first designs for a wooden holder, hollowing out a stick of juniper wood and setting the graphite inside. Later makers improved the idea by cutting a groove into two strips of wood and gluing them together around the rod, which is still how pencils are made.",
          read: [{ label: "Pencil: wood encasement", wiki: "Pencil#Wood_encasement" }],
          people: [{ name: 'Simonio & Lyndiana Bernacotti', life: '16th century', role: 'Italian couple credited with the first carpentry pencils. Little else is documented.', wiki: null }],
          uses: ['Coloured pencils', 'Carpenter’s pencils', 'Eyeliner and lip pencils', 'Charcoal pencils'],
          timeline: [
            ['c. 1560', 'The first wood-cased graphite sticks are made in Italy.'],
            ['1662', 'German makers learn to reconstitute graphite powder, so offcuts can be used.'],
            ['1812', 'William Munroe makes the first American wood pencils in Concord, Massachusetts.'],
            ['19th c.', 'Red cedar becomes the standard: it sharpens without splintering.'],
          ],
        },
      ],
    },
    {
      id: 'point',
      name: 'Sharpened point',
      anchor: [-0.1, 2.0, 0.1],
      explode: [0, 0.7, 0],
      make: () => cyl(0.07, 0.205, 0.6, 2.0, mat(0xffffff, { map: wood(), roughness: 0.75 }), 48, true),
      inventions: [
        {
          name: 'Pencil sharpener',
          kind: 'tool',
          kindNote: 'It shapes the point, but it is a separate object, not part of the pencil.',
          year: '1828',
          by: 'Bernard Lassimonne',
          what: 'The first patented sharpener replaced whittling with a knife. Thierry des Estivaux’s 1847 version added the cone-and-blade form still used today.',
          here: 'A fixed blade angle cuts the same clean cone every time, exposing just enough core to write without snapping it.',
          story:
            "For most of the pencil’s history, the only way to sharpen one was to whittle it with a knife, slowly, unevenly and often breaking the point. In 1828 Bernard Lassimonne, a mathematician from Limoges in France, applied for the world’s first patent on a device to do the job. In 1847 Thierry des Estivaux designed the hand-held sharpener in its modern form: a cone-shaped hole with a fixed blade, which shaves the wood to the same angle every time the pencil is turned. Walter Kittredge Foster began making sharpeners in the United States in 1855, and the little cone has hardly changed since.",
          read: [{ label: "Pencil sharpener", wiki: "Pencil_sharpener" }],
          people: [{ name: 'Bernard Lassimonne', life: 'Active 1828', role: 'French mathematician from Limoges who took out the first sharpener patent.', wiki: null }],
          uses: ['Pocket sharpeners', 'Classroom crank sharpeners', 'Electric sharpeners', 'Cosmetic-pencil sharpeners'],
          timeline: [
            ['Before 1828', 'Pencils are whittled to a point with a penknife.'],
            ['1828', 'Lassimonne patents the first sharpening device in France.'],
            ['1847', 'Thierry des Estivaux invents the conical hand sharpener.'],
            ['1855', 'Walter K. Foster of Maine patents the first American sharpener and founds a company to make it.'],
            ['1897', 'John Lee Love patents the hand-cranked, portable “Love Sharpener”.'],
          ],
        },
      ],
    },
    {
      id: 'core',
      name: 'Graphite core',
      anchor: [0, 2.42, 0.03],
      explode: [0, 0, 0.9],
      make: () => {
        const g = () => metal(0x34353a, { metalness: 0.7, roughness: 0.32 });
        return group(cyl(0.07, 0.07, 4.1, 0.25, g(), 32), cyl(0.008, 0.07, 0.2, 2.4, g(), 32));
      },
      inventions: [
        {
          name: 'Conté process',
          kind: 'process',
          year: '1795',
          by: 'Nicolas-Jacques Conté',
          what: 'Cut off from English graphite by war, Conté mixed powdered graphite with clay and fired it in a kiln. More clay gives a harder, lighter line.',
          here: 'This is the “lead” — it contains no lead at all. The clay ratio is what the H and B grades stamped on a pencil measure.',
          story:
            "In the 1790s Britain and France were at war, and the best pencil graphite in the world came from England. When the British blockade cut off supplies, France had no good pencils for its schools, offices and army. Lazare Carnot, in charge of the war effort, asked Nicolas-Jacques Conté, an inventive painter and army officer, to find an answer. Conté ground poor-quality graphite into powder, mixed it with clay and water, pressed it into rods and fired them in a kiln. The result wrote smoothly. Even better, changing the amount of clay changed how hard or soft the line was, which is how pencils are still graded today. He patented it in 1795.",
          read: [{ label: "Nicolas-Jacques Conté", wiki: "Nicolas-Jacques_Conté" }, { label: "Pencil", wiki: "Pencil" }],
          people: [{ name: 'Nicolas-Jacques Conté', life: '1755 – 1805', role: 'French painter, army officer and military balloonist. Reportedly solved the pencil problem in days.', wiki: 'Nicolas-Jacques_Conté' }],
          uses: ['Every modern pencil lead', 'Conté crayons', 'Mechanical-pencil leads', 'Artists’ graphite sticks'],
          timeline: [
            ['c. 1565', 'Borrowdale graphite is sawn into sticks and used pure.'],
            ['1790', 'Joseph Hardtmuth of Vienna is credited with an earlier graphite-and-clay method.'],
            ['1795', 'Conté patents fired graphite-and-clay leads in France.'],
            ['20th c.', 'The 9H–9B hardness scale becomes the common grading.'],
            ['1915', 'Tokuji Hayakawa’s “Ever-Ready Sharp” mechanical pencil later gives the Sharp company its name.'],
          ],
        },
        {
          name: "Graphite",
          kind: "discovery",
          kindNote: "Graphite is a natural mineral, so it was found rather than invented.",
          year: "c. 1565",
          by: "Unknown finders at Borrowdale, England",
          what: "A soft, black, natural form of carbon. It is made of layers that slide easily over each other, so it leaves a grey trail on paper.",
          here: "The core is graphite mixed with clay. Every line the pencil draws is a trail of tiny graphite flakes left on the paper.",
          story: "Sometime before 1565, and perhaps as early as 1500, a large deposit of a soft black mineral was found near the hamlet of Seathwaite in Borrowdale, in the north of England. It was unusually pure and solid, and local people found it handy for marking their sheep. Nobody knew what it was. It looked like lead and left a grey line, so it was called black lead or plumbago, which is why a pencil’s core is still called its lead, although it contains none. It became so valuable for lining the moulds used to cast cannonballs that the Crown took over the mines and had them guarded. In 1778 the chemist Carl Wilhelm Scheele showed that it was a different mineral from the lookalikes it was confused with, and in 1789 Abraham Gottlob Werner named it graphite, from the Greek word meaning to write. It is a form of carbon.",
          read: [
            { label: "Graphite", wiki: "Graphite" },
            { label: "Pencil", wiki: "Pencil" },
          ],
          people: [
            { name: "Carl Wilhelm Scheele", life: "1742 – 1786", role: "German-Swedish chemist who showed graphite was a distinct mineral, and who also discovered oxygen independently.", wiki: "Carl_Wilhelm_Scheele" },
            { name: "Abraham Gottlob Werner", life: "1749 – 1817", role: "German geologist who gave graphite its name in 1789.", wiki: "Abraham_Gottlob_Werner" },
          ],
          uses: ["Lubricants for locks and machines", "Lithium-ion battery electrodes", "Steelmaking", "Brake linings", "Electric motor brushes"],
          timeline: [
            ["c. 1565", "A deposit of pure graphite is found in Borrowdale, Cumbria."],
            ["16th c.", "Borrowdale graphite lines the moulds for English cannonballs."],
            ["1778", "Carl Wilhelm Scheele shows it is a distinct mineral."],
            ["1789", "Abraham Gottlob Werner names it graphite."],
          ],
        },
      ],
    },
  ],
};
