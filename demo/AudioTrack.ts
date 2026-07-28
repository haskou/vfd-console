export class AudioTrack {
  public static fromFile(file: File): AudioTrack {
    return new AudioTrack(crypto.randomUUID(), file, URL.createObjectURL(file));
  }

  public constructor(
    public readonly id: string,
    public readonly file: File,
    public readonly url: string,
  ) {}

  public getTitle(): string {
    return this.file.name.replace(/\.[^.]+$/, '') || this.file.name;
  }

  public release(): void {
    URL.revokeObjectURL(this.url);
  }
}
