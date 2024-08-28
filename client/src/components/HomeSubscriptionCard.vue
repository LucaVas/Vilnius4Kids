<script setup lang="ts">
import { FwbButton, FwbAlert } from 'flowbite-vue';
import EmailIcon from '@/components/icons/EmailIcon.vue';
import useErrorMessage from '@/composables/useErrorMessage/index';
import { ref } from 'vue';
import { trpc } from '@/trpc';

const subscribed = ref(false);
const successMessage = ref('');
const email = ref('');

const [subscribe, errorMessage] = useErrorMessage(async () => {
  const { message } = await trpc.user.subscribe.mutate({ email: email.value });
  successMessage.value = message;
  subscribed.value = true;
});
</script>

<template>
  <div
    class="max-w-screen rounded-lg border-gray-200 bg-white p-8 sm:m-0 sm:p-12 md:p-12"
  >
    <form class="space-y-8" @submit.prevent="subscribe">
      <h5 class="text-2xl font-medium text-black">Stay tuned!</h5>
      <p class="text-sm font-medium text-gray-500">
        Subscribe to our newsletter and get the latest updates and news.
      </p>
      <div class="flex w-full flex-col gap-2 md:flex-row lg:w-1/2">
        <div class="relative w-full">
          <div
            class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5"
          >
            <component :is="EmailIcon" />
          </div>
          <input
            type="text"
            v-model="email"
            data-testid="subscription-email"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 ps-10 text-sm text-gray-900 focus:border-purple-500 focus:ring-purple-500"
            placeholder="your@email.com"
          />
        </div>
        <FwbButton color="purple" type="submit" outline size="lg"
          >Subscribe</FwbButton
        >
      </div>

      <div id="alerts">
        <FwbAlert
          v-if="subscribed"
          icon
          type="success"
          closable
          border
          class="mb-2 w-full"
          data-testid="success-message"
        >
          {{ successMessage }}
        </FwbAlert>

        <FwbAlert
          v-if="errorMessage"
          icon
          type="danger"
          closable
          border
          class="mb-2 w-full"
          data-testid="error-message"
        >
          {{ errorMessage }}
        </FwbAlert>
      </div>
    </form>
  </div>
</template>
