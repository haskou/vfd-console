<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { VolumeMeter } from '../../../../src/core/VolumeMeter';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const value = ref(10);
let meter: VolumeMeter;

onMounted(() => {
  meter = new VolumeMeter(host.value!, {
    clippingFrom: 14,
    segments: 16,
    warningFrom: 11,
  });
  meter.setValue(value.value);
});
</script>

<template>
  <DemoFrame>
    <div ref="host" />
    <template #controls>
      <label>
        Level {{ value }}
        <input
          v-model.number="value"
          max="16"
          min="0"
          type="range"
          @input="meter.setValue(value)"
        />
      </label>
      <button class="vfd-physical-button" type="button" @click="meter.test()">
        TEST
      </button>
      <button class="vfd-physical-button" type="button" @click="meter.mute()">
        MUTE
      </button>
      <button class="vfd-physical-button" type="button" @click="meter.unmute()">
        UNMUTE
      </button>
    </template>
  </DemoFrame>
</template>
