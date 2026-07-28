import type { VfdColor } from './VfdColor';

export interface IndicatorOptions {
  readonly active?: boolean;
  readonly activeLabel?: string;
  readonly color?: VfdColor;
  readonly inactiveLabel?: string;
}
