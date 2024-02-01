<script setup lang="ts">
import { FwbButton } from 'flowbite-vue';
</script>

<template>
  <div
    class="flex max-w-sm flex-col rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
  >
    <img class="rounded-t-lg p-10" size="sm" src="../assets/void.svg" alt="image of void" />
    <div class="flex flex-col items-center justify-center gap-4 px-2 pb-4">
      <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        No playgrounds saved yet
      </h5>
      <div class="flex items-center justify-between">
        <FwbButton
          component="RouterLink"
          tag="router-link"
          color="purple"
          size="lg"
          :href="{ name: 'Playgrounds' } as any"
          >Add new</FwbButton
        >
      </div>
    </div>
  </div>
</template>
