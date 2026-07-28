import type { SpectrumMeterOptions } from './SpectrumMeterOptions';
import type { SpectrumZone } from './SpectrumZone';
import type { VfdColor } from './VfdColor';

export class SpectrumMeter {
  private readonly columns: readonly HTMLElement[];
  private readonly levels: number[];
  private readonly segmentsPerColumn: number;

  public constructor(
    public readonly element: HTMLElement,
    options: SpectrumMeterOptions,
  ) {
    this.validateOptions(options);
    this.validateZones(options.zones ?? [], options.segments);
    this.levels = Array.from({ length: options.columns }, () => 0);
    this.segmentsPerColumn = options.segments;
    this.element.classList.add('vfd-spectrum');
    this.element.setAttribute('role', 'img');
    this.setAccessibleLabel(options.ariaLabel ?? 'Spectrum analyzer');
    this.element.style.setProperty(
      '--vfd-spectrum-columns',
      String(options.columns),
    );

    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'vfd-spectrum__columns';

    this.columns = Array.from({ length: options.columns }, () => {
      const column = document.createElement('span');
      column.className = 'vfd-spectrum__column';
      column.style.setProperty('--vfd-level', '0');
      Array.from({ length: options.segments }, (_, index) => {
        const segment = document.createElement('i');
        segment.className = 'vfd-meter-segment';
        segment.dataset.color = this.colorFor(index, options.zones ?? []);
        segment.style.setProperty('--vfd-meter-index', String(index));
        column.prepend(segment);

        return segment;
      });
      columnsContainer.append(column);

      return column;
    });

    if (options.labels !== undefined) {
      this.appendLabels(options.labels);
    }

    this.element.append(columnsContainer);
  }

  private validateOptions(options: SpectrumMeterOptions): void {
    if (
      !Number.isInteger(options.columns) ||
      options.columns <= 0 ||
      !Number.isInteger(options.segments) ||
      options.segments <= 0
    ) {
      throw new RangeError('Spectrum dimensions must be positive integers.');
    }

    if (
      options.labels !== undefined &&
      options.labels.length !== options.columns
    ) {
      throw new RangeError('Spectrum labels must match the number of columns.');
    }
  }

  private validateZones(
    zones: readonly SpectrumZone[],
    segments: number,
  ): void {
    for (const zone of zones) {
      if (zone.from < 0 || zone.to < zone.from || zone.to >= segments) {
        throw new RangeError('Spectrum zone is outside the segment range.');
      }
    }
  }

  private colorFor(index: number, zones: readonly SpectrumZone[]): VfdColor {
    return (
      zones.find((zone) => index >= zone.from && index <= zone.to)?.color ??
      'primary'
    );
  }

  private appendLabels(labels: readonly string[]): void {
    const labelsElement = document.createElement('div');
    labelsElement.className = 'vfd-spectrum-labels';
    labels.forEach((label) => {
      const item = document.createElement('span');
      item.textContent = label;
      labelsElement.append(item);
    });
    this.element.append(labelsElement);
  }

  public setLevel(column: number, level: number): void {
    const columnElement = this.columns[column];

    if (columnElement === undefined) {
      throw new RangeError(`Spectrum column ${column} is outside the meter.`);
    }
    const boundedLevel = Math.min(
      this.segmentsPerColumn,
      Math.max(0, Math.round(level)),
    );

    if (this.levels[column] === boundedLevel) {
      return;
    }
    this.levels[column] = boundedLevel;
    columnElement.style.setProperty('--vfd-level', String(boundedLevel));
  }

  public setLevels(levels: readonly number[]): void {
    this.columns.forEach((_, index) =>
      this.setLevel(index, levels[index] ?? 0),
    );
  }

  public setAccessibleLabel(label: string): void {
    this.element.setAttribute('aria-label', label);
  }

  public clear(): void {
    this.setLevels([]);
  }

  public test(): void {
    this.setLevels(this.columns.map(() => this.segmentsPerColumn));
  }
}
