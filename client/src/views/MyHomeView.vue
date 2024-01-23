<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';

const favoritePlaygrounds = ref<PlaygroundSelectWithAddress[]>([]);

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getFavoritePlaygrounds.query();
  favoritePlaygrounds.value = playgrounds;
});
</script>

<template>
  <div class="h-full w-full">
    <div
      v-if="favoritePlaygrounds.length > 0"
      class="grid justify-items-center grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-auto"
    >
      <PlaygroundCard
        v-for="playground in favoritePlaygrounds"
        :key="playground.id"
        :playground="playground"
      />
    </div>
    <EmptyCard v-else />
  </div>
</template>
