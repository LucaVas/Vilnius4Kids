<script setup lang="ts">
import { FwbCard, FwbButton } from 'flowbite-vue';

const { href, title, description } = defineProps({
  href: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});
</script>

<template>
  <FwbCard variant="horizontal" :href="href">
    <div class="p-5">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ title }}
      </h5>
      <p class="font-normal text-gray-700 dark:text-gray-400">
        {{ description }}
      </p>
      <div class="flex justify-end">
        <a
          href="#"
          class="mt-2 inline-flex items-center rounded-lg bg-white px-3 py-2 text-center text-sm font-medium text-purple-700 hover:bg-purple-800 hover:text-white focus:outline-none"
        >
          More
          <svg
            class="ms-2 h-3.5 w-3.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  </FwbCard>
</template>
