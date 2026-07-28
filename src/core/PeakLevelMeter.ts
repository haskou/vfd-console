import type { PeakLevelMeterOptions } from './PeakLevelMeterOptions';
import type { VfdColor } from './VfdColor';

import { MeterBar } from './MeterBar';

export class PeakLevelMeter {
  private readonly clippingFrom: number;
  private readonly leftBar: MeterBar;
  private readonly leftElement: HTMLElement;
  private readonly maximum: number;
  private readonly rightBar: MeterBar;
  private readonly rightElement: HTMLElement;
  private readonly warningFrom: number;

  public constructor(
    public readonly element: HTMLElement,
    options: PeakLevelMeterOptions,
  ) {
    this.validateOptions(options);
    this.maximum = options.segments;
    this.warningFrom = options.warningFrom ?? Math.ceil(options.segments * 0.7);
    this.clippingFrom =
      options.clippingFrom ?? Math.ceil(options.segments * 0.88);

    this.element.classList.add('vfd-peak-meter');
    this.element.style.setProperty(
      '--vfd-meter-segments',
      String(options.segments),
    );
    this.element.setAttribute('role', 'group');
    this.setAccessibleLabel(options.ariaLabel ?? 'Stereo peak level');

    if (options.labels !== undefined) {
      this.element.append(this.createScale(options.labels));
    }

    this.leftElement = this.createChannel('L', options.segments);
    this.leftBar = new MeterBar(this.leftElement, options.segments, (index) =>
      this.colorFor(index),
    );
    this.rightElement = this.createChannel('R', options.segments);
    this.rightBar = new MeterBar(this.rightElement, options.segments, (index) =>
      this.colorFor(index),
    );
    this.element.append(this.leftElement, this.rightElement);
    this.renderChannel(this.leftElement, 0, 'Left');
    this.renderChannel(this.rightElement, 0, 'Right');
  }

  private colorFor(index: number): VfdColor {
    if (index >= this.clippingFrom) {
      return 'red';
    }

    return index >= this.warningFrom ? 'yellow' : 'primary';
  }

  private validateOptions(options: PeakLevelMeterOptions): void {
    if (!Number.isInteger(options.segments) || options.segments <= 0) {
      throw new RangeError(
        'PeakLevelMeter segments must be a positive integer.',
      );
    }
    this.validateZones(options);
    this.validateLabels(options);
  }

  private validateZones(options: PeakLevelMeterOptions): void {
    const warningFrom =
      options.warningFrom ?? Math.ceil(options.segments * 0.7);
    const clippingFrom =
      options.clippingFrom ?? Math.ceil(options.segments * 0.88);

    if (
      warningFrom < 0 ||
      clippingFrom <= warningFrom ||
      clippingFrom > options.segments
    ) {
      throw new RangeError(
        'PeakLevelMeter zones are outside the segment range.',
      );
    }
  }

  private validateLabels(options: PeakLevelMeterOptions): void {
    if (
      options.labels !== undefined &&
      options.labels.length !== options.segments
    ) {
      throw new RangeError(
        'PeakLevelMeter labels must match the number of segments.',
      );
    }
  }

  private createScale(labels: readonly string[]): HTMLElement {
    const scale = document.createElement('div');
    scale.className = 'vfd-peak-meter__scale';
    const title = document.createElement('span');
    title.textContent = 'dB';
    scale.append(title);

    labels.forEach((label) => {
      const item = document.createElement('span');
      item.textContent = label;
      scale.append(item);
    });

    return scale;
  }

  private createChannel(label: string, maximum: number): HTMLElement {
    const channel = document.createElement('div');
    channel.className = 'vfd-peak-meter__channel';
    channel.dataset.channel = label.toLowerCase();
    channel.setAttribute('role', 'meter');
    channel.setAttribute('aria-valuemin', '0');
    channel.setAttribute('aria-valuemax', String(maximum));
    const channelLabel = document.createElement('span');
    channelLabel.className = 'vfd-peak-meter__channel-label';
    channelLabel.textContent = label;
    channel.append(channelLabel);

    return channel;
  }

  private renderChannel(
    channel: HTMLElement,
    value: number,
    label: string,
  ): void {
    channel.setAttribute('aria-valuenow', String(value));
    channel.setAttribute(
      'aria-valuetext',
      `${label} channel ${value} of ${this.maximum}`,
    );
  }

  public clear(): void {
    this.leftBar.clear();
    this.rightBar.clear();
    this.renderChannel(this.leftElement, 0, 'Left');
    this.renderChannel(this.rightElement, 0, 'Right');
  }

  public setAccessibleLabel(label: string): void {
    this.element.setAttribute('aria-label', label);
  }

  public setLevels(left: number, right: number): void {
    const boundedLeft = Math.min(
      this.leftBar.length,
      Math.max(0, Math.round(left)),
    );
    const boundedRight = Math.min(
      this.rightBar.length,
      Math.max(0, Math.round(right)),
    );
    this.leftBar.setValue(boundedLeft);
    this.rightBar.setValue(boundedRight);
    this.renderChannel(this.leftElement, boundedLeft, 'Left');
    this.renderChannel(this.rightElement, boundedRight, 'Right');
  }

  public test(): void {
    this.setLevels(this.leftBar.length, this.rightBar.length);
  }
}
