<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { CharacterMap } from '../../../../src/core/CharacterMap';
import { SegmentCell } from '../../../../src/core/SegmentCell';

import DemoFrame from './DemoFrame.vue';

const host = ref<HTMLElement | null>(null);
const character = ref('R');
const map = new CharacterMap();
const names = computed(() => [...map.segmentsFor(character.value)].join(', '));
let cell: SegmentCell;

onMounted(() => {
  cell = new SegmentCell(map);
  cell.setColor('green');
  host.value!.append(cell.element);
  update();
});

function update(): void {
  cell.setCharacter(character.value.slice(0, 1).toUpperCase());
}
</script>

<template>
  <DemoFrame>
    <div ref="host" class="vfd-playground__cell" />
    <p class="vfd-playground__readout">{{ names || 'No active segments' }}</p>
    <template #controls>
      <label>
        Character
        <input v-model="character" maxlength="1" @input="update" />
      </label>
    </template>
  </DemoFrame>
</template>
