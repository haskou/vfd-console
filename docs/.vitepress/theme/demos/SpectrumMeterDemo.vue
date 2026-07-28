<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SpectrumMeter } from '../../../../src/core/SpectrumMeter';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const levels = ref([4, 7, 10, 7, 3]);
const testing = ref(false);
let meter: SpectrumMeter;

onMounted(() => {
  meter = new SpectrumMeter(host.value!, {
    columns: 5,
    labels: ['63', '250', '1K', '4K', '16K'],
    segments: 12,
    zones: [
      { color: 'primary', from: 0, to: 7 },
      { color: 'yellow', from: 8, to: 9 },
      { color: 'red', from: 10, to: 11 },
    ],
  });
  update();
});

function update(): void {
  testing.value = false;
  meter.setLevels(levels.value);
}

function randomize(): void {
  levels.value = levels.value.map(() => Math.floor(Math.random() * 13));
  update();
}

function toggleTest(): void {
  testing.value = !testing.value;
  meter.setLevels(testing.value ? levels.value.map(() => 12) : levels.value);
}
</script>

<template>
  <DemoFrame>
    <div ref="host" class="vfd-playground__spectrum" />
    <template #controls>
      <label v-for="(_, index) in levels" :key="index">
        Band {{ index + 1 }}
        <input
          v-model.number="levels[index]"
          max="12"
          min="0"
          type="range"
          @input="update"
        />
      </label>
      <button class="vfd-physical-button" type="button" @click="randomize">
        RANDOMIZE
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="testing"
        @click="toggleTest"
      >
        {{ testing ? 'EXIT TEST' : 'TEST' }}
      </button>
    </template>
  </DemoFrame>
</template>
