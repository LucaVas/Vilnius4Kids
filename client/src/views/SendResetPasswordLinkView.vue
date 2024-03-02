<script lang="ts" setup>
import { ref } from 'vue';
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue';
import useErrorMessage from '../composables/useErrorMessage/index';
import { trpc } from '../trpc';
import PageForm from '@/components/PageForm.vue';

const userEmail = ref('');
const hasSucceeded = ref(false);
const successMessage = ref('');
const loading = ref(false);

const [sendResetPasswordLink, errorMessage] = useErrorMessage(async () => {
  loading.value = true;
  const { message } = await trpc.password.sendPasswordResetLink.mutate({
    email: userEmail.value,
  });
  loading.value = false;
  hasSucceeded.value = true;
  successMessage.value = message;
});
</script>

<template>
  <div class="flex h-screen justify-center">
    <PageForm
      heading="Find your account"
      formLabel="Find account"
      @submit="sendResetPasswordLink"
      data-testid="find-account-form"
    >
      <template #default>
        <FwbInput
          placeholder="Email"
          type="email"
          v-model="userEmail"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0"
        />

        <FwbAlert icon type="danger" v-if="errorMessage" data-testid="error-message">
          {{ errorMessage }}
        </FwbAlert>

        <FwbAlert icon type="success" v-if="hasSucceeded" data-testid="success-message">
          {{ successMessage }}
        </FwbAlert>

        <div class="grid">
          <FwbButton
            v-if="!hasSucceeded"
            class="flex items-center justify-center"
            color="purple"
            loading-position="suffix"
            type="submit"
            :disabled="loading && !errorMessage"
            :loading="loading && !errorMessage"
            size="xl"
            >Continue
            <template #suffix> </template>
          </FwbButton>
          <FwbButton
            v-else
            class="mt-4 flex items-center justify-center"
            color="purple"
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Login' } as any"
            data-testid="to-login-button"
            outline
            size="xl"
            >Back to login</FwbButton
          >
        </div>
      </template>

      <template #footer>
        <FwbAlert class="bg-transparent text-center">
          Remembered your password?
          {{ ' ' }}
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Log in</RouterLink
          >
        </FwbAlert>
      </template>
    </PageForm>
  </div>
</template>
