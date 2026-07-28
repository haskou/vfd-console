import type { VolumeMeterValueText } from './VolumeMeterValueText';

export interface VolumeMeterOptions {
  readonly ariaLabel?: string;
  readonly clippingFrom?: number;
  readonly segments: number;
  readonly valueText?: VolumeMeterValueText;
  readonly warningFrom?: number;
}
