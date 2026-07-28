export const VFD_PRESETS = ['aiwa', 'sony', 'technics'] as const;

export type VfdPreset = (typeof VFD_PRESETS)[number];

export function applyPreset(element: HTMLElement, preset: VfdPreset): void {
  element.setAttribute('data-vfd-preset', preset);
}
