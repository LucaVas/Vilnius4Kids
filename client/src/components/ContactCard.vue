import { FwbInput, FwbButton } from 'flowbite-vue';
<script setup lang="ts">
import { FwbButton } from 'flowbite-vue';
</script>

<template>
  <div class="max-w rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6 md:p-8">
    <form class="space-y-6" action="#">
      <h5 class="text-xl font-medium text-black">Get more updates</h5>
      <p class="text-sm text-gray-500">
        Subscribe to our newsletter and get the latest updates and news.
      </p>
      <div class="flex gap-2 lg:w-1/2">
        <div class="relative w-full">
          <div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
            <svg
              class="h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path
                d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
              />
              <path
                d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
              />
            </svg>
          </div>
          <input
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            placeholder="your@email.com"
          />
        </div>
        <FwbButton color="purple">Subscribe</FwbButton>
      </div>

      <div class="text-sm font-medium text-gray-500">
        <p>By subscribing, you agree with ConvertKit's Terms of Service and Privacy Policy.</p>
      </div>
    </form>
  </div>
</template>
