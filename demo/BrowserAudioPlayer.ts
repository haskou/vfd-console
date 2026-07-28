import type { AudioTrack } from './AudioTrack';

import { BrowserAudioEffects } from './BrowserAudioEffects';
import { SpectrumLevelProjector } from './SpectrumLevelProjector';

const PLAYBACK_FADE_MILLISECONDS = 50;
const PLAYBACK_FADE_SECONDS = PLAYBACK_FADE_MILLISECONDS / 1_000;

export class BrowserAudioPlayer {
  private analyser: AnalyserNode | undefined;
  private audioContext: AudioContext | undefined;
  private balance = 0;
  private bassBoostEnabled = false;
  private bbeEnabled = false;
  private effects: BrowserAudioEffects | undefined;
  private fadeTimer: ReturnType<typeof setTimeout> | undefined;
  private frequencies: Uint8Array<ArrayBuffer> | undefined;
  private grooveEnabled = false;
  private leftChannel: Float32Array<ArrayBuffer> | undefined;
  private leftChannelAnalyser: AnalyserNode | undefined;
  private readonly projector: SpectrumLevelProjector;
  private rightChannel: Float32Array<ArrayBuffer> | undefined;
  private rightChannelAnalyser: AnalyserNode | undefined;
  private source: MediaElementAudioSourceNode | undefined;
  private surroundEnabled = false;

  public constructor(
    private readonly audio: HTMLAudioElement,
    spectrumColumns: number,
    spectrumSegments: number,
  ) {
    this.projector = new SpectrumLevelProjector(
      spectrumColumns,
      spectrumSegments,
    );
  }

  private applyEffectState(): void {
    this.effects?.setBalance(this.balance);
    this.effects?.setBassBoostEnabled(this.bassBoostEnabled);
    this.effects?.setBbeEnabled(this.bbeEnabled);
    this.effects?.setGrooveEnabled(this.grooveEnabled);
    this.effects?.setSurroundEnabled(this.surroundEnabled);
  }

