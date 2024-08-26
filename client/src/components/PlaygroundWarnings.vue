<script setup lang="ts">
import { FwbAlert } from 'flowbite-vue';
import { usePlaygroundStore } from '@/stores/playgroundsStore';

const playgroundStore = usePlaygroundStore();
</script>

<template>
  <div id="warning_messages" v-if="playgroundStore.openPlayground">
    <FwbAlert
      v-if="
        playgroundStore.ratingScheme.count !== 0 &&
        playgroundStore.ratingScheme.rating <= 3.5 &&
        playgroundStore.ratingScheme.rating > 2.5
      "
      closable
      icon
      type="warning"
    >
      Playground with moderate risk of injury.
    </FwbAlert>
    <FwbAlert
      v-if="playgroundStore.ratingScheme.count !== 0 && playgroundStore.ratingScheme.rating <= 2.5"
      closable
      icon
      type="danger"
    >
      Playground with high risk of injury.
    </FwbAlert>
  </div>
</template>
