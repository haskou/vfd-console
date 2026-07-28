# Accessibility

Segment geometry is visual output, not accessible text. Give each display a
stable semantic label that describes the information rather than the shape.

```ts
const display = new SegmentDisplay(element, {
  cells: 12,
  ariaLabel: 'Track 4, elapsed time 2 minutes 16 seconds',
});
```

`SegmentDisplay` uses `role="status"` with `aria-live="off"`. Update its label
when the underlying user-facing information changes, but do not announce every
spinner frame, scroll step, or spectrum sample.

Indicators keep their label in the DOM and expose an active or inactive
description:

```ts
new Indicator(element, {
  activeLabel: 'Repeat enabled',
  inactiveLabel: 'Repeat disabled',
});
```

`SpectrumMeter` and `VolumeMeter` accept `ariaLabel`. Both expose
`setAccessibleLabel()` for state-dependent descriptions. `VolumeMeter` also
accepts a `valueText` formatter so applications can localize or contextualize
its announced value:

```ts
const volume = new VolumeMeter(element, {
  ariaLabel: 'Output level',
  segments: 12,
  valueText: (value, maximum, muted) =>
    muted ? 'Silenced' : `${value} of ${maximum} bars`,
});
```

Controls that toggle indicators should also maintain `aria-pressed`. Source
selectors should use native radio inputs or a correctly implemented radio
group.

Discrete motion can still distract. The stylesheet increases step duration
under `prefers-reduced-motion`. Applications should additionally offer pause
controls for scrolling content and avoid starting decorative meters when they
do not communicate useful state.

Keep contrast strong for active content, but do not make inactive segments
disappear. Inactive hardware is part of the display's physical model; semantic
state must remain available through labels rather than inferred from color or
brightness alone.
