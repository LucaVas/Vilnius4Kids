<script setup lang="ts">
import { FwbCard, FwbButton } from 'flowbite-vue';
</script>

<template>
  <!-- <FwbCard img-alt="Void" img-src="src/assets/void.svg" variant="image">
    <div class="flex flex-col items-center justify-between p-4 sm:flex-row">
      <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        No favorite playgrounds yet
      </h5>
      <FwbButton
        component="RouterLink"
        tag="router-link"
        class="pr-3"
        :href="{ name: 'Playgrounds' } as any"
        >Add new</FwbButton
      >
    </div>
  </FwbCard> -->

  <div
    class="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
  >
    <img class="rounded-t-lg p-10" src="../assets/void.svg" alt="image of void" />
    <div class="flex flex-col justify-center items-center gap-4 px-5 pb-5">
      <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        No playgrounds saved yet
      </h5>
      <div class="flex items-center justify-between">
        <FwbButton
          component="RouterLink"
          tag="router-link"
          color="purple"
          size="xl"
          :href="{ name: 'Playgrounds' } as any"
          >Add new</FwbButton
        >
      </div>
    </div>
  </div>
</template>
