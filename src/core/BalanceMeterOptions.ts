import type { VfdColor } from './VfdColor';

export interface BalanceMeterOptions {
  readonly ariaLabel?: string;
  readonly color?: VfdColor;
  readonly segmentsPerSide?: number;
}
