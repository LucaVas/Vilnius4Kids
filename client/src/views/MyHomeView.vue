<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type BarePlayground } from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';

const favoritePlaygrounds = ref<BarePlayground[]>([]);
const countOfPlaygrounds = ref(0);

onBeforeMount(async () => {
  const { playgrounds, count } = await trpc.playground.getPlaygrounds.query();
  favoritePlaygrounds.value = playgrounds;
  countOfPlaygrounds.value = count;
});
</script>

<template>
  <div>
    <div v-if="countOfPlaygrounds > 0">
      <PlaygroundCard
        v-for="playground in favoritePlaygrounds"
        :key="playground.id"
        :playground="playground"
        :isEmptyCard="countOfPlaygrounds === 0"
      />
    </div>
    <EmptyCard />
  </div>
</template>
