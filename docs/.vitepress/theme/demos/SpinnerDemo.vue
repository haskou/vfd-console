<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { SegmentCell } from '../../../../src/core/SegmentCell';
import { Spinner } from '../../../../src/core/Spinner';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
let spinner: Spinner;

onMounted(() => {
  const cell = new SegmentCell();
  host.value!.append(cell.element);
  spinner = new Spinner(cell);
  spinner.start();
});
onUnmounted(() => spinner.destroy());
</script>

<template>
  <DemoFrame>
    <div ref="host" class="vfd-playground__cell" />
    <template #controls>
      <button
        class="vfd-physical-button"
        type="button"
        @click="spinner.start()"
      >
        PLAY
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        @click="spinner.pause()"
      >
        PAUSE
      </button>
      <button class="vfd-physical-button" type="button" @click="spinner.stop()">
        STOP
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        @click="spinner.setState('loading')"
      >
        LOAD
      </button>
    </template>
  </DemoFrame>
</template>
