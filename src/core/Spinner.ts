import type { Disposable } from './Disposable';
import type { SegmentCell } from './SegmentCell';
import type { SpinnerOptions } from './SpinnerOptions';
import type { SpinnerState } from './SpinnerState';

const FRAMES = ['|', '/', '-', '\\'] as const;

export class Spinner implements Disposable {
  private readonly interval: number;
  private frame = 0;
  private state: SpinnerState = 'stopped';
  private timer: ReturnType<typeof setInterval> | undefined;

  public constructor(
    private readonly cell: SegmentCell,
    options: SpinnerOptions = {},
  ) {
    this.interval = options.interval ?? 180;

    if (this.interval < 150 || this.interval > 250) {
      throw new RangeError('Spinner interval must be between 150 and 250 ms.');
    }
    this.cell.setColor(options.color ?? 'red');
    this.cell.clear();
  }

  private renderFrame(): void {
    this.cell.setCharacter(FRAMES[this.frame] ?? '|');
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  public start(): void {
    this.setState('playing');
  }

  public pause(): void {
    this.setState('paused');
  }

  public stop(): void {
    this.setState('stopped');
  }

  public setState(state: SpinnerState): void {
    this.clearTimer();
    this.state = state;

    if (state === 'paused') {
      this.cell.setColor('yellow');
      this.cell.setCharacter('|');

      return;
    }

    if (state === 'stopped') {
      this.cell.clear();
      this.frame = 0;

      return;
    }

    this.cell.setColor(state === 'loading' ? 'yellow' : 'red');
    this.renderFrame();
    const delay = state === 'loading' ? this.interval * 2 : this.interval;
    this.timer = setInterval(() => this.step(), delay);
  }

  public step(): void {
    if (this.state !== 'playing' && this.state !== 'loading') {
      return;
    }
    this.frame = (this.frame + 1) % FRAMES.length;
    this.renderFrame();
  }

  public destroy(): void {
    this.clearTimer();
    this.cell.clear();
  }
}
