<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SegmentDisplay } from '../../../../src/core/SegmentDisplay';
import { applyPreset, type VfdPreset } from '../../../../src/presets/Presets';

import DemoFrame from './DemoFrame.vue';

const panel = ref<HTMLElement | null>(null);
const host = ref<HTMLElement | null>(null);
const preset = ref<VfdPreset>('aiwa');

onMounted(() => {
  const display = new SegmentDisplay(host.value!, { cells: 10 });
  display.setText('PRESET');
});

function update(): void {
  applyPreset(panel.value!, preset.value);
}
</script>

<template>
  <section class="vfd-playground">
    <div ref="panel" class="vfd-panel" data-vfd-preset="aiwa">
      <div ref="host" />
    </div>
    <div class="vfd-playground__controls">
      <label>
        Preset
        <select v-model="preset" @change="update">
          <option value="aiwa">Aiwa</option>
          <option value="sony">Sony</option>
          <option value="technics">Technics</option>
        </select>
      </label>
    </div>
  </section>
</template>
