# SpectrumMeter

Renders a permanent multi-band spectrum analyzer with optional frequency
labels and color zones.

<SpectrumMeterDemo />

```ts
import { SpectrumMeter } from '@haskou/vfd-console';

const spectrum = new SpectrumMeter(document.querySelector('#spectrum')!, {
  ariaLabel: 'Audio frequency spectrum',
  columns: 5,
  labels: ['63', '250', '1K', '4K', '16K'],
  segments: 12,
  zones: [
    { color: 'primary', from: 0, to: 7 },
    { color: 'yellow', from: 8, to: 9 },
    { color: 'red', from: 10, to: 11 },
  ],
});

spectrum.setLevels([4, 8, 11, 7, 3]);
```

`setLevels` and `setLevel` animate from the current values. `test()` fills every
column from its last value; `clear()` drains it. Frequency labels are kept
visible while the panel is off.

The host receives `.vfd-spectrum`; columns use `.vfd-spectrum__column` and
labels use `.vfd-spectrum-labels`.
