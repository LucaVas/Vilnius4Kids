<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { FwbAlert, FwbSpinner } from 'flowbite-vue';
import { useRouter } from 'vue-router';
import { trpc } from '../trpc';
import { TRPCClientError } from '@trpc/client';
import { DEFAULT_SERVER_ERROR } from '../consts';

const router = useRouter();

const props = defineProps<{
  email: string;
  token: string;
}>();

const hasSucceeded = ref(false);
const isVerifying = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  await router.isReady();
  try {
    await trpc.verificationToken.verify.mutate({ email: props.email, token: props.token });
    hasSucceeded.value = true;
    isVerifying.value = false;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      errorMessage.value = error.data.message || error.message;
    } else {
      errorMessage.value = DEFAULT_SERVER_ERROR;
    }
    isVerifying.value = false;
  }
});
</script>

<template>
  <div v-if="isVerifying" class="flex h-screen flex-col items-center gap-4 px-2 py-10">
    We are verifying your account, please wait...
    <FwbSpinner size="12" />
  </div>
  <div v-else class="px-2 py-4">
    <FwbAlert
      v-if="hasSucceeded"
      type="success"
      icon
      class="flex flex-col items-center justify-center"
      data-testid="successVerificationMessage"
    >
      Hurray! Your account is successfully verified. 🎉
      <RouterLink
        :to="{ name: 'Login' }"
        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >You can now log in</RouterLink
      >.
    </FwbAlert>

    <FwbAlert
      icon
      type="danger"
      class="flex flex-col items-center justify-center"
      v-if="errorMessage"
      data-testid="errorVerificationMessage"
    >
      Ooops! {{ errorMessage }}
      <RouterLink
        :to="{ name: 'Login' }"
        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >Back to log in page</RouterLink
      >.
    </FwbAlert>
  </div>
</template>
