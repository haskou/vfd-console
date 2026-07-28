import type { VfdColor } from './VfdColor';

export interface SegmentDisplayOptions {
  readonly ariaLabel?: string;
  readonly cells: number;
  readonly characterSet?: '14-segment';
  readonly color?: VfdColor;
}
