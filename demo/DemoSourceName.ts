export const DEMO_SOURCE_NAMES = ['cd', 'tape', 'tuner', 'aux'] as const;

export type DemoSourceName = (typeof DEMO_SOURCE_NAMES)[number];
