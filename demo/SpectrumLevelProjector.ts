export class SpectrumLevelProjector {
  public constructor(
    private readonly columns: number,
    private readonly segments: number,
  ) {}

  public project(
    frequencies: Uint8Array<ArrayBuffer>,
    sampleRate: number,
  ): readonly number[] {
    const nyquist = sampleRate / 2;
    const minimumFrequency = 45;
    const maximumFrequency = Math.min(18_000, nyquist);

    return Array.from({ length: this.columns }, (_, column) => {
      const startRatio = column / this.columns;
      const endRatio = (column + 1) / this.columns;
      const startFrequency =
        minimumFrequency * (maximumFrequency / minimumFrequency) ** startRatio;
      const endFrequency =
        minimumFrequency * (maximumFrequency / minimumFrequency) ** endRatio;
      const startBin = Math.max(
        1,
        Math.floor((startFrequency / nyquist) * frequencies.length),
      );
      const endBin = Math.max(
        startBin + 1,
        Math.ceil((endFrequency / nyquist) * frequencies.length),
      );
      let energy = 0;

      for (
        let bin = startBin;
        bin < Math.min(endBin, frequencies.length);
        bin += 1
      ) {
        energy = Math.max(energy, frequencies[bin] ?? 0);
      }

      const normalizedEnergy = energy / 255;

      return Math.round(normalizedEnergy ** 0.72 * this.segments);
    });
  }
}
