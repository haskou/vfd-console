import type { VolumeMeterOptions } from './VolumeMeterOptions';
import type { VolumeMeterValueText } from './VolumeMeterValueText';

import { MeterBar } from './MeterBar';

const DEFAULT_VALUE_TEXT: VolumeMeterValueText = (value, maximum, muted) =>
  muted ? 'Muted' : `Volume ${value} of ${maximum}`;

export class VolumeMeter {
  private readonly clippingFrom: number;
  private readonly meterBar: MeterBar;
  private readonly warningFrom: number;
  private muted = false;
  private value = 0;
  private valueBeforeMute = 0;
  private readonly valueText: VolumeMeterValueText;

  public constructor(
    public readonly element: HTMLElement,
    options: VolumeMeterOptions,
  ) {
    this.validateOptions(options);
    this.warningFrom = options.warningFrom ?? Math.ceil(options.segments * 0.7);
    this.clippingFrom =
      options.clippingFrom ?? Math.ceil(options.segments * 0.88);
    this.valueText = options.valueText ?? DEFAULT_VALUE_TEXT;

    this.element.classList.add('vfd-volume-meter');
    this.element.setAttribute('role', 'meter');
    this.setAccessibleLabel(options.ariaLabel ?? 'Volume');
    this.element.setAttribute('aria-valuemin', '0');
    this.element.setAttribute('aria-valuemax', String(options.segments));
    this.meterBar = new MeterBar(this.element, options.segments, (index) =>
      this.colorFor(index),
    );
    this.render();
  }

  private validateOptions(options: VolumeMeterOptions): void {
    if (!Number.isInteger(options.segments) || options.segments <= 0) {
      throw new RangeError('VolumeMeter segments must be a positive integer.');
    }
    const warningFrom =
      options.warningFrom ?? Math.ceil(options.segments * 0.7);
    const clippingFrom =
      options.clippingFrom ?? Math.ceil(options.segments * 0.88);

    if (
      warningFrom < 0 ||
      clippingFrom <= warningFrom ||
      clippingFrom > options.segments
    ) {
      throw new RangeError('VolumeMeter zones are outside the segment range.');
    }
  }

  private boundValue(value: number): number {
    return Math.min(this.meterBar.length, Math.max(0, Math.round(value)));
  }

  private colorFor(index: number): 'primary' | 'red' | 'yellow' {
    if (index >= this.clippingFrom) {
      return 'red';
    }

    if (index >= this.warningFrom) {
      return 'yellow';
    }

    return 'primary';
  }

  private render(): void {
    const visibleValue = this.muted ? 0 : this.value;
    this.meterBar.setValue(visibleValue);
    this.element.dataset.muted = String(this.muted);
    this.element.setAttribute('aria-valuenow', String(visibleValue));
    this.element.setAttribute(
      'aria-valuetext',
      this.valueText(visibleValue, this.meterBar.length, this.muted),
    );
  }

  public setAccessibleLabel(label: string): void {
    this.element.setAttribute('aria-label', label);
  }

  public setValue(value: number): void {
    this.value = this.boundValue(value);

    if (this.muted) {
      this.valueBeforeMute = this.value;
    }
    this.render();
  }

  public increment(amount = 1): void {
    this.setValue(this.value + amount);
  }

  public decrement(amount = 1): void {
    this.setValue(this.value - amount);
  }

  public mute(): void {
    if (!this.muted) {
      this.valueBeforeMute = this.value;
      this.muted = true;
      this.render();
    }
  }

  public unmute(): void {
    if (this.muted) {
      this.muted = false;
      this.value = this.valueBeforeMute;
      this.render();
    }
  }

  public clear(): void {
    this.setValue(0);
  }

  public test(): void {
    this.setValue(this.meterBar.length);
  }
}
