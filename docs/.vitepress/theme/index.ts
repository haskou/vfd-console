import type { Theme } from 'vitepress';

import DefaultTheme from 'vitepress/theme';

import '../../../src/css/index.css';
import './style.css';
import BalanceMeterDemo from './demos/BalanceMeterDemo.vue';
import CharacterMapDemo from './demos/CharacterMapDemo.vue';
import IndicatorDemo from './demos/IndicatorDemo.vue';
import OpticalEffectsDemo from './demos/OpticalEffectsDemo.vue';
import PeakLevelMeterDemo from './demos/PeakLevelMeterDemo.vue';
import PhysicalButtonDemo from './demos/PhysicalButtonDemo.vue';
import PresetsDemo from './demos/PresetsDemo.vue';
import SegmentCellDemo from './demos/SegmentCellDemo.vue';
import SegmentDisplayDemo from './demos/SegmentDisplayDemo.vue';
import SpectrumMeterDemo from './demos/SpectrumMeterDemo.vue';
import SpinnerDemo from './demos/SpinnerDemo.vue';
import TextScrollerDemo from './demos/TextScrollerDemo.vue';
import VolumeMeterDemo from './demos/VolumeMeterDemo.vue';

export default {
  enhanceApp({ app }) {
    app.component('BalanceMeterDemo', BalanceMeterDemo);
    app.component('CharacterMapDemo', CharacterMapDemo);
    app.component('IndicatorDemo', IndicatorDemo);
    app.component('OpticalEffectsDemo', OpticalEffectsDemo);
    app.component('PeakLevelMeterDemo', PeakLevelMeterDemo);
    app.component('PhysicalButtonDemo', PhysicalButtonDemo);
    app.component('PresetsDemo', PresetsDemo);
    app.component('SegmentCellDemo', SegmentCellDemo);
    app.component('SegmentDisplayDemo', SegmentDisplayDemo);
    app.component('SpectrumMeterDemo', SpectrumMeterDemo);
    app.component('SpinnerDemo', SpinnerDemo);
    app.component('TextScrollerDemo', TextScrollerDemo);
    app.component('VolumeMeterDemo', VolumeMeterDemo);
  },
  extends: DefaultTheme,
} satisfies Theme;
