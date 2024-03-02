<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Pagination, Slide } from 'vue3-carousel';
import NewsCard from '@/components/NewsCard.vue';

const breakpoints = {
  640: { itemsToShow: 1 },
  768: { itemsToShow: 2 },
  1024: { itemsToShow: 3 },
};

const cards = [
  {
    id: 0,
    date: '2024-02-20',
    href: '/demo',
    title: 'New demo released',
    description: "Now it's possible to use our application without an account. Try it now!",
  },
  {
    id: 1,
    date: '2024-02-11',
    href: '/signup',
    title: 'Signup for all features',
    description:
      "Create an account now to get access to all features of our application. It's free!",
  },
  {
    id: 2,
    date: '2024-02-15',
    href: '/demo',
    title: 'Google Maps integration',
    description:
      'Integrated Google Maps to make it easier to get directions to your any playground.',
  },
];
</script>

<template>
  <Carousel
    :wrap-around="true"
    :autoplay="5000"
    :breakpoints="breakpoints"
    :items-to-scroll="1"
    :touch-drag="true"
    :pause-autoplay-on-hover="true"
  >
    <Slide v-for="card in cards" :key="card.id">
      <NewsCard
        :href="card.href"
        :title="card.title"
        :description="card.description"
        :date="card.date"
        class="hover:bg-gray-100"
      />
    </Slide>

    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.carousel__slide {
  padding: 0.2rem;
}
</style>
