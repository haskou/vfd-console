import type { VfdColor } from './VfdColor';

export interface SpectrumZone {
  readonly color: VfdColor;
  readonly from: number;
  readonly to: number;
}
