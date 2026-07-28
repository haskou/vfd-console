<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { BalanceMeter } from '../../../../src/core/BalanceMeter';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const value = ref(0);
let meter: BalanceMeter;

onMounted(() => {
  meter = new BalanceMeter(host.value!, { segmentsPerSide: 8 });
});
</script>

<template>
  <DemoFrame>
    <div ref="host" />
    <template #controls>
      <label>
        Balance {{ value }}
        <input
          v-model.number="value"
          max="1"
          min="-1"
          step="0.05"
          type="range"
          @input="meter.setBalance(value)"
        />
      </label>
      <button
        class="vfd-physical-button"
        type="button"
        @click="
          value = 0;
          meter.centerBalance();
        "
      >
        CENTER
      </button>
      <button class="vfd-physical-button" type="button" @click="meter.test()">
        TEST
      </button>
    </template>
  </DemoFrame>
</template>
