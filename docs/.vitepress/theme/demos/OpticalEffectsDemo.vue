<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SegmentDisplay } from '../../../../src/core/SegmentDisplay';

const blur = ref(false);
const host = ref<HTMLElement | null>(null);
const mesh = ref(false);

onMounted(() => {
  const display = new SegmentDisplay(host.value!, { cells: 12 });
  display.setText('VFD OPTICS');
});
</script>

<template>
  <section class="vfd-playground">
    <div
      class="vfd-panel"
      data-vfd-preset="aiwa"
      :data-vfd-blur="blur"
      :data-vfd-mesh="mesh"
    >
      <div ref="host" />
    </div>
    <div class="vfd-playground__controls">
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="mesh"
        @click="mesh = !mesh"
      >
        MESH
      </button>
      <button
        class="vfd-physical-button"
        type="button"
        :aria-pressed="blur"
        @click="blur = !blur"
      >
        BLUR
      </button>
    </div>
  </section>
</template>
