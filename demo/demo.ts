import {
  applyPreset,
  BalanceMeter,
  Indicator,
  PeakLevelMeter,
  SegmentDisplay,
  SpectrumMeter,
  Spinner,
  TextScroller,
  VolumeMeter,
  type VfdPreset,
} from '../src';
import { AudioPlaylist } from './AudioPlaylist';
import { AudioTrack } from './AudioTrack';
import { BrowserAudioPlayer } from './BrowserAudioPlayer';
import { DEMO_SOURCE_NAMES, type DemoSourceName } from './DemoSourceName';
import { DEMO_TOGGLE_NAMES, type DemoToggleName } from './DemoToggleName';
import {
  DEMO_VISUAL_EFFECT_NAMES,
  type DemoVisualEffectName,
} from './DemoVisualEffectName';
import { describePlaybackTime, formatPlaybackTime } from './PlaybackTime';

const FREQUENCY_LABELS = [
  '63',
  '80',
  '100',
  '125',
  '160',
  '250',
  '315',
  '400',
  '500',
  '630',
  '1K',
  '1.6K',
  '2.5K',
  '4K',
  '6.3K',
  '8K',
  '12.5K',
  '16K',
] as const;
const AUDIO_FILE_EXTENSION = /\.(aac|flac|m4a|mp3|oga|ogg|opus|wav|webm)$/i;
const EMPTY_TITLE = 'LOAD AUDIO FILES';
const SPECTRUM_COLUMNS = FREQUENCY_LABELS.length;
const SPECTRUM_SEGMENTS = 14;
const PEAK_SEGMENTS = 12;
const KNOB_MINIMUM_ANGLE = -135;
const KNOB_MAXIMUM_ANGLE = 135;
const POWER_ON_DISPLAY_TEST_MILLISECONDS = 900;

type PlaybackState = 'paused' | 'playing';

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (element === null) {
    throw new Error(`Missing demo element: ${selector}`);
  }

  return element;
}

function isSourceName(value: string): value is DemoSourceName {
  return DEMO_SOURCE_NAMES.some((source) => source === value);
}

function isToggleName(value: string): value is DemoToggleName {
  return DEMO_TOGGLE_NAMES.some((toggle) => toggle === value);
}

function isVisualEffectName(value: string): value is DemoVisualEffectName {
  return DEMO_VISUAL_EFFECT_NAMES.some((effect) => effect === value);
}

function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') || AUDIO_FILE_EXTENSION.test(file.name);
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024);

  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
}

function renderKnobPosition(control: HTMLInputElement): void {
  const minimum = Number(control.min);
  const maximum = Number(control.max);
  const value = Number(control.value);
  const progress = (value - minimum) / (maximum - minimum);
  const angle =
    KNOB_MINIMUM_ANGLE + progress * (KNOB_MAXIMUM_ANGLE - KNOB_MINIMUM_ANGLE);
  const knobControl = control.closest<HTMLElement>('.demo-knob-control');

  knobControl?.style.setProperty('--demo-knob-angle', `${angle}deg`);
}

const panel = requiredElement<HTMLElement>('#panel');
const powerButton = requiredElement<HTMLButtonElement>('#power');
const displayTestButton = requiredElement<HTMLButtonElement>('#display-test');
const balanceControl = requiredElement<HTMLInputElement>('#balance-level');
const brightnessControl = requiredElement<HTMLInputElement>('#brightness');
const scrollSpeedControl = requiredElement<HTMLInputElement>('#scroll-speed');
const volumeControl = requiredElement<HTMLInputElement>('#volume-level');
const audioFilesControl = requiredElement<HTMLInputElement>('#audio-files');
const clearPlaylistButton =
  requiredElement<HTMLButtonElement>('#clear-playlist');
const playlistElement = requiredElement<HTMLOListElement>('#audio-playlist');
const audioStatus = requiredElement<HTMLElement>('#audio-status');
const audioDropZone = requiredElement<HTMLElement>('#audio-drop-zone');
const presetControl = requiredElement<HTMLSelectElement>('#preset');

