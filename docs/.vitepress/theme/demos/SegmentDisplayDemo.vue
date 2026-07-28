<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SegmentDisplay } from '../../../../src/core/SegmentDisplay';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const text = ref('VFD CONSOLE');
const testing = ref(false);
let display: SegmentDisplay;

onMounted(() => {
  display = new SegmentDisplay(host.value!, { cells: 12 });
  display.setText(text.value);
});

function update(): void {
  testing.value = false;
  display.setText(text.value.toUpperCase());
}

function toggleTest(): void {
  testing.value = !testing.value;

  if (testing.value) {
    display.test();
  } else {
    display.setText(text.value.toUpperCase());
  }
}
</script>

<template>
  <DemoFrame>
    <div ref="host" />
    <template #controls>
      <label
        >Text <input v-model="text" maxlength="12" @input="update"
      /></label>
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="testing"
        @click="toggleTest"
      >
        {{ testing ? 'EXIT TEST' : 'TEST' }}
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        @click="
          testing = false;
          display.clear();
        "
      >
        CLEAR
      </button>
    </template>
  </DemoFrame>
</template>
