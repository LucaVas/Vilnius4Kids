<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue';

</script>

<template>
  <!-- landing page with Tailwind -->
  <div class="bg-white dark:bg-gray-800">
    <div class="container mx-auto px-6 py-8">
      <div class="items-center lg:flex">
        <div class="lg:w-1/2">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">Vilnius4Kids</h2>

          <p class="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-md">
            The best playgrounds in Vilnius, at your fingertips.
          </p>

          <div class="mt-6 flex items-center justify-center sm:justify-start gap-2">
            <!-- prettier-ignore -->
            <FwbButton
              component="RouterLink"
              tag="router-link"
              :href="({ name: 'Signup' } as any)"
            >
              Find a playground
            </FwbButton>
          </div>
        </div>

        <div class="mt-12 lg:mt-0 lg:w-1/2">
        <img src="../assets/playing-children.svg" alt="family">
        </div>
      </div>
    </div>
  </div>
</template>
