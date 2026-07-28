import { access, readFile } from 'node:fs/promises';

const expectedJavaScriptExports = [
  'BalanceMeter',
  'CharacterMap',
  'Indicator',
  'PeakLevelMeter',
  'SEGMENTS',
  'SegmentCell',
  'SegmentDisplay',
  'SpectrumMeter',
  'Spinner',
  'TextScroller',
  'VFD_COLORS',
  'VFD_PRESETS',
  'VolumeMeter',
  'applyPreset',
  'isVfdColor',
];

const packageRoot = new URL('../', import.meta.url);
const packageJsonUrl = new URL('package.json', packageRoot);
const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8'));
const publicModule = await import(packageJson.name);
const actualJavaScriptExports = Object.keys(publicModule).sort();

if (
  JSON.stringify(actualJavaScriptExports) !==
  JSON.stringify(expectedJavaScriptExports.sort())
) {
  throw new Error(
    `Unexpected public JavaScript exports: ${actualJavaScriptExports.join(', ')}`,
  );
}

for (const [subpath, target] of Object.entries(packageJson.exports)) {
  const targets = typeof target === 'string' ? [target] : Object.values(target);

  for (const exportedFile of new Set(targets)) {
    await access(new URL(exportedFile, packageRoot));
  }

  if (subpath.startsWith('./css')) {
    const [exportedFile] = targets;
    const stylesheet = await readFile(
      new URL(exportedFile, packageRoot),
      'utf8',
    );

    if (stylesheet.trim().length === 0) {
      throw new Error(`CSS export ${subpath} is empty.`);
    }
  }
}

process.stdout.write('Public package contract is valid.\n');
