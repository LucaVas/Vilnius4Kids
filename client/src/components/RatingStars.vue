<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';

const props = defineProps<{
  playgroundId: number;
  ratingScheme: {
    rating: number;
    count: number;
  };
}>();

const rateHover = ref(0);
const afterRate = ref(0);

function getFill(starNumber: number) {
  if (afterRate.value >= starNumber || rateHover.value >= starNumber) {
    return '#fbbf24';
  } else {
    return '#6a6969';
  }
}

function calculateRating(starNumber: number) {
  afterRate.value = starNumber;
}

onBeforeMount(() => {
  afterRate.value = props.ratingScheme.rating;
});
</script>

<template>
  <div class="flex items-center">
    <svg
      v-for="i in 5"
      :key="i"
      class="star"
      aria-hidden="true"
      :data-testid="'rating-star-' + i"
      xmlns="http://www.w3.org/2000/svg"
      :fill="getFill(i)"
      viewBox="0 0 22 20"
      @mouseover="rateHover = i"
      @mouseleave="rateHover = 0"
      @click="
        $emit('rate', i);
        calculateRating(i);
      "
    >
      <path
        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.star {
  height: 1rem;
  width: 1rem;
  margin-inline-start: 1px;
  cursor: pointer;
}
</style>
