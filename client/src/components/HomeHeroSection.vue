<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue';
import ArrowRight from '@/components/icons/ArrowRight.vue';
import { ref } from 'vue';

const appName = ref('Vilnius4Kids');
const heroDescription = ref(
  'The best playgrounds in Vilnius, at your fingertips.'
);
</script>

<template>
  <div
    class="w-full items-center rounded-lg bg-white px-8 py-20 sm:p-12 md:p-12 lg:flex"
    data-testid="homepage-hero-section"
  >
    <div class="space-y-10 lg:w-1/2">
      <h2
        class="flex items-center justify-center text-4xl font-bold text-gray-800 dark:text-gray-100 lg:justify-start"
      >
        {{ appName }}
      </h2>

      <p
        class="mt-4 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 lg:max-w-md lg:justify-start"
      >
        {{ heroDescription }}
      </p>

      <div class="mt-6 flex items-center justify-center gap-2 lg:justify-start">
        <FwbButton
          size="xl"
          color="purple"
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'Playgrounds' } as any"
        >
          Find a playground
          <template #suffix>
            <component :is="ArrowRight" />
          </template>
        </FwbButton>
      </div>
    </div>

    <div class="mt-12 lg:mt-0 lg:w-1/2">
      <img src="@/assets/playing-children.svg" alt="family" />
    </div>
  </div>
</template>
