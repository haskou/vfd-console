export const SEGMENTS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g1',
  'g2',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
] as const;

export type SegmentName = (typeof SEGMENTS)[number];