const trackDisplay = new SegmentDisplay(requiredElement('#track'), {
  ariaLabel: 'No track selected',
  cells: 2,
  color: 'green',
});
const timeDisplay = new SegmentDisplay(requiredElement('#time'), {
  ariaLabel: 'Elapsed time 0 minutes 0 seconds',
  cells: 5,
});
const titleDisplay = new SegmentDisplay(requiredElement('#title'), {
  ariaLabel: 'Load audio files',
  cells: 18,
});
const spinnerDisplay = new SegmentDisplay(requiredElement('#spinner'), {
  ariaLabel: 'Playback stopped',
  cells: 1,
  color: 'red',
});

let scrollInterval = 260;
let scroller = new TextScroller(titleDisplay, {
  interval: scrollInterval,
  padding: 4,
  text: EMPTY_TITLE,
});
const spinner = new Spinner(spinnerDisplay.cell(0), {
  color: 'red',
  interval: 180,
});
const spectrum = new SpectrumMeter(requiredElement('#spectrum'), {
  ariaLabel: 'Audio frequency spectrum',
  columns: SPECTRUM_COLUMNS,
  labels: FREQUENCY_LABELS,
  segments: SPECTRUM_SEGMENTS,
  zones: [
    { color: 'primary', from: 0, to: 8 },
    { color: 'yellow', from: 9, to: 11 },
    { color: 'red', from: 12, to: 13 },
  ],
});
const volume = new VolumeMeter(requiredElement('#volume'), {
  ariaLabel: 'Playback volume',
  clippingFrom: 14,
  segments: 16,
  warningFrom: 11,
});
const peakLevel = new PeakLevelMeter(requiredElement('#peak-level'), {
  ariaLabel: 'Stereo audio peak level',
  clippingFrom: 10,
  labels: [
    '-∞',
    '-20',
    '-15',
    '-10',
    '-7',
    '-5',
    '-3',
    '-1',
    '0',
    '+1',
    '+3',
    '+8',
  ],
  segments: PEAK_SEGMENTS,
  warningFrom: 8,
});
const balance = new BalanceMeter(requiredElement('#balance'), {
  ariaLabel: 'Stereo audio balance',
  segmentsPerSide: 8,
});
const audioPlayer = new BrowserAudioPlayer(
  requiredElement<HTMLAudioElement>('#audio-player'),
  SPECTRUM_COLUMNS,
  SPECTRUM_SEGMENTS,
);
const playlist = new AudioPlaylist();

document
  .querySelectorAll<HTMLButtonElement>('button')
  .forEach((button) => button.classList.add('vfd-physical-button'));

const indicators = new Map<string, Indicator>();
document
  .querySelectorAll<HTMLElement>('[data-indicator]')
  .forEach((element) => {
    const name = element.dataset.indicator;

    if (name !== undefined) {
      indicators.set(
        name,
        new Indicator(element, {
          color:
            element.dataset.color === 'green' ||
            element.dataset.color === 'yellow' ||
            element.dataset.color === 'red'
              ? element.dataset.color
              : 'primary',
        }),
      );
    }
  });

const toggleStates = new Map<DemoToggleName, boolean>(
  DEMO_TOGGLE_NAMES.map((name) => [name, false]),
);
const visualEffectStates = new Map<DemoVisualEffectName, boolean>(
  DEMO_VISUAL_EFFECT_NAMES.map((name) => [name, true]),
);
let displayTestActive = false;
let loadedTrackId: string | undefined;
let playbackState: PlaybackState = 'paused';
let poweredOn = false;
let powerOnDisplayTestTimer: ReturnType<typeof setTimeout> | undefined;
let resumeAfterDisplayTest = false;
let resumeAfterPower = false;
let selectedSource: DemoSourceName = 'cd';

function selectedTrack(): AudioTrack | undefined {
  return playlist.getSelected();
}

