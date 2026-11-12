// Not everything that made an object possible is strictly an invention. Every entry says
// which kind it is; the panel shows the label and the read-aloud transcript says it.
export const KINDS = {
  invention: {
    label: 'Invention',
    speech: 'It is an invention: a new device or mechanism.',
  },
  process: {
    label: 'Process',
    speech: 'Strictly, it is a process, a new way of making something, rather than a thing in itself.',
  },
  material: {
    label: 'Material',
    speech: 'Strictly, it is a material rather than a device.',
  },
  discovery: {
    label: 'Discovery',
    speech: 'Strictly, it is a discovery: something that was found, not invented.',
  },
  standard: {
    label: 'Standard',
    speech: 'Strictly, it is a standard: an agreement on how things should fit or work together.',
  },
  technique: {
    label: 'Technique',
    speech: 'Strictly, it is a technique, a way of using other inventions, rather than a single device.',
  },
  design: {
    label: 'Design',
    speech: 'Strictly, it is a design: a new arrangement of parts that already existed.',
  },
  tool: {
    label: 'Tool',
    speech: 'Strictly, it is a tool used to make or use the object, not a part of the object itself.',
  },
};
