<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';
import EmptyCard from '@/components/EmptyCard.vue';
import PlaygroundCard from '@/components/PlaygroundCard.vue';
import { FwbSpinner, FwbAlert } from 'flowbite-vue';

const favoritePlaygrounds = ref<PlaygroundSelectWithAddress[]>([]);
const isUserVerified = ref(true);
const pageLoaded = ref(false);

async function removeFromPlaygrounds(id: number) {
  await trpc.playground.deleteFavoritePlayground.mutate({ id });
  favoritePlaygrounds.value = favoritePlaygrounds.value.filter((p) => p.id !== id);
}

onBeforeMount(async () => {
  const [{ playgrounds }, { isVerified }] = await Promise.all([
    await trpc.playground.getFavoritePlaygrounds.query(),
    await trpc.user.isUserVerified.query(),
  ]);

  isUserVerified.value = isVerified;
  favoritePlaygrounds.value = playgrounds;
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="!pageLoaded">
    <FwbSpinner size="12" color="purple" class="absolute top-1/4" />
  </div>
  <div v-else class="w-full overflow-auto p-3">
    <div v-if="favoritePlaygrounds.length > 0" class="flex flex-col gap-4">
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
