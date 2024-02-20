<script lang="ts" setup>
import { signup } from '@/stores/user';
import { ref } from 'vue';
import PageForm from '@/components/PageForm.vue';
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue';
import AlertError from '@/components/AlertError.vue';
import useErrorMessage from '../composables/useErrorMessage/index';

const userForm = ref({
  username: '',
  email: '',
  password: '',
});

const hasSucceeded = ref(false);
const loading = ref(false);

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  loading.value = true;
  await signup(userForm.value);
  loading.value = false;
  hasSucceeded.value = true;
});
</script>

<template>
  <div class="flex h-screen w-full justify-center">
    <PageForm heading="Sign up" formLabel="Signup" @submit="submitSignup" data-testid="signup-form">
      <template #default>
        <FwbInput
          type="text"
          placeholder="Username"
          id="username"
          :minlength="3"
          :maxlength="60"
          v-model="userForm.username"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0 dark:text-white"
        />

        <FwbInput
          type="email"
          placeholder="Email"
          v-model="userForm.email"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0 dark:text-white"
        />

        <FwbInput
          placeholder="Password"
          id="password"
          name="password"
          type="password"
          :minlength="8"
          :maxlength="64"
          autocomplete="current-password"
          v-model="userForm.password"
          :required="true"
          class="text-sm font-medium text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-0 dark:text-white"
        />

        <FwbAlert v-if="hasSucceeded" type="info" data-testid="tokenMessage">
          A confirmation email has been sent to {{ userForm.email }}. Please confirm it to activate
          your account.
        </FwbAlert>

        <FwbAlert v-if="hasSucceeded" type="success" data-testid="successMessage">
          You have successfully signed up! You can now log in.
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Go to the login page</RouterLink
          >
        </FwbAlert>

        <AlertError icon type="danger" v-if="errorMessage" :message="errorMessage">
          {{ errorMessage }}
        </AlertError>

        <div class="grid gap-2">
          <FwbButton
            class="flex items-center justify-center"
            color="purple"
            loading-position="suffix"
            type="submit"
            :loading="loading && !errorMessage"
            :disabled="loading"
            size="xl"
            >Sign up
            <template #suffix> </template>
          </FwbButton>
          <FwbButton
            class="flex items-center justify-center"
            color="purple"
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Playgrounds' } as any"
            outline
            type="submit"
            size="xl"
            >Try without account
          </FwbButton>
        </div>
      </template>

      <template #footer>
        <FwbAlert class="bg-transparent text-center">
          Already a member?
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
