<script setup lang="ts">
import { FwbCarousel, FwbSpinner } from 'flowbite-vue';
import { onBeforeMount, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePlaygroundStore } from '../stores/playgroundsStore';
import PlaygroundBadges from '@/components/PlaygroundBadges.vue';
import PlaygroundDescription from '@/components/PlaygroundDescription.vue';
import PlaygroundAddress from '@/components/PlaygroundAddress.vue';
import PlaygroundButtons from '@/components/PlaygroundButtons.vue';
import PlaygroundWarnings from '@/components/PlaygroundWarnings.vue';

const route = useRoute();
const playgroundId = Number(route.params.id);
const playgroundStore = usePlaygroundStore();

onBeforeMount(async () => {
  playgroundStore.populate(playgroundId);
});

onUnmounted(() => {
  playgroundStore.$reset();
});
</script>

<template>
  <div v-if="!playgroundStore.isPageLoaded || !playgroundStore.openPlayground">
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
  <div
    v-else
    class="flex h-full w-full flex-col gap-4 p-4"
    data-testid="playground-view-card"
  >
    <FwbCarousel
      :pictures="playgroundStore.pictures"
      slide
      :slide-interval="5000"
    />

    <PlaygroundBadges />

    <PlaygroundAddress />

    <PlaygroundWarnings />

    <PlaygroundDescription />

    <PlaygroundButtons />
  </div>
</template>