function hasTrack(): boolean {
  return selectedTrack() !== undefined;
}

function setStatus(message: string): void {
  audioStatus.textContent = message;
}

function getPlaybackIndicatorState(name: string): boolean | undefined {
  if (name === 'play') {
    return playbackState === 'playing';
  }

  if (name === 'pause') {
    return hasTrack() && playbackState === 'paused';
  }

  return undefined;
}

function getIndicatorState(name: string): boolean {
  if (!poweredOn) {
    return false;
  }

  const playbackIndicatorState = getPlaybackIndicatorState(name);

  if (playbackIndicatorState !== undefined) {
    return playbackIndicatorState;
  }

  if (isSourceName(name)) {
    return name === selectedSource;
  }

  return isToggleName(name) ? (toggleStates.get(name) ?? false) : false;
}

function renderIndicators(): void {
  indicators.forEach((indicator, name) => {
    indicator.setActive(getIndicatorState(name));
  });
}

function renderControlStates(): void {
  const trackAvailable = hasTrack();
  powerButton.setAttribute('aria-pressed', String(poweredOn));
  panel.dataset.powered = String(poweredOn);
  panel.dataset.vfdBlur = String(visualEffectStates.get('blur') ?? false);
  panel.dataset.vfdMesh = String(visualEffectStates.get('mesh') ?? false);
  clearPlaylistButton.disabled = playlist.getTracks().length === 0;

  document
    .querySelectorAll<HTMLElement>('[data-requires-power]')
    .forEach((control) => {
      const disabledByDisplayTest =
        displayTestActive && control !== displayTestButton;
      control.toggleAttribute('disabled', !poweredOn || disabledByDisplayTest);
    });

  document
    .querySelectorAll<HTMLButtonElement>(
      '[data-action="play"], [data-action="pause"]',
    )
    .forEach((button) => {
      const active =
        poweredOn &&
        ((button.dataset.action === 'play' && playbackState === 'playing') ||
          (button.dataset.action === 'pause' &&
            trackAvailable &&
            playbackState === 'paused'));
      button.setAttribute('aria-pressed', String(active));
    });

  document
    .querySelectorAll<HTMLButtonElement>('[data-source]')
    .forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(poweredOn && button.dataset.source === selectedSource),
      );
    });

  document
    .querySelectorAll<HTMLButtonElement>('[data-toggle]')
    .forEach((button) => {
      const name = button.dataset.toggle;
      const active =
        poweredOn &&
        name !== undefined &&
        isToggleName(name) &&
        (toggleStates.get(name) ?? false);
      button.setAttribute('aria-pressed', String(active));
    });

  document
    .querySelectorAll<HTMLButtonElement>('[data-visual-effect]')
    .forEach((button) => {
      const name = button.dataset.visualEffect;
      const active =
        poweredOn &&
        name !== undefined &&
        isVisualEffectName(name) &&
        (visualEffectStates.get(name) ?? false);
      button.setAttribute('aria-pressed', String(active));
    });
}

function renderPlaylist(): void {
  const selected = selectedTrack();
  playlistElement.replaceChildren();

  playlist.getTracks().forEach((track, index) => {
    const item = document.createElement('li');
    item.className = 'demo-playlist__item';
    item.dataset.selected = String(track.id === selected?.id);

    const selectButton = document.createElement('button');
    selectButton.className = 'demo-playlist__select vfd-physical-button';
    selectButton.type = 'button';
    selectButton.dataset.trackId = track.id;
    selectButton.setAttribute(
      'aria-current',
      track.id === selected?.id ? 'true' : 'false',
    );

    const number = document.createElement('span');
    number.className = 'demo-playlist__number';
    number.textContent = String(index + 1).padStart(2, '0');

    const title = document.createElement('span');
    title.className = 'demo-playlist__title';
    title.textContent = track.getTitle();

    const size = document.createElement('span');
    size.className = 'demo-playlist__size';
    size.textContent = formatFileSize(track.file.size);

    const removeButton = document.createElement('button');
    removeButton.className = 'demo-playlist__remove vfd-physical-button';
    removeButton.type = 'button';
    removeButton.dataset.removeTrack = track.id;
    removeButton.setAttribute('aria-label', `Remove ${track.getTitle()}`);
    removeButton.textContent = 'REMOVE';

    selectButton.append(number, title, size);
    item.append(selectButton, removeButton);
    playlistElement.append(item);
  });
}

