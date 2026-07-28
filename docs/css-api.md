# CSS API

VFDConsole exposes a CSS contract for panel composition, component hosts,
generated display geometry, state, and theming.

## Stylesheet entry points

Use the complete stylesheet for most applications:

```ts
import '@haskou/vfd-console/css';
```

For a smaller custom composition, import `tokens` first and then the required
modules:

```css
@import '@haskou/vfd-console/css/tokens';
@import '@haskou/vfd-console/css/controls';
@import '@haskou/vfd-console/css/glass';
@import '@haskou/vfd-console/css/segments';
@import '@haskou/vfd-console/css/indicators';
```

The public module subpaths are `controls`, `glass`, `indicators`, `layouts`,
`meters`, `presets`, `segments`, `tokens`, and `utilities`. Module files are
intentionally unbundled so CSS tooling can resolve their internal dependencies
and optimize the final application stylesheet.

## Authored and generated markup

Applications should author:

- Panel layout classes such as `.vfd-panel`, `.vfd-header`, and
  `.vfd-main-readout`.
- Empty host elements passed to `SegmentDisplay`, `SpectrumMeter`, and
  `VolumeMeter`.
- Indicator labels and groups.
- Interactive controls outside the display panel.

VFDConsole generates:

- Character and segment elements inside a `SegmentDisplay` host.
- Column, frequency label, and segment elements inside a `SpectrumMeter` host.
- Segment elements inside a `VolumeMeter` host.

Generated classes are documented so themes can target them. Applications should
not create generated segment markup by hand because its structure belongs to
the corresponding component.

## Panel composition

| Class                | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `.vfd-panel`         | Main glass display surface and token scope.             |
| `.vfd-header`        | Compact metadata row at the top of a panel.             |
| `.vfd-main-readout`  | Primary track, time, or status readout layout.          |
| `.vfd-title-display` | Wide text area intended for titles or messages.         |
| `.vfd-footer`        | Bottom row for counters, meters, or status content.     |
| `.vfd-glass-raised`  | Optional raised-glass treatment for a nested area.      |
| `.vfd-sr-only`       | Visually hidden text available to assistive technology. |

These classes provide visual structure and do not create JavaScript behavior.

## Segment displays

`SegmentDisplay` adds `.vfd-segment-display` to its host and creates this
structure:

```html
<div class="vfd-segment-display">
  <span class="vfd-character" data-color="primary">
    <i class="vfd-segment vfd-segment--a" data-active="true"></i>
    <!-- Remaining physical segments -->
  </span>
</div>
```

| Selector                                    | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `.vfd-segment-display`                      | Complete fixed-width display row.       |
| `.vfd-character`                            | One physical 14-segment character cell. |
| `.vfd-segment`                              | One permanently mounted segment.        |
| `.vfd-segment--a` through `.vfd-segment--m` | Physical segment position.              |
| `.vfd-character[data-illuminated='true']`   | Character-level phosphor halo state.    |
| `.vfd-segment[data-active='true']`          | Illuminated segment state.              |
| `.vfd-character[data-color]`                | Selects the cell color.                 |

The position set also includes the split center segments
`.vfd-segment--g1` and `.vfd-segment--g2`. Inactive segments remain in the DOM
with a faint unlit appearance. Do not hide them with `display: none`.

## Indicators

Applications author indicator labels and `Indicator` adds the state and color
attributes:

```html
<section class="vfd-indicator-group">
  <div class="vfd-indicator-group__label">Transport</div>
  <div class="vfd-indicator-group__items">
    <span id="play-indicator">PLAY</span>
    <span id="pause-indicator">PAUSE</span>
  </div>
</section>
```

```ts
const playElement = document.querySelector('#play-indicator');
if (!(playElement instanceof HTMLElement)) {
  throw new Error('Play indicator not found.');
}

const play = new Indicator(playElement, {
  color: 'green',
});
play.setActive(true);
```

| Selector                             | Purpose                                   |
| ------------------------------------ | ----------------------------------------- |
| `.vfd-indicator-grid`                | Layout for multiple indicator groups.     |
| `.vfd-indicator-group`               | One labelled group of related indicators. |
| `.vfd-indicator-group__label`        | Permanent printed group label.            |
| `.vfd-indicator-group__items`        | Container for indicators in a group.      |
| `.vfd-indicator`                     | Permanently mounted indicator label.      |
| `.vfd-indicator[data-active='true']` | Illuminated indicator state.              |
| `.vfd-indicator[data-color]`         | Selects the indicator color.              |

