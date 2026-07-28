# Components

VFDConsole exposes small DOM components. They do not depend on a framework,
do not use canvas, and never rebuild their physical geometry during updates.

For panel markup, generated selectors, and supported state attributes, see the
[CSS API](./css-api.md). For a complete integration example, start with
[Getting Started](./getting-started.md).

## `CharacterMap`

Maps a character to the named segments of a 14-segment cell. The built-in map
contains `A-Z`, `0-9`, space, hyphen, slash, backslash, vertical bar, period,
and colon.

```ts
const map = new CharacterMap();
map.register('Ñ', ['a', 'b', 'c', 'e', 'f', 'h', 'k']);
```

## `SegmentCell`

Creates one physical character position with 14 permanent segment nodes.

```ts
const cell = new SegmentCell();
host.append(cell.element);
cell.setCharacter('K');
cell.setColor('red');
cell.clear();
```

`setCharacter` and `setSegments` only update `data-active` when a segment
actually changes.

## `SegmentDisplay`

Owns a fixed number of cells. The length cannot change after construction.

```ts
const display = new SegmentDisplay(element, {
  cells: 18,
  characterSet: '14-segment',
  color: 'primary',
  ariaLabel: 'Current track title',
});

display.setText('TOKYO SHOEGAZER');
display.setBrightness(0.85);
display.clear();
display.test();
```

`test()` lights every existing segment and creates no nodes.

## `TextScroller`

Moves content by full character positions with one timer update per step.

```ts
const scroller = new TextScroller(display, {
  text: 'MY DEAD GIRLFRIEND - HADAKA NO OU-SAMA',
  interval: 260,
  padding: 3,
  loop: true,
});

scroller.start();
scroller.pause();
scroller.step();
scroller.reset();
scroller.setText('UCHU NEKOKO - DIVINE HAMMER');
scroller.destroy();
```

## `Spinner`

Cycles one existing `SegmentCell` through `|`, `/`, `-`, and `\`.

```ts
const spinner = new Spinner(display.cell(0), {
  interval: 180,
  color: 'red',
});

spinner.start();
spinner.pause();
spinner.stop();
spinner.setState('loading');
spinner.destroy();
```

The interval must remain between 150 and 250 milliseconds. Loading uses twice
the selected interval.

## `Indicator`

Enhances an existing label. The element remains present for both active and
inactive states.

```ts
const repeat = new Indicator(element, {
  active: false,
  color: 'primary',
  activeLabel: 'Repeat enabled',
  inactiveLabel: 'Repeat disabled',
});

repeat.toggle();
```

## `VolumeMeter`

Creates a fixed segmented meter and gives warning and clipping segments their
own semantic colors.

```ts
const volume = new VolumeMeter(element, {
  segments: 16,
  warningFrom: 11,
  clippingFrom: 14,
});

volume.setValue(10);
volume.increment();
volume.decrement(2);
volume.mute();
volume.unmute();
```

## `SpectrumMeter`

Creates permanent columns and blocks. Zone indexes start at the bottom of each
column.

```ts
const spectrum = new SpectrumMeter(element, {
  ariaLabel: 'Playback frequency spectrum',
  columns: 18,
  segments: 14,
  zones: [
    { from: 0, to: 8, color: 'primary' },
    { from: 9, to: 11, color: 'yellow' },
    { from: 12, to: 13, color: 'red' },
  ],
});

spectrum.setLevels([7, 9, 11, 8]);
spectrum.setAccessibleLabel('Paused playback frequency spectrum');
spectrum.clear();
spectrum.test();
```

Each update writes one inherited `--vfd-level` custom property per changed
column. CSS derives the active blocks from that level, so incoming samples do
not mutate every segment or rebuild the meter.

When labels are provided, their count must match `columns`. This keeps every
frequency heading aligned with its permanent physical column.

Accessible labels are application-owned and can be updated without changing
the visual meter.

## `PeakLevelMeter`

Creates independent stereo peak bars with optional dB labels and semantic
warning and clipping zones. See the complete
[`PeakLevelMeter` reference](./reference/peak-level-meter.md).

## `BalanceMeter`

Creates a center detent and two outward-facing bars for values from `-1` to
`1`. See the complete
[`BalanceMeter` reference](./reference/balance-meter.md).

## Physical buttons

Add `.vfd-physical-button` to a native button for the opt-in molded control
style. Its illuminated latch follows `aria-pressed`. See the
[physical button reference](./reference/physical-button.md).

## Optical effects

Panel-level mesh and phosphor diffusion are independent opt-in treatments.
Use `data-vfd-mesh="true"` and `data-vfd-blur="true"` on `.vfd-panel`, or try
the [interactive optical effects reference](./reference/optical-effects.md).

## Presets

`applyPreset(panel, 'aiwa' | 'sony' | 'technics')` only changes the
`data-vfd-preset` attribute. Preset CSS changes tokens and spacing without
replacing components.
