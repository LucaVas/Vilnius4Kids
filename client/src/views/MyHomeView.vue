<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';

const favoritePlaygrounds = ref<PlaygroundSelectWithAddress[]>([]);

async function removeFromPlaygrounds(id: number) {
  await trpc.playground.deleteFavoritePlayground.mutate({ id });
  favoritePlaygrounds.value = favoritePlaygrounds.value.filter((p) => p.id !== id);
}

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getFavoritePlaygrounds.query();
  favoritePlaygrounds.value = playgrounds;
});
</script>

<template>
  <div class="h-full w-full">
    <div
      v-if="favoritePlaygrounds.length > 0"
      class="grid grid-flow-row grid-cols-1 justify-items-center gap-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <PlaygroundCard
        v-for="playground in favoritePlaygrounds"
        :key="playground.id"
        :playground="playground"
        @delete="removeFromPlaygrounds(playground.id)"
      />
    </div>
    <EmptyCard v-else />
  </div>
</template>
