import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('CSS component contract', () => {
  it('inherits animated spectrum levels into permanent segment nodes', async () => {
    const stylesheet = await readFile(resolve('src/css/meters.css'), 'utf8');

    expect(stylesheet).toMatch(
      /@property --vfd-level\s*{[^}]*inherits:\s*true;/s,
    );
  });

  it('switches 14-segment characters without CSS animation', async () => {
    const stylesheet = await readFile(resolve('src/css/segments.css'), 'utf8');

    expect(stylesheet).not.toContain(
      'background-color var(--vfd-step-duration)',
    );
    expect(stylesheet).not.toContain('opacity var(--vfd-step-duration)');
  });

  it('exposes independent mesh and optical blur panel treatments', async () => {
    const stylesheet = await readFile(resolve('src/css/glass.css'), 'utf8');

    expect(stylesheet).toContain(".vfd-panel[data-vfd-blur='true']");
    expect(stylesheet).toContain(".vfd-panel[data-vfd-mesh='true']::after");
  });

  it('uses a dedicated illuminated pilot for latched physical buttons', async () => {
    const stylesheet = await readFile(resolve('src/css/controls.css'), 'utf8');

    expect(stylesheet).toContain(
      ".vfd-physical-button[aria-pressed='true']::before",
    );
    expect(stylesheet).toContain(".vfd-physical-button[data-color='red']");
    expect(stylesheet).not.toContain('.vfd-physical-button:hover');
  });

  it('removes meter label glow while the panel is powered off', async () => {
    const stylesheet = await readFile(resolve('src/css/meters.css'), 'utf8');

    expect(stylesheet).toContain(
      ".vfd-panel[data-powered='false'] .vfd-peak-meter__channel-label",
    );
    expect(stylesheet).toContain(
      ".vfd-panel[data-powered='false'] .vfd-balance-meter__label",
    );
  });
});
