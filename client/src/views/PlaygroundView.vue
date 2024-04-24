<script setup lang="ts">
import {
  FwbBadge,
  FwbCarousel,
  FwbSpinner,
  FwbAlert,
  FwbP,
  FwbButtonGroup,
  FwbButton,
} from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import RatingStars from '@/components/RatingStars.vue';
import { TRPCClientError } from '@trpc/client';
import { DEFAULT_SERVER_ERROR } from '@/constants';

const route = useRoute();
const playgroundId = Number(route.params.id);
const pageLoaded = ref(false);
const loadingSave = ref(false);
const isUserVerified = ref(true);
const saved = ref(false);
const currentPlayground = ref();
const ratingScheme = ref({
  rating: 0,
  count: 0,
});

onBeforeMount(async () => {
  const [playground, { count, rating }, { playgrounds }, { isVerified }] = await Promise.all([
    trpc.playground.getPlayground.query({ id: playgroundId }),
    trpc.rating.getRating.query({ id: playgroundId }),
    trpc.playground.getFavoritePlaygrounds.query(),
    trpc.user.isUserVerified.query(),
  ]);

  isUserVerified.value = isVerified;
  currentPlayground.value = playground;
  ratingScheme.value = {
    rating,
    count,
  };
  saved.value = playgrounds.some((p) => p.id === playgroundId);
  pageLoaded.value = true;
});

const pictures = [
  {
    src: 'https://images.pexels.com/photos/9743546/pexels-photo-9743546.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Image 1',
  },
  {
    src: 'https://images.pexels.com/photos/19859154/pexels-photo-19859154/free-photo-of-two-deer-eating-in-the-woods-near-a-tree.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Image 2',
  },
  {
    src: 'https://images.pexels.com/photos/18012333/pexels-photo-18012333/free-photo-of-chairlift.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Image 3',
  },
];

const ratingErrorMessage = ref('');

async function ratePlayground(starRating: number) {
  if (!isUserVerified.value) {
    ratingErrorMessage.value = 'You need to verify your email to rate playgrounds';
    return;
  }

  try {
    await trpc.rating.rate.mutate({
      playgroundId: playgroundId,
      rating: starRating,
    });
  } catch (error) {
    if (error instanceof TRPCClientError) {
      ratingErrorMessage.value = error.data.message || error.message;
    } else {
      ratingErrorMessage.value = DEFAULT_SERVER_ERROR;
    }
  }
}

async function savePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.addFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    saved.value = true;
  }
}

async function removePlaygroundFromFavorites(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.deleteFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    saved.value = false;
  }
}
</script>

<template>
  <div v-if="!pageLoaded">
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
  <div v-else class="mb-4 flex h-full w-full flex-col gap-4" data-testid="playground-view-card">
    <FwbCarousel :pictures="pictures" slide :slide-interval="5000" />
    <div class="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center" id="badges">
      <div class="flex flex-row justify-evenly gap-2">
        <FwbBadge size="sm" type="indigo">{{ currentPlayground.address.district }}</FwbBadge>
        <FwbBadge v-if="currentPlayground.isOpen" class="ml-2" size="sm" type="green"
          >Open</FwbBadge
        >
        <FwbBadge v-else class="ml-2" size="sm" type="red">Closed</FwbBadge>
      </div>
      <div class="flex flex-row justify-evenly">
        <RatingStars
          @rate="ratePlayground"
          data-testid="rating-stars"
          :playgroundId="currentPlayground.id"
          :ratingScheme="ratingScheme"
        ></RatingStars>
        <FwbP class="ml-2 text-sm font-bold text-gray-900 dark:text-white">{{
          ratingScheme.rating.toFixed(2)
        }}</FwbP>
        <FwbP class="ml-2 text-sm text-gray-900 dark:text-white"
          >&#183; {{ ratingScheme.count }} rates
        </FwbP>
      </div>
    </div>
    <div class="flex items-center gap-2" id="address" data-testid="playground-address">
      <div>
        <svg
          class="h-6 w-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <FwbP class="text-sm text-gray-900 dark:text-gray-400">
        {{ currentPlayground.address.street }} {{ currentPlayground.address.number }},
        {{ currentPlayground.address.zipCode }} -
        {{ currentPlayground.address.city }}
      </FwbP>
    </div>
    <div id="warning_messages">
      <FwbAlert icon type="danger" v-if="ratingErrorMessage" data-testid="ratingErrorMessage">
        {{ ratingErrorMessage }}
      </FwbAlert>
      <FwbAlert
        v-if="ratingScheme.count !== 0 && ratingScheme.rating <= 3.5 && ratingScheme.rating > 2.5"
        closable
        icon
        type="warning"
      >
        Playground with moderate risk of injury.
      </FwbAlert>
      <FwbAlert
        v-if="ratingScheme.count !== 0 && ratingScheme.rating <= 2.5"
        closable
        icon
        type="danger"
      >
        Playground with high risk of injury.
      </FwbAlert>
    </div>
    <div class="mb-4 px-4">
      <FwbP v-if="currentPlayground.description" class="text-base leading-7 text-gray-900">
        {{ currentPlayground.description }}
      </FwbP>

      <div v-else role="status" class="max-w-full animate-pulse space-y-4">
        <FwbP>No description available.</FwbP>
        <div class="flex w-full max-w-[15rem] items-center sm:max-w-5xl">
          <div class="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="ms-2 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="flex w-full max-w-[10rem] items-center sm:max-w-lg">
          <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="flex w-full max-w-[13rem] items-center sm:max-w-xl">
          <div class="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="flex w-full max-w-[25rem] items-center sm:max-w-4xl">
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="flex w-full max-w-[12rem] items-center sm:max-w-2xl">
          <div class="ms-2 h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="flex w-full max-w-[18rem] items-center sm:max-w-full">
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="ms-2 h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div class="ms-2 h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <FwbButtonGroup class="my-2 flex justify-between gap-2">
      <FwbButton color="dark" outline square @click="$router.go(-1)">Back</FwbButton>
      <FwbButtonGroup class="gap-2">
        <FwbButton
          color="purple"
          v-if="!saved"
          square
          :loading="loadingSave"
          loading-position="suffix"
          @click="savePlayground(currentPlayground.id)"
          ><template #prefix></template>Add to favorites<template #suffix></template
        ></FwbButton>
        <FwbButton
          color="purple"
          v-else
          square
          :loading="loadingSave"
          loading-position="suffix"
          @click="removePlaygroundFromFavorites(currentPlayground.id)"
          ><template #prefix></template>Remove from favorites<template #suffix></template
        ></FwbButton>
        <FwbButton
          color="purple"
          outline
          square
          data-testid="report-button"
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'PlaygroundReport', params: { id: currentPlayground.id } } as any"
          >Report</FwbButton
        ></FwbButtonGroup
      >
    </FwbButtonGroup>
  </div>
</template>
