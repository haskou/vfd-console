# SegmentDisplay

Renders a fixed-width line of 14-segment cells. Updating text never replaces
the cell nodes, and illumination changes are instantaneous without CSS
animation.

<SegmentDisplayDemo />

```ts
import { SegmentDisplay } from '@haskou/vfd-console';
import '@haskou/vfd-console/css';

const display = new SegmentDisplay(document.querySelector('#title')!, {
  ariaLabel: 'Track title',
  cells: 12,
  color: 'primary',
});

display.setText('VFD CONSOLE');
display.setAccessibleLabel('Track title: VFD Console');
```

## Options

| Option      | Type       | Description                    |
| ----------- | ---------- | ------------------------------ |
| `cells`     | `number`   | Required positive cell count.  |
| `ariaLabel` | `string`   | Accessible display name.       |
| `color`     | `VfdColor` | Phosphor color for every cell. |

## Methods

`setText(text)`, `clear()`, `test()`, `cell(index)` and
`setAccessibleLabel(label)`.

Use `test()` for a display test. It illuminates every segment without changing
the permanent geometry.
