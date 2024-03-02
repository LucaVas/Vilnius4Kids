<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue';
import ContactCard from '@/components/ContactCard.vue';
import CardsCarousel from '@/components/CardsCarousel.vue';
</script>

<template>
  <div class="flex flex-col gap-8">
    <div
      class="w-full items-center rounded-lg bg-white p-8 py-20 sm:p-12 md:p-12 lg:flex"
      data-testid="homepage-hero-section"
    >
      <div class="space-y-6 lg:w-1/2">
        <h2
          class="flex items-center justify-center text-5xl font-bold text-gray-800 dark:text-gray-100 lg:justify-start"
        >
          Vilnius4Kids
        </h2>

        <p
          class="mt-4 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 lg:max-w-md lg:justify-start"
        >
          The best playgrounds in Vilnius, at your fingertips.
        </p>

        <div class="mt-6 flex items-center justify-center gap-2 lg:justify-start">
          <FwbButton
            size="lg"
            color="purple"
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Demo' } as any"
          >
            Get started
            <template #suffix>
              <svg
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  fill-rule="evenodd"
                />
              </svg>
            </template>
          </FwbButton>
        </div>
      </div>

      <div class="mt-12 lg:mt-0 lg:w-1/2">
        <img src="../assets/playing-children.svg" alt="family" />
      </div>
    </div>

    <CardsCarousel />

    <ContactCard />
  </div>
</template>
