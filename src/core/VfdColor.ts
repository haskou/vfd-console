export const VFD_COLORS = ['primary', 'green', 'yellow', 'red'] as const;

export type VfdColor = (typeof VFD_COLORS)[number];

export function isVfdColor(value: string): value is VfdColor {
  return VFD_COLORS.some((color) => color === value);
}
