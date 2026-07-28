import { describe, expect, it } from 'vitest';

import { SegmentDisplay } from '../src/core/SegmentDisplay';

describe('SegmentDisplay', () => {
  it('keeps every cell and segment mounted while changing text', () => {
    const element = document.createElement('div');
    const display = new SegmentDisplay(element, { cells: 4 });
    const initialCells = [...element.querySelectorAll('.vfd-character')];
    const initialSegments = [...element.querySelectorAll('.vfd-segment')];

    display.setText('ABCD');
    display.setText('WXYZ');
    display.clear();

    expect([...element.querySelectorAll('.vfd-character')]).toEqual(
      initialCells,
    );
    expect([...element.querySelectorAll('.vfd-segment')]).toEqual(
      initialSegments,
    );
    expect(initialSegments).toHaveLength(56);
  });

  it('bounds brightness without changing geometry', () => {
    const element = document.createElement('div');
    const display = new SegmentDisplay(element, { cells: 1 });

    display.setBrightness(5);

    expect(element.style.getPropertyValue('--vfd-brightness')).toBe('1');
    expect(display.length).toBe(1);
  });
});