function pauseMotion(): void {
  scroller.pause();
  spinner.stop();
}

function renderPlayback(): void {
  if (!hasTrack()) {
    pauseMotion();
    spinnerDisplay.setAccessibleLabel('Playback stopped');

    return;
  }

  if (playbackState === 'playing') {
    spinner.start();
    scroller.start();
    spinnerDisplay.setAccessibleLabel('Playing');
  } else {
    spinner.pause();
    scroller.pause();
    spinnerDisplay.setAccessibleLabel('Paused');
  }
}

function renderTrack(): void {
  const track = selectedTrack();

  if (track === undefined) {
    trackDisplay.setText('--');
    trackDisplay.setAccessibleLabel('No track selected');
    titleDisplay.setAccessibleLabel('Load audio files');

    return;
  }

  const trackNumber = playlist.getSelectedNumber();
  trackDisplay.setText(String(trackNumber).padStart(2, '0'));
  trackDisplay.setAccessibleLabel(`Track ${trackNumber}`);
  titleDisplay.setAccessibleLabel(track.getTitle());
}

function renderTime(): void {
  if (!poweredOn || displayTestActive) {
    return;
  }

  const currentTime = audioPlayer.getCurrentTime();
  const duration = audioPlayer.getDuration();
  timeDisplay.setText(formatPlaybackTime(currentTime));
  timeDisplay.setAccessibleLabel(
    duration > 0
      ? `${describePlaybackTime(currentTime)} elapsed of ${describePlaybackTime(duration)}`
      : `${describePlaybackTime(currentTime)} elapsed`,
  );
}

function renderPoweredOff(): void {
  pauseMotion();
  trackDisplay.clear();
  timeDisplay.clear();
  titleDisplay.clear();
  spinnerDisplay.clear();
  spectrum.clear();
  peakLevel.clear();
  balance.clear();
  volume.clear();
  renderIndicators();
}

function renderPoweredOn(): void {
  renderTrack();
  renderTime();
  scroller.reset();
  spectrum.clear();
  peakLevel.clear();
  balance.setBalance(Number(balanceControl.value) / 10);
  volume.setValue(Number(volumeControl.value));
  renderIndicators();
  renderPlayback();
}

function renderOperatingState(): void {
  panel.style.setProperty('--vfd-brightness', brightnessControl.value);
  renderControlStates();

  if (poweredOn) {
    renderPoweredOn();
  } else {
    renderPoweredOff();
  }
}

function updatePlaybackState(state: PlaybackState): void {
  playbackState = state;
  renderControlStates();

  if (!poweredOn || displayTestActive) {
    return;
  }

  renderIndicators();
  renderPlayback();

  if (state === 'paused') {
    spectrum.clear();
  }
}

async function playSelected(): Promise<void> {
  const track = selectedTrack();

  if (!poweredOn || displayTestActive || track === undefined) {
    return;
  }

  try {
    await audioPlayer.play();
    setStatus(`Playing ${track.getTitle()}.`);
  } catch {
    updatePlaybackState('paused');
    setStatus(`Could not play ${track.getTitle()}.`);
  }
}

function loadSelectedTrack(autoplay: boolean): void {
  const track = selectedTrack();

  if (track === undefined) {
    loadedTrackId = undefined;
    audioPlayer.clear();
    scroller.setText(EMPTY_TITLE);
    updatePlaybackState('paused');
    renderOperatingState();

    return;
  }

  if (loadedTrackId !== track.id) {
    audioPlayer.load(track);
    loadedTrackId = track.id;
  }

  scroller.setText(track.getTitle().toUpperCase());
  renderOperatingState();

  if (autoplay) {
    void playSelected();
  }
}

