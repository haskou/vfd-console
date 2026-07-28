import { afterEach, describe, expect, it, vi } from 'vitest';

import { SegmentDisplay } from '../src/core/SegmentDisplay';
import { TextScroller } from '../src/core/TextScroller';

function activePattern(element: HTMLElement): string {
  return [...element.querySelectorAll<HTMLElement>('.vfd-segment')]
    .map((segment) => segment.dataset.active)
    .join('');
}

describe('TextScroller', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances exactly one full character and wraps', () => {
    const element = document.createElement('div');
    const display = new SegmentDisplay(element, { cells: 2 });
    const scroller = new TextScroller(display, {
      loop: true,
      padding: 0,
      text: 'ABC',
    });
    const initial = activePattern(element);

    scroller.step();
    const afterOneStep = activePattern(element);
    scroller.step();
    scroller.step();

    expect(afterOneStep).not.toBe(initial);
    expect(activePattern(element)).toBe(initial);
  });

  it('keeps cells mounted while scrolling', () => {
    const element = document.createElement('div');
    const display = new SegmentDisplay(element, { cells: 3 });
    const scroller = new TextScroller(display, { text: 'ABCDE' });
    const initialCells = [...element.querySelectorAll('.vfd-character')];

    scroller.step();
    scroller.step();

    expect([...element.querySelectorAll('.vfd-character')]).toEqual(
      initialCells,
    );
  });

  it('cleans its timer on destroy', () => {
    vi.useFakeTimers();
    const display = new SegmentDisplay(document.createElement('div'), {
      cells: 3,
    });
    const scroller = new TextScroller(display, { text: 'ABC' });

    scroller.start();
    expect(vi.getTimerCount()).toBe(1);
    scroller.destroy();

    expect(vi.getTimerCount()).toBe(0);
  });
});
