<script setup lang="ts">
import { FwbModal, FwbButton } from 'flowbite-vue';

defineProps({
  playgroundId: {
    type: Number,
    required: true,
  },
});

defineEmits(['close', 'delete']);
</script>
<template>
  <FwbModal size="md" @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">Playground #{{ playgroundId }}</div>
    </template>

    <template #body>
      <svg
        class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <h3 class="mb-5 text-center text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you sure you want to delete this playground?
      </h3>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <FwbButton @click="$emit('close')" color="purple" outline> Cancel </FwbButton>
        <FwbButton @click="$emit('delete')" color="purple"> Delete </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
