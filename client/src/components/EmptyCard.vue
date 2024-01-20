<script setup lang="ts">
import { FwbCard, FwbButton } from 'flowbite-vue';
</script>

<template>
  <FwbCard
    img-alt="Void"
    img-src="https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
    variant="image"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between p-5">
      <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        No favorite playgrounds yet
      </h5>
      <FwbButton
        component="RouterLink"
        tag="router-link"
        class="pr-3"
        >Add new</FwbButton
      >
      <!--         :href="{ name: 'Playground', params: { id: playground.id } } as any" -->
    </div>
  </FwbCard>
</template>
