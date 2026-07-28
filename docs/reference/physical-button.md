# Physical buttons

The physical control style is an opt-in CSS utility. It works with native
buttons and uses `aria-pressed` as the illuminated latch state.

<PhysicalButtonDemo />

```html
<button class="vfd-physical-button" type="button" aria-pressed="false">
  REPEAT
</button>

<button
  class="vfd-physical-button"
  type="button"
  aria-pressed="true"
  data-color="red"
>
  POWER
</button>
```

```ts
const button = document.querySelector<HTMLButtonElement>('button')!;

button.addEventListener('click', () => {
  const pressed = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', String(!pressed));
});
```

Import the complete stylesheet or only this module:

```ts
import '@haskou/vfd-console/css/controls';
```

The button face does not change color when latched. `aria-pressed="true"`
illuminates the narrow pilot above its label; an inactive pilot remains almost
black. Add `data-color="red"` for a red power or record pilot. The default pilot
uses the bright core color and phosphor glow.

The class provides a molded face, bevel, mechanical travel, focus treatment and
a disabled state. Deliberately, it has no hover treatment: physical hardware
does not react before contact, and avoiding hover shadows prevents unnecessary
repaints across large control banks. It also removes motion when the user
prefers reduced motion.
