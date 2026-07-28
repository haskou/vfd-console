# API reference

Every public component owns one display responsibility and keeps its DOM
geometry mounted. State changes illuminate existing geometry instead of
rebuilding it.

## Displays and motion

- [`SegmentDisplay`](./segment-display) renders text with permanent
  14-segment cells.
- [`SegmentCell`](./segment-cell) controls one low-level character cell.
- [`CharacterMap`](./character-map) resolves characters to segment names.
- [`TextScroller`](./text-scroller) scrolls text through a display.
- [`Spinner`](./spinner) animates a cell as a transport spinner.
- [`Indicator`](./indicator) illuminates persistent labels.

## Meters

- [`SpectrumMeter`](./spectrum-meter) renders multi-band audio frequencies.
- [`VolumeMeter`](./volume-meter) renders a bounded level.
- [`PeakLevelMeter`](./peak-level-meter) renders stereo dB-style levels.
- [`BalanceMeter`](./balance-meter) renders left/right balance.

All meter transitions are CSS-driven and start from the current value. Override
`--vfd-meter-stagger` and `--vfd-meter-transition-duration` to tune motion.

## Styling

- [`Physical buttons`](./physical-button) documents the opt-in button class.
- [`Optical effects`](./optical-effects) adds optional mesh and phosphor
  diffusion.
- [`Presets`](./presets) applies bundled phosphor themes.
