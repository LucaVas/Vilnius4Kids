<script setup lang="ts">
import {
  FwbBadge,
  FwbCarousel,
  FwbRating,
  FwbSpinner,
  FwbAlert,
  FwbP,
  FwbButtonGroup,
  FwbButton,
} from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const playgroundId = Number(route.params.id);
const pageLoaded = ref(false);
const loadingSave = ref(false);
const saved = ref(false);
const currentPlayground = ref();
const ratingScheme = ref({
  rating: 0,
  count: 0,
});

onBeforeMount(async () => {
  const [playground, { count, rating }, { playgrounds }] = await Promise.all([
    trpc.playground.getPlayground.query({ id: playgroundId }),
    trpc.rating.getRating.query({ id: playgroundId }),
    trpc.playground.getFavoritePlaygrounds.query(),
  ]);

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

async function savePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.addFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    saved.value = true;
  }
}

async function unsavePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.deleteFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    saved.value = false;
  }
}
</script>

<template>
  <div v-if="!pageLoaded" class="flex h-full items-center justify-center">
    <FwbSpinner size="12" />
  </div>
  <div v-else class="flex h-full w-full flex-col bg-gray-200 px-4 py-2">
    <FwbCarousel :pictures="pictures" slide :slide-interval="5000" />
    <div class="mt-2 flex items-center gap-2">
      <FwbBadge size="sm" type="indigo">{{ currentPlayground.address.district }}</FwbBadge>
      <FwbBadge v-if="currentPlayground.isOpen" size="sm" type="green">Open</FwbBadge>
      <FwbBadge v-else size="sm" type="red">Closed</FwbBadge>
      <FwbRating :rating="ratingScheme.rating">
        <template #besideText>
          <p class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ ratingScheme.rating }} out of 5
          </p>
        </template>
      </FwbRating>
    </div>
    <div class="mt-2 flex items-center gap-2">
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
    <div class="mt-2">
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
    <FwbP v-if="currentPlayground.description" class="mt-2 text-gray-900 dark:text-gray-400">
      {{ currentPlayground.description }}
    </FwbP>
    <FwbP v-else class="mt-2 text-gray-900 dark:text-gray-400">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat voluptatibus deserunt minus,
      distinctio voluptas rem, dicta voluptate dignissimos dolore corporis eligendi. Iure maiores
      facere nisi consequuntur, illum voluptas, neque atque ipsam laborum unde quis? Hic numquam
      minus vitae vel beatae, dolores animi, ratione recusandae dignissimos esse atque voluptatibus
      tenetur accusantium aut fugit officia modi eveniet perspiciatis facilis dicta a debitis natus.
      Odit eligendi cumque eaque, error dolore soluta magni, iste quis amet eum dicta neque sequi
      velit nihil omnis atque beatae minima quisquam voluptatem aspernatur architecto optio esse
      adipisci repellendus. Asperiores quia laudantium veritatis reprehenderit quas dolore
      voluptatem impedit pariatur?
    </FwbP>
    <FwbButtonGroup class="my-4 flex justify-between">
      <FwbButton color="dark" outline square @click="$router.go(-1)">Back</FwbButton>
      <FwbButtonGroup class="gap-2">
        <FwbButton
          color="green"
          v-if="!saved"
          outline
          square
          :loading="loadingSave"
          @click="savePlayground(currentPlayground.id)"
          >Save</FwbButton
        >
        <FwbButton
          color="green"
          v-else
          outline
          square
          :loading="loadingSave"
          @click="unsavePlayground(currentPlayground.id)"
          >Unsave</FwbButton
        >
        <FwbButton
          color="red"
          outline
          square
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'PlaygroundReport', params: { id: currentPlayground.id } } as any"
          >Report</FwbButton
        ></FwbButtonGroup
      >
    </FwbButtonGroup>
  </div>
</template>
