# Spinner

Animates one `SegmentCell` as a transport or loading spinner.

<SpinnerDemo />

```ts
import { SegmentCell, Spinner } from '@haskou/vfd-console';

const cell = new SegmentCell({ color: 'red' });
document.querySelector('#transport')!.append(cell.element);

const spinner = new Spinner(cell, { interval: 180 });
spinner.start();
```

Use `pause()` to retain the frame, `stop()` to clear it and `destroy()` to
release its timer. `setState()` can control the spinner explicitly.