function selectTrack(id: string): void {
  const wasPlaying = playbackState === 'playing';

  if (!playlist.select(id)) {
    return;
  }

  audioPlayer.pause();
  loadSelectedTrack(wasPlaying);
  renderPlaylist();
}

function removeTrack(id: string): void {
  const currentTrack = selectedTrack();
  const removesCurrentTrack = currentTrack?.id === id;
  const wasPlaying = playbackState === 'playing';

  if (removesCurrentTrack) {
    audioPlayer.pause();
    audioPlayer.clear();
    loadedTrackId = undefined;
  }

  const removed = playlist.remove(id);

  if (removed === undefined) {
    return;
  }

  removed.release();
  loadSelectedTrack(removesCurrentTrack && wasPlaying);
  renderPlaylist();
  setStatus(
    playlist.getTracks().length === 0
      ? 'No audio loaded.'
      : `Removed ${removed.getTitle()}.`,
  );
}

function addAudioFiles(files: readonly File[]): void {
  const audioFiles = files.filter(isAudioFile);

  if (audioFiles.length === 0) {
    setStatus('No supported audio files were selected.');

    return;
  }

  const wasEmpty = playlist.getTracks().length === 0;
  playlist.add(audioFiles.map((file) => AudioTrack.fromFile(file)));
  selectedSource = 'cd';
  renderPlaylist();

  if (wasEmpty) {
    loadSelectedTrack(false);
  } else {
    renderControlStates();
    renderIndicators();
  }

  setStatus(
    `${audioFiles.length} audio ${audioFiles.length === 1 ? 'file' : 'files'} added.`,
  );
}

function clearPlaylist(): void {
  audioPlayer.pause();
  audioPlayer.clear();
  loadedTrackId = undefined;
  playlist.clear();
  scroller.setText(EMPTY_TITLE);
  updatePlaybackState('paused');
  renderPlaylist();
  renderOperatingState();
  setStatus('No audio loaded.');
}

function selectAdjacentTrack(direction: 'next' | 'previous'): void {
  const wasPlaying = playbackState === 'playing';
  const random = toggleStates.get('random') ?? false;
  const track =
    direction === 'next'
      ? playlist.selectNext(random)
      : playlist.selectPrevious();

  if (track === undefined) {
    return;
  }

  audioPlayer.pause();
  loadedTrackId = undefined;
  loadSelectedTrack(wasPlaying);
  renderPlaylist();
}

function setSource(source: DemoSourceName): void {
  selectedSource = source;
  renderControlStates();

  if (poweredOn && !displayTestActive) {
    renderIndicators();
  }
}

function setSoundProcessor(name: DemoToggleName, enabled: boolean): void {
  if (name === 'bbe') {
    audioPlayer.setBbeEnabled(enabled);
  } else if (name === 'bass') {
    audioPlayer.setBassBoostEnabled(enabled);
  } else if (name === 'groove') {
    audioPlayer.setGrooveEnabled(enabled);
  } else if (name === 'surround') {
    audioPlayer.setSurroundEnabled(enabled);
  }
}

function toggleIndicator(name: DemoToggleName): void {
  const enabled = !(toggleStates.get(name) ?? false);
  toggleStates.set(name, enabled);
  setSoundProcessor(name, enabled);
  renderControlStates();

  if (poweredOn && !displayTestActive) {
    renderIndicators();
  }
}

function toggleVisualEffect(name: DemoVisualEffectName): void {
  visualEffectStates.set(name, !(visualEffectStates.get(name) ?? false));
  renderControlStates();
}

