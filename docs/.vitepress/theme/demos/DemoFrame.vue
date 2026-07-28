<template>
  <section class="vfd-playground">
    <div class="vfd-panel" data-vfd-preset="aiwa">
      <slot />
    </div>
    <div class="vfd-playground__controls">
      <slot name="controls" />
    </div>
  </section>
</template>
