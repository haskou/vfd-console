import type { Disposable } from './Disposable';
import type { SegmentDisplay } from './SegmentDisplay';
import type { TextScrollerOptions } from './TextScrollerOptions';

export class TextScroller implements Disposable {
  private text: string;
  private readonly interval: number;
  private readonly padding: number;
  private readonly loop: boolean;
  private offset = 0;
  private timer: ReturnType<typeof setInterval> | undefined;

  public constructor(
    private readonly display: SegmentDisplay,
    options: TextScrollerOptions,
  ) {
    this.text = options.text;
    this.interval = options.interval ?? 260;
    this.padding = options.padding ?? 3;
    this.loop = options.loop ?? true;
    this.assertOptions();
    this.render();
  }

  private assertOptions(): void {
    if (this.interval <= 0 || !Number.isFinite(this.interval)) {
      throw new RangeError('TextScroller interval must be positive.');
    }

    if (!Number.isInteger(this.padding) || this.padding < 0) {
      throw new RangeError('TextScroller padding must be a positive integer.');
    }
  }

  private getBuffer(): readonly string[] {
    const padding = ' '.repeat(this.padding);

    return [...`${this.text}${padding}`];
  }

  private render(): void {
    const buffer = this.getBuffer();
    for (let index = 0; index < this.display.length; index += 1) {
      const sourceIndex =
        buffer.length === 0 ? 0 : (this.offset + index) % buffer.length;
      this.display.cell(index).setCharacter(buffer[sourceIndex] ?? ' ');
    }
  }

  public start(): void {
    if (this.timer !== undefined) {
      return;
    }
    this.timer = setInterval(() => this.step(), this.interval);
  }

  public pause(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  public reset(): void {
    this.offset = 0;
    this.render();
  }

  public setText(text: string): void {
    this.text = text;
    this.reset();
  }

  public step(): void {
    const buffer = this.getBuffer();

    if (buffer.length === 0) {
      return;
    }

    const nextOffset = this.offset + 1;
    this.offset = this.loop
      ? nextOffset % buffer.length
      : Math.min(nextOffset, Math.max(0, buffer.length - this.display.length));
    this.render();
  }

  public destroy(): void {
    this.pause();
  }
}
