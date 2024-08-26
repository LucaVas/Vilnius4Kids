<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundsStore';

const playgroundStore = usePlaygroundStore();
</script>

<template>
  <div class="mb-4" v-if="playgroundStore.openPlayground">
    <p v-if="playgroundStore.openPlayground.description" class="text-base leading-7 text-gray-900">
      {{ playgroundStore.openPlayground.description }}
    </p>

    <div v-else role="status" class="max-w-full space-y-4">
      <p>No description available.</p>
    </div>
  </div>
</template>
