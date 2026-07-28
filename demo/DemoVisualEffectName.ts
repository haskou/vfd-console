export const DEMO_VISUAL_EFFECT_NAMES = ['mesh', 'blur'] as const;

export type DemoVisualEffectName = (typeof DEMO_VISUAL_EFFECT_NAMES)[number];
