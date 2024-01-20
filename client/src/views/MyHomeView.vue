<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import {
  type BarePlayground,
} from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';

const favoritePlaygrounds = ref<BarePlayground[]>([]);
// const testFavoritePlaygrounds = ref<PlaygroundSelect[]>([
//   {
//     id: 1,
//     isPrivate: false,
//     isOpen: true,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     address: {
//       id: 1,
//       number: 123,
//       street: 'Main St',
//       city: 'San Francisco',
//       zipCode: 94111,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       users: [],
//       playground: undefined as unknown as Playground
//     },
//   },
// ]);

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getFavoritePlaygrounds.query();
  favoritePlaygrounds.value = playgrounds;
});
</script>

<template>
  <div>
    <div v-if="favoritePlaygrounds.length > 0">
      <PlaygroundCard v-for="playground in favoritePlaygrounds" :key="playground.id" :playground="playground" />
    </div>
    <EmptyCard v-else />
  </div>
</template>
