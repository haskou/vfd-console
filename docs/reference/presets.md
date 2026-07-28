# Presets

Presets apply coordinated phosphor and glass tokens without replacing panel
content.

<PresetsDemo />

```ts
import { applyPreset, VFD_PRESETS } from '@haskou/vfd-console';

const panel = document.querySelector<HTMLElement>('.vfd-panel')!;

applyPreset(panel, 'technics');
console.log(VFD_PRESETS);
```

Bundled presets are `aiwa`, `sony` and `technics`. Use the [theming
guide](../theming) when an application needs its own design language.