  private cancelPendingPause(): void {
    if (this.fadeTimer !== undefined) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = undefined;
    }
  }

  private connectAudioGraph(): void {
    if (this.audioContext !== undefined) {
      return;
    }

    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -18;
    analyser.smoothingTimeConstant = 0.78;

    this.source = context.createMediaElementSource(this.audio);
    const splitter = context.createChannelSplitter(2);
    const leftChannelAnalyser = context.createAnalyser();
    const rightChannelAnalyser = context.createAnalyser();
    const silentOutput = context.createGain();
    const effects = new BrowserAudioEffects(
      context,
      analyser,
      context.destination,
    );
    leftChannelAnalyser.fftSize = 256;
    rightChannelAnalyser.fftSize = 256;
    silentOutput.gain.value = 0;

    this.source.connect(analyser);
    this.source.connect(splitter);
    splitter.connect(leftChannelAnalyser, 0);
    splitter.connect(rightChannelAnalyser, 1);
    leftChannelAnalyser.connect(silentOutput);
    rightChannelAnalyser.connect(silentOutput);
    silentOutput.connect(context.destination);
    this.audioContext = context;
    this.analyser = analyser;
    this.effects = effects;
    this.frequencies = new Uint8Array(analyser.frequencyBinCount);
    this.leftChannelAnalyser = leftChannelAnalyser;
    this.leftChannel = new Float32Array(leftChannelAnalyser.fftSize);
    this.rightChannelAnalyser = rightChannelAnalyser;
    this.rightChannel = new Float32Array(rightChannelAnalyser.fftSize);
    this.applyEffectState();
  }

  private projectPeak(channel: Float32Array, maximum: number): number {
    let peak = 0;

    for (const sample of channel) {
      peak = Math.max(peak, Math.abs(sample));
    }

    return Math.round(Math.min(1, Math.pow(peak, 0.55)) * maximum);
  }

  private stopImmediately(): void {
    this.cancelPendingPause();
    this.effects?.silence();
    this.audio.pause();
  }

  public clear(): void {
    this.stopImmediately();
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  public destroy(): void {
    this.clear();
    void this.audioContext?.close();
  }

  public getCurrentTime(): number {
    return Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0;
  }

  public getDuration(): number {
    return Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  public getSpectrumLevels(): readonly number[] {
    if (
      this.analyser === undefined ||
      this.audioContext === undefined ||
      this.frequencies === undefined ||
      this.audio.paused
    ) {
      return [];
    }

    this.analyser.getByteFrequencyData(this.frequencies);

    return this.projector.project(
      this.frequencies,
      this.audioContext.sampleRate,
    );
  }

  public getStereoPeakLevels(maximum: number): {
    readonly left: number;
    readonly right: number;
  } {
    if (
      this.leftChannelAnalyser === undefined ||
      this.leftChannel === undefined ||
      this.rightChannelAnalyser === undefined ||
      this.rightChannel === undefined ||
      this.audio.paused
    ) {
      return { left: 0, right: 0 };
    }

    this.leftChannelAnalyser.getFloatTimeDomainData(this.leftChannel);
    this.rightChannelAnalyser.getFloatTimeDomainData(this.rightChannel);

    return {
      left: this.projectPeak(this.leftChannel, maximum),
      right: this.projectPeak(this.rightChannel, maximum),
    };
  }

  public isPaused(): boolean {
    return this.audio.paused;
  }

  public load(track: AudioTrack): void {
    this.stopImmediately();
    this.audio.src = track.url;
    this.audio.load();
  }

  public onEnded(listener: () => void): void {
    this.audio.addEventListener('ended', listener);
  }

  public onError(listener: () => void): void {
    this.audio.addEventListener('error', listener);
  }

  public onMetadata(listener: () => void): void {
    this.audio.addEventListener('loadedmetadata', listener);
  }

  public onPause(listener: () => void): void {
    this.audio.addEventListener('pause', listener);
  }

  public onPlay(listener: () => void): void {
    this.audio.addEventListener('play', listener);
  }

  public onTimeUpdate(listener: () => void): void {
    this.audio.addEventListener('timeupdate', listener);
  }

  public pause(): void {
    if (this.audio.paused || this.fadeTimer !== undefined) {
      return;
    }

    if (this.effects === undefined) {
      this.audio.pause();

      return;
    }

    this.effects.fadeOut(PLAYBACK_FADE_SECONDS);
    this.fadeTimer = setTimeout(() => {
      this.fadeTimer = undefined;
      this.audio.pause();
    }, PLAYBACK_FADE_MILLISECONDS);
  }

  public async play(): Promise<void> {
    this.connectAudioGraph();
    this.cancelPendingPause();
    await this.audioContext?.resume();
    await this.audio.play();
    this.effects?.fadeIn(PLAYBACK_FADE_SECONDS);
  }

  public restart(): void {
    this.effects?.silence();
    this.audio.currentTime = 0;
  }

  public setBalance(balance: number): void {
    this.balance = Math.min(1, Math.max(-1, balance));
    this.effects?.setBalance(this.balance);
  }

  public setBassBoostEnabled(enabled: boolean): void {
    this.bassBoostEnabled = enabled;
    this.effects?.setBassBoostEnabled(enabled);
  }

  public setBbeEnabled(enabled: boolean): void {
    this.bbeEnabled = enabled;
    this.effects?.setBbeEnabled(enabled);
  }

  public setGrooveEnabled(enabled: boolean): void {
    this.grooveEnabled = enabled;
    this.effects?.setGrooveEnabled(enabled);
  }

  public setSurroundEnabled(enabled: boolean): void {
    this.surroundEnabled = enabled;
    this.effects?.setSurroundEnabled(enabled);
  }

  public setVolume(volume: number): void {
    this.audio.volume = Math.min(1, Math.max(0, volume));
  }
}
