const BASS_FREQUENCY = 120;
const BASS_GAIN = 7;
const BBE_FREQUENCY = 3_500;
const BBE_GAIN = 4.5;
const EFFECT_RAMP_SECONDS = 0.015;
const GROOVE_GAIN = 1.12;
const SURROUND_DELAY_SECONDS = 0.014;
const SURROUND_DRY_GAIN = 0.72;
const SURROUND_WET_GAIN = 0.38;

export class BrowserAudioEffects {
  private readonly bassFilter: BiquadFilterNode;
  private readonly bbeFilter: BiquadFilterNode;
  private readonly compressor: DynamicsCompressorNode;
  private readonly grooveGain: GainNode;
  private readonly masterGain: GainNode;
  private readonly panner: StereoPannerNode;
  private readonly surroundDryGain: GainNode;
  private readonly surroundWetGain: GainNode;

  public constructor(
    private readonly context: AudioContext,
    input: AudioNode,
    output: AudioNode,
  ) {
    this.bassFilter = context.createBiquadFilter();
    this.bbeFilter = context.createBiquadFilter();
    this.compressor = context.createDynamicsCompressor();
    this.grooveGain = context.createGain();
    this.surroundDryGain = context.createGain();
    this.surroundWetGain = context.createGain();
    this.panner = context.createStereoPanner();
    this.masterGain = context.createGain();
    const surroundSplitter = context.createChannelSplitter(2);
    const surroundDelay = context.createDelay();
    const surroundMerger = context.createChannelMerger(2);

    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = BASS_FREQUENCY;
    this.bassFilter.gain.value = 0;
    this.bbeFilter.type = 'highshelf';
    this.bbeFilter.frequency.value = BBE_FREQUENCY;
    this.bbeFilter.gain.value = 0;
    this.compressor.threshold.value = 0;
    this.compressor.knee.value = 0;
    this.compressor.ratio.value = 1;
    this.compressor.attack.value = 0.01;
    this.compressor.release.value = 0.2;
    this.grooveGain.gain.value = 1;
    this.surroundDryGain.gain.value = 1;
    this.surroundWetGain.gain.value = 0;
    surroundDelay.delayTime.value = SURROUND_DELAY_SECONDS;
    this.panner.pan.value = 0;
    this.masterGain.gain.value = 0;

    input.connect(this.bassFilter);
    this.bassFilter.connect(this.bbeFilter);
    this.bbeFilter.connect(this.compressor);
    this.compressor.connect(this.grooveGain);
    this.grooveGain.connect(this.surroundDryGain);
    this.surroundDryGain.connect(this.panner);
    this.grooveGain.connect(surroundSplitter);
    surroundSplitter.connect(surroundMerger, 0, 0);
    surroundSplitter.connect(surroundDelay, 1);
    surroundDelay.connect(surroundMerger, 0, 1);
    surroundMerger.connect(this.surroundWetGain);
    this.surroundWetGain.connect(this.panner);
    this.panner.connect(this.masterGain);
    this.masterGain.connect(output);
  }

  private ramp(parameter: AudioParam, value: number): void {
    parameter.cancelScheduledValues(this.context.currentTime);
    parameter.setTargetAtTime(
      value,
      this.context.currentTime,
      EFFECT_RAMP_SECONDS,
    );
  }

  public fadeIn(duration: number): void {
    const gain = this.masterGain.gain;
    gain.cancelScheduledValues(this.context.currentTime);
    gain.setValueAtTime(gain.value, this.context.currentTime);
    gain.linearRampToValueAtTime(1, this.context.currentTime + duration);
  }

  public fadeOut(duration: number): void {
    const gain = this.masterGain.gain;
    gain.cancelScheduledValues(this.context.currentTime);
    gain.setValueAtTime(gain.value, this.context.currentTime);
    gain.linearRampToValueAtTime(0, this.context.currentTime + duration);
  }

  public setBalance(balance: number): void {
    this.ramp(this.panner.pan, Math.min(1, Math.max(-1, balance)));
  }

  public setBassBoostEnabled(enabled: boolean): void {
    this.ramp(this.bassFilter.gain, enabled ? BASS_GAIN : 0);
  }

  public setBbeEnabled(enabled: boolean): void {
    this.ramp(this.bbeFilter.gain, enabled ? BBE_GAIN : 0);
  }

  public setGrooveEnabled(enabled: boolean): void {
    this.ramp(this.compressor.threshold, enabled ? -24 : 0);
    this.ramp(this.compressor.knee, enabled ? 18 : 0);
    this.ramp(this.compressor.ratio, enabled ? 4 : 1);
    this.ramp(this.grooveGain.gain, enabled ? GROOVE_GAIN : 1);
  }

  public setSurroundEnabled(enabled: boolean): void {
    this.ramp(this.surroundDryGain.gain, enabled ? SURROUND_DRY_GAIN : 1);
    this.ramp(this.surroundWetGain.gain, enabled ? SURROUND_WET_GAIN : 0);
  }

  public silence(): void {
    const gain = this.masterGain.gain;
    gain.cancelScheduledValues(this.context.currentTime);
    gain.setValueAtTime(0, this.context.currentTime);
  }
}
