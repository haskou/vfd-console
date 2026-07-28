import type { SegmentDisplayOptions } from './SegmentDisplayOptions';

import { CharacterMap } from './CharacterMap';
import { SegmentCell } from './SegmentCell';

export class SegmentDisplay {
  private readonly cells: readonly SegmentCell[];

  public readonly characterMap: CharacterMap;

  public constructor(
    public readonly element: HTMLElement,
    options: SegmentDisplayOptions,
  ) {
    if (!Number.isInteger(options.cells) || options.cells <= 0) {
      throw new RangeError('SegmentDisplay cells must be a positive integer.');
    }

    this.characterMap = new CharacterMap();
    this.element.classList.add('vfd-segment-display');
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', 'off');
    this.element.setAttribute('aria-label', options.ariaLabel ?? 'VFD display');

    this.cells = Array.from({ length: options.cells }, () => {
      const cell = new SegmentCell(this.characterMap);
      cell.setColor(options.color ?? 'primary');
      this.element.append(cell.element);

      return cell;
    });
  }

  public get length(): number {
    return this.cells.length;
  }

  public cell(index: number): SegmentCell {
    const cell = this.cells[index];

    if (cell === undefined) {
      throw new RangeError(`Cell ${index} is outside the display.`);
    }

    return cell;
  }

  public setText(text: string): void {
    const characters = [...text];
    for (let index = 0; index < this.cells.length; index += 1) {
      this.cell(index).setCharacter(characters[index] ?? ' ');
    }
  }

  public setAccessibleLabel(label: string): void {
    this.element.setAttribute('aria-label', label);
  }

  public setBrightness(brightness: number): void {
    const boundedBrightness = Math.min(1, Math.max(0, brightness));
    this.element.style.setProperty(
      '--vfd-brightness',
      String(boundedBrightness),
    );
  }

  public clear(): void {
    this.cells.forEach((cell) => cell.clear());
  }

  public test(): void {
    this.cells.forEach((cell) => cell.test());
  }
}
