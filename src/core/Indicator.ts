import type { IndicatorOptions } from './IndicatorOptions';

export class Indicator {
  private readonly activeLabel: string;
  private readonly inactiveLabel: string;

  public constructor(
    public readonly element: HTMLElement,
    options: IndicatorOptions = {},
  ) {
    this.activeLabel =
      options.activeLabel ?? `${element.textContent ?? 'Indicator'} enabled`;
    this.inactiveLabel =
      options.inactiveLabel ?? `${element.textContent ?? 'Indicator'} disabled`;
    this.element.classList.add('vfd-indicator');
    this.element.dataset.color = options.color ?? 'primary';
    this.setActive(options.active ?? false);
  }

  public setActive(active: boolean): void {
    this.element.dataset.active = String(active);
    this.element.setAttribute(
      'aria-label',
      active ? this.activeLabel : this.inactiveLabel,
    );
  }

  public isActive(): boolean {
    return this.element.dataset.active === 'true';
  }

  public toggle(): void {
    this.setActive(!this.isActive());
  }
}
