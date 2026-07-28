<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { PeakLevelMeter } from '../../../../src/core/PeakLevelMeter';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const left = ref(7);
const right = ref(9);
let meter: PeakLevelMeter;

onMounted(() => {
  meter = new PeakLevelMeter(host.value!, {
    clippingFrom: 10,
    labels: [
      '-∞',
      '-20',
      '-15',
      '-10',
      '-7',
      '-5',
      '-3',
      '-1',
      '0',
      '+1',
      '+3',
      '+8',
    ],
    segments: 12,
    warningFrom: 8,
  });
  update();
});

function update(): void {
  meter.setLevels(left.value, right.value);
}
</script>

<template>
  <DemoFrame>
    <div ref="host" />
    <template #controls>
      <label>
        Left {{ left }}
        <input
          v-model.number="left"
          max="12"
          min="0"
          type="range"
          @input="update"
        />
      </label>
      <label>
        Right {{ right }}
        <input
          v-model.number="right"
          max="12"
          min="0"
          type="range"
          @input="update"
        />
      </label>
      <button class="vfd-physical-button" type="button" @click="meter.test()">
        TEST
      </button>
      <button class="vfd-physical-button" type="button" @click="meter.clear()">
        CLEAR
      </button>
    </template>
  </DemoFrame>
</template>
