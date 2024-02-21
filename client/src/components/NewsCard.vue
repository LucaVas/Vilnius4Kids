<script setup lang="ts">
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
  date: {
    type: String,
  },
});
</script>

<template>
  <div
    class="max-w flex flex-col items-start justify-center rounded-lg border border-gray-200 bg-white p-6 shadow"
  >
    <a href="#">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {{ title }}
      </h5>
    </a>
    <p class="mb-3 text-start font-normal text-gray-700">
      {{ description }}
    </p>
    <div class="flex w-full items-center justify-between">
      <p class="text-sm italic text-gray-400">{{ date }}</p>
      <a
        :href="href"
        class="inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium text-purple-700 hover:bg-purple-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-300"
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
</template>
