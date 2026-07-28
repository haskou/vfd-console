import { afterEach, describe, expect, it, vi } from 'vitest';

import { AudioPlaylist } from '../demo/AudioPlaylist';
import { AudioTrack } from '../demo/AudioTrack';
import { BrowserAudioPlayer } from '../demo/BrowserAudioPlayer';
import { describePlaybackTime, formatPlaybackTime } from '../demo/PlaybackTime';
import { SpectrumLevelProjector } from '../demo/SpectrumLevelProjector';

function track(id: string): AudioTrack {
  return new AudioTrack(
    id,
    new File([], `${id}.mp3`, { type: 'audio/mpeg' }),
    `blob:${id}`,
  );
}

describe('PlaybackTime', () => {
  it('uses a dot visually without changing the spoken meaning', () => {
    expect(formatPlaybackTime(61)).toBe('01.01');
    expect(describePlaybackTime(61)).toBe('1 minute 1 second');
  });
});

describe('BrowserAudioPlayer', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('applies sound processors, balance and short playback fades', async () => {
    vi.useFakeTimers();
    const connect = vi.fn();
    const parameter = (value = 0) => ({
      cancelScheduledValues: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      setTargetAtTime: vi.fn(),
      setValueAtTime: vi.fn(),
      value,
    });
    const bassFilter = {
      connect,
      frequency: parameter(),
      gain: parameter(),
      type: 'lowpass',
    };
    const bbeFilter = {
      connect,
      frequency: parameter(),
      gain: parameter(),
      type: 'lowpass',
    };
    const panner = {
      connect,
      pan: parameter(),
    };
    const compressor = {
      attack: parameter(),
      connect,
      knee: parameter(),
      ratio: parameter(),
      release: parameter(),
      threshold: parameter(),
    };
    const silentOutput = { connect, gain: parameter() };
    const grooveGain = { connect, gain: parameter() };
    const surroundDryGain = { connect, gain: parameter() };
    const surroundWetGain = { connect, gain: parameter() };
    const masterGain = { connect, gain: parameter() };
    const createAnalyser = vi.fn(() => ({
      connect,
      fftSize: 0,
      frequencyBinCount: 1024,
      getByteFrequencyData: vi.fn(),
      getFloatTimeDomainData: vi.fn(),
      maxDecibels: 0,
      minDecibels: 0,
      smoothingTimeConstant: 0,
    }));
    const createBiquadFilter = vi
      .fn()
      .mockReturnValueOnce(bassFilter)
      .mockReturnValueOnce(bbeFilter);
    const createGain = vi
      .fn()
      .mockReturnValueOnce(silentOutput)
      .mockReturnValueOnce(grooveGain)
      .mockReturnValueOnce(surroundDryGain)
      .mockReturnValueOnce(surroundWetGain)
      .mockReturnValueOnce(masterGain);
    const audioContext = {
      close: vi.fn(),
      createAnalyser,
      createBiquadFilter,
      createChannelMerger: vi.fn(() => ({ connect })),
      createChannelSplitter: vi.fn(() => ({ connect })),
      createDelay: vi.fn(() => ({ connect, delayTime: parameter() })),
      createDynamicsCompressor: vi.fn(() => compressor),
      createGain,
      createMediaElementSource: vi.fn(() => ({ connect })),
      createStereoPanner: vi.fn(() => panner),
      currentTime: 0,
      destination: {},
      resume: vi.fn(),
      sampleRate: 48_000,
    };
    vi.stubGlobal(
      'AudioContext',
      vi.fn(() => audioContext),
    );
    const audio = document.createElement('audio');
    let paused = true;
    Object.defineProperty(audio, 'paused', {
      configurable: true,
      get: () => paused,
    });
    const pause = vi.spyOn(audio, 'pause').mockImplementation(() => {
      paused = true;
    });
    vi.spyOn(audio, 'play').mockImplementation(() => {
      paused = false;

      return Promise.resolve();
    });
    const player = new BrowserAudioPlayer(audio, 4, 14);

    player.setBalance(2);
    player.setBassBoostEnabled(true);
    player.setBbeEnabled(true);
    player.setGrooveEnabled(true);
    player.setSurroundEnabled(true);
    await player.play();

    expect(panner.pan.setTargetAtTime).toHaveBeenLastCalledWith(1, 0, 0.015);
    expect(bassFilter.gain.setTargetAtTime).toHaveBeenLastCalledWith(
      7,
      0,
      0.015,
    );
    expect(bbeFilter.gain.setTargetAtTime).toHaveBeenLastCalledWith(
      4.5,
      0,
      0.015,
    );
    expect(compressor.ratio.setTargetAtTime).toHaveBeenLastCalledWith(
      4,
      0,
      0.015,
    );
    expect(grooveGain.gain.setTargetAtTime).toHaveBeenLastCalledWith(
      1.12,
      0,
      0.015,
    );
    expect(surroundWetGain.gain.setTargetAtTime).toHaveBeenLastCalledWith(
      0.38,
      0,
      0.015,
    );
    expect(masterGain.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      1,
      0.05,
    );

    player.pause();

    expect(pause).not.toHaveBeenCalled();
    expect(masterGain.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(
      0,
      0.05,
    );

    await vi.advanceTimersByTimeAsync(50);

    expect(pause).toHaveBeenCalledOnce();
  });
});

describe('AudioPlaylist', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('selects the first added track and preserves the selection on additions', () => {
    const playlist = new AudioPlaylist();
    playlist.add([track('first'), track('second')]);

    playlist.select('second');
    playlist.add([track('third')]);

    expect(playlist.getSelected()?.id).toBe('second');
    expect(playlist.getSelectedNumber()).toBe(2);
    expect(playlist.getTracks()).toHaveLength(3);
  });

  it('selects the nearest remaining track when removing the current one', () => {
    const playlist = new AudioPlaylist();
    playlist.add([track('first'), track('second'), track('third')]);
    playlist.select('second');

    const removed = playlist.remove('second');

    expect(removed?.id).toBe('second');
    expect(playlist.getSelected()?.id).toBe('third');
    expect(playlist.getSelectedNumber()).toBe(2);
  });

  it('navigates, wraps and supports a different random track', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const playlist = new AudioPlaylist();
    playlist.add([track('first'), track('second'), track('third')]);

    expect(playlist.selectPrevious()?.id).toBe('third');
    expect(playlist.selectNext(false)?.id).toBe('first');
    expect(playlist.selectNext(true)?.id).toBe('second');
  });

  it('releases every object URL when cleared', () => {
    const revokeObjectUrl = vi.fn();
    vi.stubGlobal('URL', { revokeObjectURL: revokeObjectUrl });
    const playlist = new AudioPlaylist();
    playlist.add([track('first'), track('second')]);

    playlist.clear();

    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:first');
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:second');
    expect(playlist.getSelected()).toBeUndefined();
  });
});

describe('SpectrumLevelProjector', () => {
  it('projects silent and active frequency bins into bounded VFD levels', () => {
    const projector = new SpectrumLevelProjector(4, 14);
    const silence = new Uint8Array(1024);
    const frequencies = new Uint8Array(1024);
    frequencies.fill(255);

    expect(projector.project(silence, 48_000)).toEqual([0, 0, 0, 0]);
    expect(projector.project(frequencies, 48_000)).toEqual([14, 14, 14, 14]);
  });
});
