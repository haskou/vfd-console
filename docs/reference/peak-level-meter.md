# PeakLevelMeter

Renders independent left and right peak bars with an optional dB-style scale.
Its visual language is based on classic cassette and Hi-Fi peak meters.

<PeakLevelMeterDemo />

```ts
import { PeakLevelMeter } from '@haskou/vfd-console';

const peak = new PeakLevelMeter(document.querySelector('#peak')!, {
  ariaLabel: 'Stereo peak level',
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
  segments: 12,
  warningFrom: 8,
});

peak.setLevels(7, 9);
```

`setLevels(left, right)` bounds both values. `test()` fills each channel from
its last level and `clear()` drains both. The host is a labelled group and each
channel exposes an independent ARIA meter value.