function updateSpectrum(): void {
  if (!poweredOn || displayTestActive || playbackState === 'paused') {
    return;
  }

  spectrum.setLevels(audioPlayer.getSpectrumLevels());
  const peaks = audioPlayer.getStereoPeakLevels(PEAK_SEGMENTS);
  peakLevel.setLevels(peaks.left, peaks.right);
}

function showDisplayTest(resumeAfterTest = playbackState === 'playing'): void {
  resumeAfterDisplayTest = resumeAfterTest;
  audioPlayer.pause();
  displayTestActive = true;
  displayTestButton.setAttribute('aria-pressed', 'true');
  renderControlStates();
  pauseMotion();
  trackDisplay.test();
  timeDisplay.test();
  titleDisplay.test();
  spinnerDisplay.test();
  spectrum.test();
  peakLevel.test();
  balance.test();
  volume.test();
  indicators.forEach((indicator) => indicator.setActive(true));
}

function cancelPowerOnDisplayTest(): void {
  if (powerOnDisplayTestTimer === undefined) {
    return;
  }

  clearTimeout(powerOnDisplayTestTimer);
  powerOnDisplayTestTimer = undefined;
}

function hideDisplayTest(): void {
  if (!displayTestActive) {
    return;
  }

  displayTestActive = false;
  displayTestButton.setAttribute('aria-pressed', 'false');
  renderOperatingState();

  if (resumeAfterDisplayTest) {
    resumeAfterDisplayTest = false;
    void playSelected();
  }
}

function toggleDisplayTest(): void {
  if (!poweredOn) {
    return;
  }

  if (displayTestActive) {
    cancelPowerOnDisplayTest();
    hideDisplayTest();
  } else {
    showDisplayTest();
  }
}

function cancelDisplayTest(): void {
  cancelPowerOnDisplayTest();
  displayTestActive = false;
  resumeAfterDisplayTest = false;
  displayTestButton.setAttribute('aria-pressed', 'false');
}

function startPowerOnDisplayTest(): void {
  const shouldResumePlayback = resumeAfterPower || playbackState === 'playing';
  resumeAfterPower = false;
  showDisplayTest(shouldResumePlayback);
  powerOnDisplayTestTimer = setTimeout(() => {
    powerOnDisplayTestTimer = undefined;
    hideDisplayTest();
  }, POWER_ON_DISPLAY_TEST_MILLISECONDS);
}

function togglePower(): void {
  cancelDisplayTest();

  if (poweredOn) {
    resumeAfterPower = playbackState === 'playing';
    audioPlayer.pause();
    poweredOn = false;
    renderOperatingState();

    return;
  }

  poweredOn = true;
  startPowerOnDisplayTest();
}

function changeScrollSpeed(): void {
  scrollInterval = Number(scrollSpeedControl.value);
  scroller.destroy();
  scroller = new TextScroller(titleDisplay, {
    interval: scrollInterval,
    padding: 4,
    text: selectedTrack()?.getTitle().toUpperCase() ?? EMPTY_TITLE,
  });

  if (poweredOn && !displayTestActive) {
    renderPlayback();
  }
}

async function handleTrackEnded(): Promise<void> {
  if (toggleStates.get('repeat') ?? false) {
    audioPlayer.restart();
    await playSelected();

    return;
  }

  const random = toggleStates.get('random') ?? false;
  const nextTrack = playlist.selectNext(random, false);

  if (nextTrack === undefined) {
    updatePlaybackState('paused');
    setStatus('Playback finished.');

    return;
  }

  loadedTrackId = undefined;
  loadSelectedTrack(true);
  renderPlaylist();
}

const spectrumTimer = setInterval(updateSpectrum, 80);

presetControl.addEventListener('change', () => {
  applyPreset(panel, presetControl.value as VfdPreset);
});

powerButton.addEventListener('click', togglePower);
displayTestButton.addEventListener('click', toggleDisplayTest);
clearPlaylistButton.addEventListener('click', clearPlaylist);

