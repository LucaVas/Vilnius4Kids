<script setup lang="ts">
import PinIcon from '@/components/icons/PinIcon.vue';
import { usePlaygroundStore } from '@/stores/playgroundsStore';
import { FwbP } from 'flowbite-vue';

const playgroundStore = usePlaygroundStore();
</script>

<template>
  <div
    class="flex items-center gap-2"
    id="address"
    data-testid="playground-address"
    v-if="playgroundStore.openPlayground"
  >
    <component :is="PinIcon" />
    <FwbP class="text-sm text-gray-900 dark:text-gray-400">
      {{ playgroundStore.openPlayground.address.street }}
      {{ playgroundStore.openPlayground.address.number }},
      {{ playgroundStore.openPlayground.address.zipCode }} -
      {{ playgroundStore.openPlayground.address.city }}
    </FwbP>
  </div>
</template>
