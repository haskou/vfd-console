export const DEMO_TOGGLE_NAMES = [
  'repeat',
  'random',
  'program',
  'bbe',
  'bass',
  'groove',
  'surround',
  'stereo',
  'rds',
  'dolby',
  'cro2',
] as const;

export type DemoToggleName = (typeof DEMO_TOGGLE_NAMES)[number];
