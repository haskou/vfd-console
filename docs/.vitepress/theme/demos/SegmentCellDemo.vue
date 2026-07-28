<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { SegmentCell } from '../../../../src/core/SegmentCell';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const character = ref('A');
let cell: SegmentCell;

onMounted(() => {
  cell = new SegmentCell();
  cell.setColor('primary');
  cell.setCharacter(character.value);
  host.value!.append(cell.element);
});

function update(): void {
  cell.setCharacter(character.value.slice(0, 1).toUpperCase());
}
</script>

<template>
  <DemoFrame>
    <div ref="host" class="vfd-playground__cell" />
    <template #controls>
      <label>
        Character
        <input v-model="character" maxlength="1" @input="update" />
      </label>
      <button class="vfd-physical-button" type="button" @click="cell.test()">
        TEST
      </button>
      <button class="vfd-physical-button" type="button" @click="cell.clear()">
        CLEAR
      </button>
    </template>
  </DemoFrame>
</template>
