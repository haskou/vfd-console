<script setup lang="ts">
import { ref } from 'vue';

import DemoFrame from './DemoFrame.vue';

const repeat = ref(false);
const power = ref(true);
</script>

<template>
  <DemoFrame>
    <div class="vfd-playground__button-bank">
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="power"
        data-color="red"
        @click="power = !power"
      >
        POWER
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="repeat"
        @click="repeat = !repeat"
      >
        REPEAT
      </button>
      <button class="vfd-physical-button" type="button">MOMENTARY</button>
      <button class="vfd-physical-button" disabled type="button">
        DISABLED
      </button>
    </div>
    <template #controls>
      Click the controls to compare latched and momentary travel.
    </template>
  </DemoFrame>
</template>
