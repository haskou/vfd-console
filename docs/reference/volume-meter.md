# VolumeMeter

Renders a bounded, segmented level with warning and clipping zones.

<VolumeMeterDemo />

```ts
import { VolumeMeter } from '@haskou/vfd-console';

const volume = new VolumeMeter(document.querySelector('#volume')!, {
  ariaLabel: 'Output volume',
  clippingFrom: 14,
  segments: 16,
  warningFrom: 11,
});

volume.setValue(10);
volume.increment();
volume.mute();
```

`setValue`, `increment`, `decrement`, `mute`, `unmute`, `clear` and `test`
animate the existing segments in the direction of travel. Supply `valueText`
to describe application-specific units to assistive technology.
