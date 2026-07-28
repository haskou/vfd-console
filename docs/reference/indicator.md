# Indicator

Turns an existing label into a persistent VFD indicator.

<IndicatorDemo />

```html
<span id="repeat">REPEAT</span>
```

```ts
import { Indicator } from '@haskou/vfd-console';

const repeat = new Indicator(document.querySelector('#repeat')!, {
  color: 'yellow',
});

repeat.setActive(true);
repeat.setAccessibleLabel('Repeat mode');
```

Inactive indicators remain mounted and use the off-phosphor appearance. This
also means powering a panel off should call `setActive(false)`, not hide the
element.
