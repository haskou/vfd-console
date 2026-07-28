# Optical effects

Mesh and optical diffusion are independent, opt-in panel treatments. Toggle
them below to compare crisp phosphor, diffusion, the fine control-grid pattern,
or both effects together.

<OpticalEffectsDemo />

```html
<section class="vfd-panel" data-vfd-blur="true" data-vfd-mesh="true">
  <!-- VFD components -->
</section>
```

Omit an attribute or set it to `"false"` to disable that treatment. The mesh
is drawn by the panel glass layer and never intercepts pointer events. Blur is
implemented through inherited optical tokens, so segment geometry remains
crisp and only emitted light is diffused.

## Customizing the treatment

```css
.studio-display {
  --vfd-mesh-line: rgb(0 0 0 / 55%);
  --vfd-mesh-opacity: 0.38;
  --vfd-optical-blur-soft: 1px;
  --vfd-optical-blur-strong: 4px;
}
```

The blur tokens are normally set automatically by
`data-vfd-blur="true"`. Override them inside a more specific application class
when a display needs a different glass diffusion.
