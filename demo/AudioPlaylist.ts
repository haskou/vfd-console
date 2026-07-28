import type { AudioTrack } from './AudioTrack';

export class AudioPlaylist {
  private selectedIndex = -1;
  private tracks: AudioTrack[] = [];

  public add(newTracks: readonly AudioTrack[]): void {
    if (newTracks.length === 0) {
      return;
    }

    const wasEmpty = this.tracks.length === 0;
    this.tracks.push(...newTracks);

    if (wasEmpty) {
      this.selectedIndex = 0;
    }
  }

  public clear(): void {
    this.tracks.forEach((track) => track.release());
    this.tracks = [];
    this.selectedIndex = -1;
  }

  public getSelected(): AudioTrack | undefined {
    return this.tracks[this.selectedIndex];
  }

  public getSelectedNumber(): number {
    return this.selectedIndex + 1;
  }

  public getTracks(): readonly AudioTrack[] {
    return [...this.tracks];
  }

  public remove(id: string): AudioTrack | undefined {
    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      return undefined;
    }

    const [removed] = this.tracks.splice(index, 1);

    if (this.tracks.length === 0) {
      this.selectedIndex = -1;
    } else if (index < this.selectedIndex) {
      this.selectedIndex -= 1;
    } else if (index === this.selectedIndex) {
      this.selectedIndex = Math.min(index, this.tracks.length - 1);
    }

    return removed;
  }

  public select(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1 || index === this.selectedIndex) {
      return false;
    }

    this.selectedIndex = index;

    return true;
  }

  public selectNext(random: boolean, wrap = true): AudioTrack | undefined {
    if (this.tracks.length === 0) {
      return undefined;
    }

    if (random && this.tracks.length > 1) {
      const offset = 1 + Math.floor(Math.random() * (this.tracks.length - 1));
      this.selectedIndex = (this.selectedIndex + offset) % this.tracks.length;

      return this.getSelected();
    }

    const nextIndex = this.selectedIndex + 1;

    if (!wrap && nextIndex >= this.tracks.length) {
      return undefined;
    }

    this.selectedIndex = nextIndex % this.tracks.length;

    return this.getSelected();
  }

  public selectPrevious(): AudioTrack | undefined {
    if (this.tracks.length === 0) {
      return undefined;
    }

    this.selectedIndex =
      (this.selectedIndex - 1 + this.tracks.length) % this.tracks.length;

    return this.getSelected();
  }
}
