# Getting Started

VFDConsole separates physical panel structure from animated display content:

- Your HTML defines the panel, labels, indicator positions, and component hosts.
- VFDConsole creates fixed segment cells and meter blocks inside those hosts.
- Your application coordinates playback, brightness, display tests, and power.
- CSS owns the visual response to component and application state.

This keeps the DOM stable while text, meter levels, and indicators change.

## Install

```bash
yarn add @haskou/vfd-console
```

Import the components and complete stylesheet:

```ts
import {
  Indicator,
  SegmentDisplay,
  SpectrumMeter,
  TextScroller,
  VolumeMeter,
} from '@haskou/vfd-console';
import '@haskou/vfd-console/css';
```

## Build the panel

Write the visible panel structure in HTML. Interactive controls should normally
sit outside `.vfd-panel` so they are not mistaken for illuminated display
content.

```html
<main>
  <section class="vfd-panel" data-vfd-preset="aiwa" aria-label="Media display">
    <header class="vfd-header">
      <span>COMPACT DISC</span>
      <span>DIGITAL AUDIO</span>
    </header>

    <div class="vfd-main-readout">
      <div id="track-number"></div>
      <div id="track-title" class="vfd-title-display"></div>
    </div>

    <div class="vfd-indicator-grid">
      <section class="vfd-indicator-group">
        <div class="vfd-indicator-group__label">Transport</div>
        <div class="vfd-indicator-group__items">
          <span id="play-indicator">PLAY</span>
          <span id="pause-indicator">PAUSE</span>
        </div>
      </section>
    </div>

    <div id="spectrum"></div>

    <footer class="vfd-footer">
      <div id="volume"></div>
    </footer>
  </section>

  <div class="player-controls" aria-label="Display controls">
    <button id="power" type="button" aria-pressed="true">Power</button>
    <button id="play" type="button" aria-pressed="true">Play</button>
  </div>
</main>
```

Create one component instance per host:

```ts
function requiredElement(selector: string): HTMLElement {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

const panel = requiredElement('.vfd-panel');
const trackNumber = new SegmentDisplay(requiredElement('#track-number'), {
  cells: 2,
  color: 'primary',
  ariaLabel: 'Current track',
});
const trackTitle = new SegmentDisplay(requiredElement('#track-title'), {
  cells: 18,
  color: 'primary',
  ariaLabel: 'Current track title',
});
const titleScroller = new TextScroller(trackTitle, {
  text: 'MIDNIGHT SIGNAL',
  interval: 320,
  padding: 3,
  loop: true,
});
const playIndicator = new Indicator(requiredElement('#play-indicator'), {
  activeLabel: 'Playing',
  inactiveLabel: 'Not playing',
});
const pauseIndicator = new Indicator(requiredElement('#pause-indicator'), {
  activeLabel: 'Paused',
  inactiveLabel: 'Not paused',
});
const spectrum = new SpectrumMeter(requiredElement('#spectrum'), {
  columns: 10,
  segments: 12,
  labels: ['63', '125', '250', '500', '1k', '2k', '4k', '8k', '12k', '16k'],
});
const volume = new VolumeMeter(requiredElement('#volume'), {
  segments: 16,
  warningFrom: 11,
  clippingFrom: 14,
});

trackNumber.setText('07');
titleScroller.start();
playIndicator.setActive(true);
spectrum.setLevels([3, 5, 8, 10, 9, 7, 5, 4, 3, 2]);
volume.setValue(10);
```

## Coordinate application state

Components intentionally do not guess how a player works. Keep one
application-level state and update every display component from it. Powering
the panel off should pause timed work, clear illuminated components, preserve
the mounted inactive geometry, and update the visual panel state:

```ts
let poweredOn = true;
let playing = true;

function renderState(): void {
  panel.setAttribute('data-powered', String(poweredOn));

  if (!poweredOn) {
    titleScroller.pause();
    trackNumber.clear();
    trackTitle.clear();
    playIndicator.setActive(false);
    pauseIndicator.setActive(false);
    spectrum.clear();
    volume.clear();
    return;
  }

  trackNumber.setText('07');
  titleScroller.start();
  playIndicator.setActive(playing);
  pauseIndicator.setActive(!playing);
}
```

Use the same coordination rule for display tests: pause normal timers when the
test toggle is enabled, call each component's `test()` method, and keep that
state active until the user disables the toggle. Then restore the previous
application state.

Brightness can be set for a complete panel:

```ts
panel.style.setProperty('--vfd-brightness', '0.7');
```

## Clean up

Stop timer-based components when their panel leaves the page:

```ts
titleScroller.destroy();
```

Displays, indicators, and meters do not schedule their own updates. They change
only when the application calls them.

## Next steps

- Use the [component API](./components.md) to update text, indicators, and meters.
- Use the [CSS API](./css-api.md) to compose panels and add custom styling.
- Use [theming tokens and presets](./theming.md) to change visual identity.
- Follow the [accessibility guide](./accessibility.md) for live regions and
  external controls.
