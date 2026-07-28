<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { SegmentDisplay } from '../../../../src/core/SegmentDisplay';
import { TextScroller } from '../../../../src/core/TextScroller';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const text = ref('LONG TRACK TITLE');
let scroller: TextScroller;

onMounted(() => {
  const display = new SegmentDisplay(host.value!, { cells: 12 });
  scroller = new TextScroller(display, {
    interval: 260,
    text: text.value,
  });
  scroller.start();
});
onUnmounted(() => scroller.destroy());
</script>

<template>
  <DemoFrame>
    <div ref="host" />
    <template #controls>
      <label>
        Text
        <input v-model="text" @input="scroller.setText(text.toUpperCase())" />
      </label>
      <button
        class="vfd-physical-button"
        type="button"
        @click="scroller.start()"
      >
        START
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        @click="scroller.pause()"
      >
        PAUSE
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        @click="scroller.step()"
      >
        STEP
      </button>
    </template>
  </DemoFrame>
</template>
