export interface PeakLevelMeterOptions {
  readonly ariaLabel?: string;
  readonly clippingFrom?: number;
  readonly labels?: readonly string[];
  readonly segments: number;
  readonly warningFrom?: number;
}
