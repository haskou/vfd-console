# SegmentCell

The low-level building block behind `SegmentDisplay`. Use it when a component
needs to control one character or an explicit set of segments.

<SegmentCellDemo />

```ts
import { SegmentCell } from '@haskou/vfd-console';

const cell = new SegmentCell({ color: 'green' });
document.querySelector('#status')!.append(cell.element);

cell.setCharacter('A');
cell.setSegments(['a1', 'a2', 'f', 'g1', 'g2', 'b', 'c', 'd1', 'd2']);
cell.clear();
```

The cell exposes its stable `element`, supports `setCharacter`,
`setSegments`, `setColor`, `clear` and `test`, and marks its illumination state
with `data-illuminated`.
