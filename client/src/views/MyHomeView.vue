<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';
import { FwbSpinner } from 'flowbite-vue';

const favoritePlaygrounds = ref<PlaygroundSelectWithAddress[]>([]);
const pageLoaded = ref(false);

async function removeFromPlaygrounds(id: number) {
  await trpc.playground.deleteFavoritePlayground.mutate({ id });
  favoritePlaygrounds.value = favoritePlaygrounds.value.filter((p) => p.id !== id);
}

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getFavoritePlaygrounds.query();
  favoritePlaygrounds.value = playgrounds;
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="!pageLoaded" class="flex h-full items-center justify-center">
    <FwbSpinner size="12" />
  </div>
  <div v-else class="px-2">
    <div
      v-if="favoritePlaygrounds.length > 0"
      class="grid grid-flow-row grid-cols-1 justify-items-center gap-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <PlaygroundCard
        v-for="playground in favoritePlaygrounds"
        :key="playground.id"
        :playground="playground"
        data-testid="playground-card"
        @delete="removeFromPlaygrounds(playground.id)"
      />
    </div>
    <EmptyCard v-else />
  </div>
</template>
