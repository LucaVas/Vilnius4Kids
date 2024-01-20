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
    <div class="flex flex-row items-center justify-between p-5">
      <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ playground.address.street }} {{ playground.address.number }}
      </h5>

      <FwbButton component="RouterLink" tag="router-link" class="pr-3">View</FwbButton>
      <!--         :href="{ name: 'Playground', params: { id: playground.id } } as any" -->
    </div>
  </FwbCard>
</template>
