import {
  applyPreset,
  BalanceMeter,
  Indicator,
  PeakLevelMeter,
  SegmentDisplay,
  SpectrumMeter,
  TextScroller,
  type VfdColor,
  VolumeMeter,
  type VolumeMeterValueText,
} from '@haskou/vfd-console';

const panel = document.createElement('section');
const displayElement = document.createElement('div');
const spectrumElement = document.createElement('div');
const peakElement = document.createElement('div');
const balanceElement = document.createElement('div');
const volumeElement = document.createElement('div');
const indicatorElement = document.createElement('span');
const color: VfdColor = 'primary';
const volumeValueText: VolumeMeterValueText = (value, maximum, muted) =>
  muted ? 'Muted' : `${value}/${maximum}`;

const display = new SegmentDisplay(displayElement, {
  ariaLabel: 'Track title',
  cells: 12,
  color,
});
const scroller = new TextScroller(display, { text: 'VFD CONSOLE' });
const spectrum = new SpectrumMeter(spectrumElement, {
  ariaLabel: 'Frequency spectrum',
  columns: 2,
  labels: ['63', '16K'],
  segments: 8,
});
const peak = new PeakLevelMeter(peakElement, {
  segments: 4,
});
const balance = new BalanceMeter(balanceElement);
const volume = new VolumeMeter(volumeElement, {
  ariaLabel: 'Output level',
  segments: 12,
  valueText: volumeValueText,
});
const indicator = new Indicator(indicatorElement, { color });

applyPreset(panel, 'aiwa');
scroller.step();
spectrum.setLevels([4, 6]);
peak.setLevels(2, 3);
balance.setBalance(-0.25);
volume.setValue(8);
indicator.setActive(true);
