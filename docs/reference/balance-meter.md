# BalanceMeter

Renders a center detent with animated left and right deviation bars.

<BalanceMeterDemo />

```ts
import { BalanceMeter } from '@haskou/vfd-console';

const balance = new BalanceMeter(document.querySelector('#balance')!, {
  ariaLabel: 'Stereo balance',
  color: 'primary',
  segmentsPerSide: 8,
});

balance.setBalance(-0.35); // 35% left
balance.centerBalance();
```

Values are bounded to `-1…1`. `clear()` switches every segment off, while
`test()` illuminates both sides and the center from their current state.
