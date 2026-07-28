import type { SpectrumZone } from './SpectrumZone';

export interface SpectrumMeterOptions {
  readonly ariaLabel?: string;
  readonly columns: number;
  readonly labels?: readonly string[];
  readonly segments: number;
  readonly zones?: readonly SpectrumZone[];
}
