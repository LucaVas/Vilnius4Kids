<script lang="ts" setup>
import { ref } from 'vue';
import PageForm from '@/components/PageForm.vue';
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue';
import AlertError from '@/components/AlertError.vue';
import useErrorMessage from '../composables/useErrorMessage/index';
import { trpc } from '../trpc';
import { TRPCClientError } from '@trpc/client';

const userForm = ref({
  password: '',
});
const props = defineProps<{
  email: string;
  token: string;
}>();
const repeatedPassword = ref('');

const hasSucceeded = ref(false);
const successMessage = ref('');
const loading = ref(false);

const [resetPassword, errorMessage] = useErrorMessage(async () => {

  if (userForm.value.password !== repeatedPassword.value) {
    throw new Error('Passwords do not match');
  }

  loading.value = true;
  const { message } = await trpc.password.reset.mutate({
    email: props.email,
    token: props.token,
    password: userForm.value.password,
  });
  loading.value = false;
  hasSucceeded.value = true;
  successMessage.value = message;
});
</script>

<template>
  <div class="flex h-screen w-full justify-center">
    <PageForm
      heading="Reset password"
      formLabel="Reset password"
      @submit="resetPassword"
      data-testid="reset-password-form"
    >
      <template #default>
        <FwbInput
          placeholder="Password"
          id="password"
          name="password"
          type="password"
          :minlength="8"
          :maxlength="64"
          v-model="userForm.password"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0 dark:text-white"
        />

        <FwbInput
          placeholder="Repeat password"
          id="repeatPassword"
          name="password"
          type="password"
          :minlength="8"
          :maxlength="64"
          v-model="repeatedPassword"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0 dark:text-white"
        />

        <FwbAlert v-if="hasSucceeded" type="success" data-testid="success-message">
          {{ successMessage }}
        </FwbAlert>

        <AlertError icon type="danger" v-if="errorMessage" :message="errorMessage" data-testid="error-message">
          {{ errorMessage }}
        </AlertError>

        <div class="grid gap-2">
          <FwbButton
            v-if="!hasSucceeded"
            class="flex items-center justify-center"
            color="purple"
            loading-position="suffix"
            type="submit"
            :loading="loading && !errorMessage"
            :disabled="loading"
            size="xl"
            >Reset password
            <template #suffix> </template>
          </FwbButton>
          <FwbButton
            v-if="hasSucceeded"
            class="flex items-center justify-center"
            color="purple"
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Login' } as any"
            outline
            size="xl"
            >Back to login
          </FwbButton>
        </div>
      </template>
    </PageForm>
  </div>
</template>
