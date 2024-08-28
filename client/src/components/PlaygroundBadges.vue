<script setup lang="ts">
import { usePlaygroundStore } from '@/stores/playgroundsStore';
import RatingStars from '@/components/RatingStars.vue';
import { FwbBadge, FwbP, FwbAlert } from 'flowbite-vue';
import { ref } from 'vue';
import { isLoggedIn } from '@/stores/user';
import AppAuthenticateModal from '@/components/AppAuthenticateModal.vue';

const playgroundStore = usePlaygroundStore();

const ratingErrorMessage = ref('');
const isAuthModalOpen = ref(false);
const rate = async (rating: number) => {
  if (isLoggedIn.value) {
    const msg = await playgroundStore.ratePlayground(rating);
    if (msg) ratingErrorMessage.value = msg;
  } else {
    isAuthModalOpen.value = true;
  }
};
</script>

<template>
  <FwbAlert
    icon
    type="danger"
    v-if="ratingErrorMessage"
    data-testid="ratingErrorMessage"
  >
    {{ ratingErrorMessage }}
  </FwbAlert>

  <div
    v-if="playgroundStore.openPlayground"
    class="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
    id="badges"
  >
    <div class="flex flex-row justify-evenly gap-2">
      <FwbBadge size="sm" type="indigo">{{
        playgroundStore.openPlayground.address.district
      }}</FwbBadge>
      <FwbBadge
        v-if="playgroundStore.openPlayground.isOpen"
        class="ml-2"
        size="sm"
        type="green"
        >Open</FwbBadge
      >
      <FwbBadge v-else class="ml-2" size="sm" type="red">Closed</FwbBadge>
    </div>
    <div class="flex flex-row justify-evenly">
      <RatingStars
        @rate="(rating) => rate(rating)"
        data-testid="rating-stars"
        :playgroundId="playgroundStore.openPlayground.id"
        :ratingScheme="playgroundStore.ratingScheme"
      ></RatingStars>
      <FwbP class="ml-2 text-sm font-bold text-gray-900 dark:text-white">{{
        playgroundStore.ratingScheme.rating.toFixed(2)
      }}</FwbP>
      <FwbP class="ml-2 text-sm text-gray-900 dark:text-white"
        >&#183; {{ playgroundStore.ratingScheme.count }} rates
      </FwbP>
    </div>
  </div>

  <AppAuthenticateModal
    :isOpen="isAuthModalOpen"
    @close="isAuthModalOpen = false"
    >If you wish to rate this playground, you must log in
    or create an account.</AppAuthenticateModal
  >
</template>
