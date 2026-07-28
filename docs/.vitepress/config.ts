import { defineConfig } from 'vitepress';

const componentItems = [
  { link: '/reference/segment-display', text: 'SegmentDisplay' },
  { link: '/reference/segment-cell', text: 'SegmentCell' },
  { link: '/reference/character-map', text: 'CharacterMap' },
  { link: '/reference/text-scroller', text: 'TextScroller' },
  { link: '/reference/spinner', text: 'Spinner' },
  { link: '/reference/indicator', text: 'Indicator' },
  { link: '/reference/spectrum-meter', text: 'SpectrumMeter' },
  { link: '/reference/volume-meter', text: 'VolumeMeter' },
  { link: '/reference/peak-level-meter', text: 'PeakLevelMeter' },
  { link: '/reference/balance-meter', text: 'BalanceMeter' },
  { link: '/reference/physical-button', text: 'Physical buttons' },
  { link: '/reference/optical-effects', text: 'Optical effects' },
  { link: '/reference/presets', text: 'Presets' },
];

export default defineConfig({
  base: '/vfd-console/',
  description:
    'Framework-agnostic VFD interface components inspired by AmberConsole.',
  head: [['meta', { content: '#020809', name: 'theme-color' }]],
  ignoreDeadLinks: [/^\/demo\//],
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/haskou/vfd-console/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },
    nav: [
      { link: '/getting-started', text: 'Getting Started' },
      { link: '/components', text: 'Guide' },
      { link: '/reference/', text: 'Reference' },
      {
        link: 'https://haskou.github.io/vfd-console/demo/',
        target: '_blank',
        text: 'Live Demo',
      },
    ],
    search: {
      provider: 'local',
    },
    sidebar: [
      {
        items: [
          { link: '/getting-started', text: 'Installation & quick start' },
          { link: '/components', text: 'Component overview' },
        ],
        text: 'Getting Started',
      },
      {
        items: [
          { link: '/theming', text: 'Theming' },
          { link: '/css-api', text: 'CSS API' },
          { link: '/accessibility', text: 'Accessibility' },
          { link: '/style-guide', text: 'Style guide' },
        ],
        text: 'Guides',
      },
      {
        items: [
          { link: '/reference/', text: 'API catalog' },
          ...componentItems,
        ],
        text: 'Reference',
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/haskou/vfd-console',
      },
    ],
  },
  title: 'VFDConsole',
});