audioFilesControl.addEventListener('change', () => {
  addAudioFiles([...(audioFilesControl.files ?? [])]);
  audioFilesControl.value = '';
});

for (const eventName of ['dragenter', 'dragover'] as const) {
  audioDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    audioDropZone.dataset.dragging = 'true';
  });
}

for (const eventName of ['dragleave', 'drop'] as const) {
  audioDropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    audioDropZone.dataset.dragging = 'false';
  });
}

audioDropZone.addEventListener('drop', (event) => {
  addAudioFiles([...(event.dataTransfer?.files ?? [])]);
});

playlistElement.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const removeButton = event.target.closest<HTMLButtonElement>(
    '[data-remove-track]',
  );

  if (removeButton?.dataset.removeTrack !== undefined) {
    removeTrack(removeButton.dataset.removeTrack);

    return;
  }

  const selectButton =
    event.target.closest<HTMLButtonElement>('[data-track-id]');

  if (selectButton?.dataset.trackId !== undefined) {
    selectTrack(selectButton.dataset.trackId);
  }
});

document
  .querySelectorAll<HTMLButtonElement>('[data-source]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const source = button.dataset.source;

      if (source !== undefined && isSourceName(source)) {
        setSource(source);
      }
    });
  });

document
  .querySelectorAll<HTMLButtonElement>('[data-toggle]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.toggle;

      if (name !== undefined && isToggleName(name)) {
        toggleIndicator(name);
      }
    });
  });

document
  .querySelectorAll<HTMLButtonElement>('[data-visual-effect]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const effect = button.dataset.visualEffect;

      if (effect !== undefined && isVisualEffectName(effect)) {
        toggleVisualEffect(effect);
      }
    });
  });

document
  .querySelectorAll<HTMLButtonElement>('[data-action]')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;

      if (action === 'play') {
        void playSelected();
      } else if (action === 'pause') {
        audioPlayer.pause();
      } else if (action === 'prev') {
        selectAdjacentTrack('previous');
      } else if (action === 'next') {
        selectAdjacentTrack('next');
      }
    });
  });

brightnessControl.addEventListener('input', () => {
  panel.style.setProperty('--vfd-brightness', brightnessControl.value);
  renderKnobPosition(brightnessControl);
});

balanceControl.addEventListener('input', () => {
  const level = Number(balanceControl.value) / 10;
  audioPlayer.setBalance(level);
  renderKnobPosition(balanceControl);

  if (poweredOn && !displayTestActive) {
    balance.setBalance(level);
  }
});

volumeControl.addEventListener('input', () => {
  const level = Number(volumeControl.value);
  audioPlayer.setVolume(level / Number(volumeControl.max));
  renderKnobPosition(volumeControl);

  if (poweredOn && !displayTestActive) {
    volume.setValue(level);
  }
});

scrollSpeedControl.addEventListener('input', () => {
  renderKnobPosition(scrollSpeedControl);
});
scrollSpeedControl.addEventListener('change', changeScrollSpeed);

audioPlayer.onPlay(() => updatePlaybackState('playing'));
audioPlayer.onPause(() => updatePlaybackState('paused'));
audioPlayer.onTimeUpdate(renderTime);
audioPlayer.onMetadata(renderTime);
audioPlayer.onEnded(() => {
  void handleTrackEnded();
});
audioPlayer.onError(() => {
  updatePlaybackState('paused');
  setStatus('This audio file could not be decoded by the browser.');
});

window.addEventListener('beforeunload', () => {
  cancelDisplayTest();
  scroller.destroy();
  spinner.destroy();
  clearInterval(spectrumTimer);
  audioPlayer.destroy();
  playlist.clear();
});

audioPlayer.setVolume(Number(volumeControl.value) / Number(volumeControl.max));
audioPlayer.setBalance(Number(balanceControl.value) / 10);
document
  .querySelectorAll<HTMLInputElement>('[data-knob]')
  .forEach(renderKnobPosition);
renderPlaylist();
renderOperatingState();
