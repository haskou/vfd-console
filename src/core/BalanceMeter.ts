import type { BalanceMeterOptions } from './BalanceMeterOptions';

import { MeterBar } from './MeterBar';

export class BalanceMeter {
  private readonly center: HTMLElement;
  private readonly leftBar: MeterBar;
  private readonly rightBar: MeterBar;

  public constructor(
    public readonly element: HTMLElement,
    options: BalanceMeterOptions = {},
  ) {
    const segmentsPerSide = options.segmentsPerSide ?? 8;

    if (!Number.isInteger(segmentsPerSide) || segmentsPerSide <= 0) {
      throw new RangeError(
        'BalanceMeter segmentsPerSide must be a positive integer.',
      );
    }

    this.element.classList.add('vfd-balance-meter');
    this.element.setAttribute('role', 'meter');
    this.element.setAttribute('aria-valuemin', '-1');
    this.element.setAttribute('aria-valuemax', '1');
    this.setAccessibleLabel(options.ariaLabel ?? 'Stereo balance');

    const leftLabel = document.createElement('span');
    leftLabel.className = 'vfd-balance-meter__label';
    leftLabel.textContent = 'L';
    const leftElement = document.createElement('span');
    leftElement.className =
      'vfd-balance-meter__side vfd-balance-meter__side--left';
    leftElement.setAttribute('aria-hidden', 'true');
    this.leftBar = new MeterBar(
      leftElement,
      segmentsPerSide,
      () => options.color ?? 'primary',
    );

    this.center = document.createElement('i');
    this.center.className = 'vfd-balance-meter__center';
    this.center.dataset.active = 'true';
    this.center.setAttribute('aria-hidden', 'true');

    const rightElement = document.createElement('span');
    rightElement.className =
      'vfd-balance-meter__side vfd-balance-meter__side--right';
    rightElement.setAttribute('aria-hidden', 'true');
    this.rightBar = new MeterBar(
      rightElement,
      segmentsPerSide,
      () => options.color ?? 'primary',
    );
    const rightLabel = document.createElement('span');
    rightLabel.className = 'vfd-balance-meter__label';
    rightLabel.textContent = 'R';

    this.element.append(
      leftLabel,
      leftElement,
      this.center,
      rightElement,
      rightLabel,
    );
    this.setBalance(0);
  }

  private boundBalance(balance: number): number {
    return Math.min(1, Math.max(-1, balance));
  }

  public centerBalance(): void {
    this.setBalance(0);
  }

  public clear(): void {
    this.leftBar.clear();
    this.rightBar.clear();
    this.center.dataset.active = 'false';
    this.element.setAttribute('aria-valuenow', '0');
    this.element.setAttribute('aria-valuetext', 'Balance display off');
  }

  public setAccessibleLabel(label: string): void {
    this.element.setAttribute('aria-label', label);
  }

  public setBalance(balance: number): void {
    const boundedBalance = this.boundBalance(balance);
    this.leftBar.setValue(
      boundedBalance < 0 ? Math.abs(boundedBalance) * this.leftBar.length : 0,
    );
    this.rightBar.setValue(
      boundedBalance > 0 ? boundedBalance * this.rightBar.length : 0,
    );
    this.center.dataset.active = String(boundedBalance === 0);
    this.element.setAttribute('aria-valuenow', String(boundedBalance));
    this.element.setAttribute(
      'aria-valuetext',
      boundedBalance === 0
        ? 'Balance centered'
        : `Balance ${Math.round(Math.abs(boundedBalance) * 100)} percent ${boundedBalance < 0 ? 'left' : 'right'}`,
    );
  }

  public test(): void {
    this.leftBar.test();
    this.rightBar.test();
    this.center.dataset.active = 'true';
  }
}
