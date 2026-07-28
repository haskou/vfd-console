import { afterEach, describe, expect, it, vi } from 'vitest';

import { BalanceMeter } from '../src/core/BalanceMeter';
import { Indicator } from '../src/core/Indicator';
import { PeakLevelMeter } from '../src/core/PeakLevelMeter';
import { SegmentCell } from '../src/core/SegmentCell';
import { SpectrumMeter } from '../src/core/SpectrumMeter';
import { Spinner } from '../src/core/Spinner';
import { VolumeMeter } from '../src/core/VolumeMeter';
import { applyPreset } from '../src/presets/Presets';

function activeSegments(element: HTMLElement): readonly string[] {
  return [...element.querySelectorAll<HTMLElement>('[data-active="true"]')].map(
    (segment) => segment.dataset.segment ?? '',
  );
}

describe('VFD components', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('rotates the spinner and cleans its timer', () => {
    vi.useFakeTimers();
    const cell = new SegmentCell();
    const spinner = new Spinner(cell, { interval: 180 });

    spinner.start();
    const firstFrame = activeSegments(cell.element);
    spinner.step();

    expect(activeSegments(cell.element)).not.toEqual(firstFrame);
    expect(vi.getTimerCount()).toBe(1);
    spinner.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('tracks illumination once for the complete character', () => {
    const cell = new SegmentCell();

    expect(cell.element.dataset.illuminated).toBe('false');
    cell.setCharacter('A');
    expect(cell.element.dataset.illuminated).toBe('true');
    cell.clear();
    expect(cell.element.dataset.illuminated).toBe('false');
  });

  it('keeps indicators mounted in active and inactive states', () => {
    const element = document.createElement('span');
    element.textContent = 'REPEAT';
    const indicator = new Indicator(element);
    const parent = document.createElement('div');
    parent.append(element);

    indicator.setActive(true);
    indicator.setActive(false);

    expect(parent.firstElementChild).toBe(element);
    expect(element.dataset.active).toBe('false');
    expect(element.getAttribute('aria-label')).toBe('REPEAT disabled');
  });

  it('bounds volume values and preserves segment nodes', () => {
    const element = document.createElement('div');
    const meter = new VolumeMeter(element, {
      clippingFrom: 14,
      segments: 16,
      warningFrom: 11,
    });
    const segments = [...element.children];

    meter.setValue(100);
    expect(element.getAttribute('aria-valuenow')).toBe('16');
    meter.setValue(-4);

    expect(element.getAttribute('aria-valuenow')).toBe('0');
    expect([...element.children]).toEqual(segments);
  });

  it('animates meter segments in fill and drain order', () => {
    const element = document.createElement('div');
    const meter = new VolumeMeter(element, { segments: 4 });
    const segments = [
      ...element.querySelectorAll<HTMLElement>('.vfd-meter-segment'),
    ];

    meter.setValue(3);
    expect(
      segments.map((segment) =>
        segment.style.getPropertyValue('--vfd-meter-delay'),
      ),
    ).toEqual(['0', '1', '2', '0']);

    meter.setValue(1);
    expect(
      segments.map((segment) =>
        segment.style.getPropertyValue('--vfd-meter-delay'),
      ),
    ).toEqual(['0', '1', '0', '0']);
  });

  it('renders bounded stereo peak channels with semantic zones', () => {
    const element = document.createElement('div');
    const meter = new PeakLevelMeter(element, {
      clippingFrom: 3,
      labels: ['-20', '-10', '0', '+3'],
      segments: 4,
      warningFrom: 2,
    });

    meter.setLevels(2, 20);

    const left = element.querySelector<HTMLElement>('[data-channel="l"]');
    const right = element.querySelector<HTMLElement>('[data-channel="r"]');
    expect(left?.getAttribute('aria-valuenow')).toBe('2');
    expect(right?.getAttribute('aria-valuenow')).toBe('4');
    expect(right?.querySelectorAll('[data-active="true"]')).toHaveLength(4);
    expect(right?.querySelectorAll('[data-color="red"]')).toHaveLength(1);
  });

  it('animates balance away from its permanent center', () => {
    const element = document.createElement('div');
    const meter = new BalanceMeter(element, { segmentsPerSide: 4 });

    meter.setBalance(-0.5);

    expect(
      element.querySelectorAll(
        '.vfd-balance-meter__side--left [data-active="true"]',
      ),
    ).toHaveLength(2);
    expect(
      element
        .querySelector('.vfd-balance-meter__center')
        ?.getAttribute('data-active'),
    ).toBe('false');

    meter.test();
    expect(element.querySelectorAll('[data-active="true"]')).toHaveLength(9);
  });

  it('bounds spectrum levels and keeps its grid mounted', () => {
    const element = document.createElement('div');
    const meter = new SpectrumMeter(element, {
      columns: 2,
      labels: ['63', '16K'],
      segments: 3,
      zones: [{ color: 'red', from: 2, to: 2 }],
    });
    const segments = [...element.querySelectorAll('.vfd-meter-segment')];

    meter.setLevels([20, -2]);

    expect(
      element.querySelector('.vfd-spectrum__column')?.getAttribute('style'),
    ).toContain('--vfd-level: 3');
    expect([...element.querySelectorAll('.vfd-meter-segment')]).toEqual(
      segments,
    );
    expect(element.style.getPropertyValue('--vfd-spectrum-columns')).toBe('2');
    expect(
      [...element.querySelectorAll('.vfd-spectrum-labels span')].map(
        (label) => label.textContent,
      ),
    ).toEqual(['63', '16K']);
    expect(element.firstElementChild?.className).toBe('vfd-spectrum-labels');
    expect(element.lastElementChild?.className).toBe('vfd-spectrum__columns');
  });

  it('validates spectrum labels against its permanent columns', () => {
    const element = document.createElement('div');

    expect(
      () =>
        new SpectrumMeter(element, {
          columns: 2,
          labels: ['63'],
          segments: 3,
        }),
    ).toThrow('Spectrum labels must match the number of columns.');
  });

  it('supports application-owned accessible meter descriptions', () => {
    const spectrumElement = document.createElement('div');
    const spectrum = new SpectrumMeter(spectrumElement, {
      ariaLabel: 'Audio frequencies',
      columns: 1,
      segments: 3,
    });
    const volumeElement = document.createElement('div');
    const volume = new VolumeMeter(volumeElement, {
      ariaLabel: 'Output level',
      segments: 4,
      valueText: (value, maximum, muted) =>
        muted ? 'Silenced' : `${value} of ${maximum} bars`,
    });

    spectrum.setAccessibleLabel('Paused audio frequencies');
    volume.setValue(2);

    expect(spectrumElement.getAttribute('aria-label')).toBe(
      'Paused audio frequencies',
    );
    expect(volumeElement.getAttribute('aria-label')).toBe('Output level');
    expect(volumeElement.getAttribute('aria-valuetext')).toBe('2 of 4 bars');

    volume.mute();
    expect(volumeElement.getAttribute('aria-valuetext')).toBe('Silenced');
  });

  it('changes preset without replacing panel contents', () => {
    const panel = document.createElement('div');
    const content = document.createElement('span');
    panel.append(content);

    applyPreset(panel, 'technics');

    expect(panel.dataset.vfdPreset).toBe('technics');
    expect(panel.firstElementChild).toBe(content);
  });
});
