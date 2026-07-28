# VFD interface style guide

## Physical model

A vacuum fluorescent display is a sealed glass envelope containing a heated
cathode, control grids, and phosphor-coated anodes. When an anode is selected,
electrons excite its phosphor and the fixed shape emits light. That shape is
still faintly visible when unpowered. A convincing interface therefore starts
with permanent hardware geometry and changes only which elements are active.

VFDConsole models this directly: character cells own 14 permanent segment
elements, meters own permanent blocks, and labels remain mounted.

The control grid inside real hardware is often visible as a very fine wire
texture, but it does not always read as a honeycomb from outside the envelope.
Its visibility depends on construction, viewing distance, lighting, and the
front filter. Treat the mesh as an optional glass detail rather than a required
overlay on every VFD interface.

The interactive
[standalone component demo](https://haskou.github.io/vfd-console/demo/) is the
visual reference for segment geometry, inactive hardware, grouped indicators,
spectrum zones, presets, and responsive layouts.

## VFD versus other display families

- A VFD has luminous phosphor, visible inactive geometry, strong but compact
  halos, and often several colors in one glass envelope.
- An LCD controls reflected or backlit areas. Its inactive shapes and viewing
  character are different, and the image should not appear self-luminous.
- An LED display uses discrete diodes or modules. It tends toward harder points
  or bars and does not have the same glass-envelope depth.
- A CRT scans an electron beam across a phosphor surface. Scanlines, raster
  distortion, geometric curvature, pixel drift, and animated sweep belong to
  that technology and are intentionally absent here.

## Choosing display geometry

Use seven segments for numbers and a small set of symbols: time, track number,
level, or frequency. Use fourteen segments for compact alphanumeric readouts
where letters such as `K`, `M`, `N`, `R`, `W`, `X`, `Y`, and `Z` require
diagonals. Use a dot matrix only when the real product concept needs a broader
alphabet or variable glyphs. Use dedicated icons for permanent state such as
`PLAY`, `STEREO`, `RDS`, `DOLBY`, and `REPEAT`.

A dedicated indicator should not be faked by writing text into a general
display. Real products reserved physical anodes for common states.

## Inactive hardware

Inactive segments should be visible at roughly 10–20 percent perceived
intensity. Use a hue related to the glass and phosphor, without a bright halo.
Inactive indicator labels should remain readable as hardware but clearly
subordinate to active content.

Do not place ghost copies of complete words behind a scroller. Only physical
segment positions are static. Each scroll step changes the active segments in
those positions.

## Light and halo

Use a sharp core plus one compact glow. The core communicates energized
phosphor; a restrained shadow suggests light scattering through glass.
Excessive blur turns a manufactured display into contemporary neon signage
and makes segment geometry illegible.

VFDConsole therefore keeps optical diffusion opt-in through
`data-vfd-blur="true"`. The fine control-grid treatment is independently
enabled with `data-vfd-mesh="true"`.

Brightness should affect the whole luminous system consistently. Warning and
clipping colors remain semantic even when the main phosphor changes.

## Color hierarchy

Choose one primary phosphor for text, normal meter ranges, and common active
states. Green may indicate a healthy or stereo state. Yellow is a warning or
secondary transport state. Red is reserved for clipping, recording, or a
small number of urgent states.

Historical equipment often mixed phosphors, but it did so with a functional
hierarchy. Avoid arbitrary RGB rainbows. A green preset must not turn clipping
green simply to be monochromatic.

## Indicator organization

Group fixed labels by product language:

- Transport: `PLAY`, `PAUSE`, `REPEAT`, `RANDOM`, `PROGRAM`.
- Source: `CD`, `TAPE`, `TUNER`, `AUX`.
- Sound: `BBE`, `T-BASS`, `GROOVE`, `SURROUND`.
- Radio or tape: `STEREO`, `RDS`, `DOLBY B`, `CrO₂`.

Keep every label present. On narrow screens, reflow complete groups into two
or one column rather than hiding low-priority indicators.

## Discrete motion

Movement is a state sequence, not spatial interpolation. Scroll text by
advancing exactly one character offset and updating the existing cells.
Animate a playback spinner with `|`, `/`, `-`, and `\` at 150–250 ms per
frame. Meters should accept discrete external samples at a deliberately
limited frequency.

Do not use transforms, `requestAnimationFrame`, subpixel movement, or smooth
transitions. CSS state changes use `steps(1, end)`.

## Spectrum analyzers

Build every column and block once. Number zones from the bottom so normal,
warning, and clipping ranges remain easy to configure. Keep inactive blocks
visible. Frequency labels are optional and should align with bands without
pretending that an illustrative demo is calibrated measurement equipment.

## Plausible period layouts

Late-1980s layouts are often sober, relatively sparse, and centered around a
large numeric or frequency readout. During the 1990s, denser indicator banks,
multicolor spectrum analyzers, and named sound modes became common. Early
2000s systems often use cleaner blocks but retain strong transport and source
hierarchy.

Use these tendencies as composition guidance, not as permission to reproduce
trademarks or claim exact historical replicas.

## Inspired by [AmberConsole](https://github.com/DutchDiederik/AmberConsole)

VFDConsole is inspired by
[**AmberConsole**](https://github.com/DutchDiederik/AmberConsole) and its
lightweight, CSS-first approach to reusable display interfaces. It carries
forward the same design philosophy:

- CSS-first visual primitives.
- Modular stylesheets.
- A compact and stable token API.
- Framework-independent components.
- A demo that also serves as a reference implementation.

That philosophy is expressed through the physical vocabulary of a VFD:

- Text uses fixed 14-segment cells.
- Glow belongs to individual illuminated segments.
- Static glass and faint inactive segments communicate the display hardware.
- A primary phosphor color is complemented by green, yellow, and red semantic
  indicators.
- State changes use discrete illumination instead of fluid screen animation.

## Anti-patterns

- Do not move text at subpixel increments.
- Do not move the inactive-segment background.
- Do not rebuild display nodes continuously.
- Do not use excessive blur.
- Do not hide inactive indicators.
- Do not turn the VFD into a generic pixel display.
- Do not use futuristic typefaces instead of physical segments.
- Do not use arbitrary RGB colors without a visual hierarchy.
