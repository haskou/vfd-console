<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Indicator } from '../../../../src/core/Indicator';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const active = ref(false);
let indicator: Indicator;

onMounted(() => {
  indicator = new Indicator(host.value!, { color: 'yellow' });
});

function toggle(): void {
  active.value = !active.value;
  indicator.setActive(active.value);
}
</script>

<template>
  <DemoFrame>
    <span ref="host">REPEAT</span>
    <template #controls>
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="active"
        @click="toggle"
      >
        TOGGLE
      </button>
    </template>
  </DemoFrame>
</template>
