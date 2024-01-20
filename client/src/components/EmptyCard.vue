<script setup lang="ts">
import { FwbCard } from 'flowbite-vue';
</script>

<template>
  <FwbCard
    img-alt="Void"
    img-src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
    variant="image"
  >
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        No favorite playground yet
      </h5>
      <p class="font-normal text-gray-700 dark:text-gray-400">Click to add a new playground</p>
    </div>
  </FwbCard>
</template>
