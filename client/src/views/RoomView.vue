<script setup lang="ts">
import Canvaz from '@/components/Canvaz.vue';
import ItemDetailsForm from '@/components/ItemDetailsForm.vue';
import { ref } from 'vue';

const canvasId = ref('canvasId');
</script>

<template>
  <ItemDetailsForm></ItemDetailsForm>

  <Canvaz
    :canvas-id="canvasId"
    class="canvas-style w-full cursor-crosshair rounded-sm border-2 border-gray-800"
  ></Canvaz>
</template>

<style scoped>
.canvas-style {
  height: 70vh !important;
  background-color: rgba(128, 128, 128, 0.117);
}
</style>
