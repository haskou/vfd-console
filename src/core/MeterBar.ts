import type { VfdColor } from './VfdColor';

export class MeterBar {
  private readonly segments: readonly HTMLElement[];
  private value = 0;

  public constructor(
    public readonly element: HTMLElement,
    segments: number,
    colorFor: (index: number) => VfdColor,
  ) {
    this.element.classList.add('vfd-meter-bar');
    this.element.style.setProperty('--vfd-meter-segments', String(segments));
    this.segments = Array.from({ length: segments }, (_, index) => {
      const segment = document.createElement('i');
      segment.className = 'vfd-meter-segment';
      segment.dataset.active = 'false';
      segment.dataset.color = colorFor(index);
      segment.style.setProperty('--vfd-meter-delay', '0');
      this.element.append(segment);

      return segment;
    });
  }

  public get length(): number {
    return this.segments.length;
  }

  public get currentValue(): number {
    return this.value;
  }

  private boundValue(value: number): number {
    return Math.min(this.segments.length, Math.max(0, Math.round(value)));
  }

  public clear(): void {
    this.setValue(0);
  }

  public setValue(value: number): void {
    const boundedValue = this.boundValue(value);

    if (boundedValue === this.value) {
      return;
    }

    const previousValue = this.value;
    const filling = boundedValue > previousValue;
    this.segments.forEach((segment, index) => {
      const active = index < boundedValue;

      if (segment.dataset.active === String(active)) {
        return;
      }

      const delay = filling ? index - previousValue : previousValue - index - 1;
      segment.style.setProperty('--vfd-meter-delay', String(delay));
      segment.setAttribute('data-active', String(active));
    });
    this.value = boundedValue;
  }

  public test(): void {
    this.setValue(this.segments.length);
  }
}