Use `Indicator#setActive()` to manage `data-active`; do not duplicate the same
state with an application-specific class.

## Meter components

Meter components generate fixed segment geometry and update levels without
rebuilding it.

| Selector                                 | Purpose                                         |
| ---------------------------------------- | ----------------------------------------------- |
| `.vfd-spectrum`                          | Complete spectrum component host.               |
| `.vfd-spectrum__columns`                 | Spectrum column layout.                         |
| `.vfd-spectrum__column`                  | One frequency band.                             |
| `.vfd-spectrum-labels`                   | Illuminated frequency labels above the columns. |
| `.vfd-meter-segment`                     | One physical meter segment.                     |
| `.vfd-volume-meter`                      | Horizontal volume component host.               |
| `.vfd-meter-segment[data-color]`         | Selects a segment's semantic color.             |
| `.vfd-meter-segment[data-active='true']` | Active volume segment state.                    |
| `.vfd-volume-meter[data-muted='true']`   | Muted volume state.                             |
| `.vfd-peak-meter`                        | Complete stereo peak meter host.                |
| `.vfd-peak-meter__channel`               | One stereo peak channel.                        |
| `.vfd-balance-meter`                     | Complete balance meter host.                    |
| `.vfd-balance-meter__center`             | Permanent center detent.                        |

`SpectrumMeter` manages `--vfd-spectrum-columns`, `--vfd-level`, and
`--vfd-meter-index` internally. Set levels through `setLevels()`, `setLevel()`,
or `clear()` so component state and visual state stay aligned.

Frequency labels receive an `Hz` suffix from CSS. Pass only the readable band
value, such as `63`, `500`, `1k`, or `16k`.

Meter animation is controlled by `--vfd-meter-stagger` for individual
horizontal segments and `--vfd-meter-transition-duration` for spectrum
columns. Reduced-motion preferences disable both.

## Physical controls

`.vfd-physical-button` provides the molded button face, focus state, press
travel and a narrow pilot controlled by `aria-pressed='true'`. The button face
does not become a colored light. Use `data-color='red'` for power and record
pilots; the default pilot uses the bright phosphor core. The class can be
applied to any native button and is available separately from
`@haskou/vfd-console/css/controls`.

## Optional optical effects

| Attribute              | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `data-vfd-blur='true'` | Enables compact optical diffusion for illuminated phosphor.       |
| `data-vfd-mesh='true'` | Draws a fine non-interactive control-grid pattern over the glass. |

Both attributes belong on `.vfd-panel` and are independent. Omitting them, or
setting them to `'false'`, keeps the panel crisp and mesh-free. See the
[interactive optical effects reference](./reference/optical-effects.md).

## Colors and presets

Component colors are `primary`, `green`, `yellow`, and `red`.

Apply a built-in preset to a panel:

```html
<section class="vfd-panel" data-vfd-preset="technics"></section>
```

Available presets are `aiwa`, `sony`, and `technics`. Presets change tokens and
spacing, so component markup and JavaScript remain the same.

## Custom styling

Prefer public tokens over targeting generated geometry:

```css
.studio-vfd {
  --vfd-glass: #07110f;
  --vfd-phosphor: #64ffd2;
  --vfd-glow: rgb(100 255 210 / 55%);
  --vfd-panel-gap: 1rem;
}

.studio-vfd .vfd-header {
  letter-spacing: 0.16em;
}
```

```html
<section class="vfd-panel studio-vfd"></section>
```

See [Theming](./theming.md) for the complete public token reference.

## Power and brightness

Power, playback, and display-test coordination belong to application state.
Use an attribute on the panel to expose power state. Clear active component
values while preserving their mounted physical geometry:

```css
.vfd-panel[data-powered='false'] {
  color: var(--vfd-label-off);
}

.vfd-panel[data-powered='false'] .vfd-spectrum-labels {
  color: var(--vfd-label-off);
  text-shadow: none;
}
```

The application must also pause timers and clear component values when power
is off. Do not set `--vfd-brightness` to `0` for power state because that hides
inactive segments and meter blocks as well as emitted light. CSS cannot stop
JavaScript work or restore playback state.
