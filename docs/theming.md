# Theming

VFDConsole uses stable public custom properties. Override them on `:root`, a
panel, or a product-specific wrapper.

```css
.my-player {
  --vfd-glass: #010707;
  --vfd-phosphor: #7fffd8;
  --vfd-core: #f3fffb;
  --vfd-glow: rgb(80 255 213 / 42%);
  --vfd-segment-off: rgb(77 145 126 / 15%);
}
```

The public tokens are:

- Glass: `--vfd-glass`, `--vfd-glass-raised`,
  `--vfd-glass-border`.
- Primary phosphor: `--vfd-phosphor`, `--vfd-core`, `--vfd-glow`.
- Inactive hardware: `--vfd-segment-off`, `--vfd-label-off`.
- Semantic meter colors: `--vfd-green`, `--vfd-yellow`, `--vfd-red`.
- Timing: `--vfd-step-duration`, `--vfd-scroll-duration`,
  `--vfd-spinner-duration`.
- Geometry: `--vfd-segment-gap`, `--vfd-segment-radius`,
  `--vfd-panel-gap`.
- Global illumination: `--vfd-brightness`, from `0` to `1`.
- Optical diffusion: `--vfd-optical-blur-soft` and
  `--vfd-optical-blur-strong`.
- Fine grid: `--vfd-mesh-line` and `--vfd-mesh-opacity`.
- Button pilots: `--vfd-button-indicator-blur-soft` and
  `--vfd-button-indicator-blur-strong`.

Do not redefine semantic yellow or red merely to follow the primary phosphor.
The warning and clipping zones must remain meaningful in every theme.

## Optional glass treatments

Opt into glass diffusion and the fine internal-grid treatment independently:

```html
<div class="vfd-panel" data-vfd-blur="true" data-vfd-mesh="true"></div>
```

See [Optical effects](./reference/optical-effects.md) for the interactive
comparison and customization tokens.

## Presets

The included presets are family-inspired, not replicas:

- `aiwa`: cyan phosphor, tighter information density, intense accents.
- `sony`: cold blue phosphor and more visual separation.
- `technics`: green phosphor and sober spacing.

```html
<div class="vfd-panel" data-vfd-preset="sony"></div>
```

Or:

```ts
applyPreset(panel, 'technics');
```

Presets deliberately contain no duplicated component markup or logic.
