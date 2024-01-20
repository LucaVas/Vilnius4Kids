<script setup lang="ts">
import { FwbCard, FwbButton } from 'flowbite-vue';
import { type BarePlayground } from '../../../server/src/entities/playground/schema';

defineProps<{
  playground: BarePlayground;
}>();
</script>

<template>
  <FwbCard
    img-alt="Desk"
    img-src="https://flowbite.com/docs/images/blog/image-1.jpg"
    variant="image"
  >
    <FwbButton
      component="RouterLink"
      tag="router-link"
      :href="{ name: 'Playground', params: { id: playground.id } } as any"
      class="pr-3"
    >
      <div class="p-5">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{  playground.id }}
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
          chronological order.
        </p>
      </div>
    </FwbButton>
  </FwbCard>
</template>
