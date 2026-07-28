# TextScroller

Moves text through a `SegmentDisplay` without rebuilding its cells.

<TextScrollerDemo />

```ts
import { SegmentDisplay, TextScroller } from '@haskou/vfd-console';

const display = new SegmentDisplay(document.querySelector('#title')!, {
  cells: 12,
});
const scroller = new TextScroller(display, {
  interval: 260,
  padding: 4,
  text: 'LONG TRACK TITLE',
});

scroller.start();
// scroller.pause();
// scroller.destroy();
```

Call `destroy()` when the owner unmounts. `pause()` preserves position;
`reset()` returns to the beginning. The component respects the display's fixed
geometry and exposes `setText`, `start`, `pause`, `step`, `reset` and `destroy`.
