# CharacterMap

Resolves supported characters to the segment names used by `SegmentCell`.

<CharacterMapDemo />

```ts
import { CharacterMap } from '@haskou/vfd-console';

const map = new CharacterMap();
const segments = map.get('R');
```

Use this class when building custom display behavior. Most applications should
use `SegmentDisplay`, which already owns character mapping.
