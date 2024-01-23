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
const hasSucceeded = ref(false)

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  await signup(userForm.value)

  hasSucceeded.value = true
})
</script>

<template>
  <div class="w-full h-full flex justify-center bg-slate-300">
    <PageForm heading="Sign up" formLabel="Signup" @submit="submitSignup">
      <template #default>
        <FwbInput
          type="text"
          placeholder="Username"
          id="username"
          v-model="userForm.username"
          :required="true"
          class="border-transparent border-b-black"
        />

        <FwbInput
          type="email"
          placeholder="Email"
          v-model="userForm.email"
          :required="true"
          class="border-transparent border-b-black"
        />

        <FwbInput
          placeholder="Password"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          v-model="userForm.password"
          :required="true"
          class="border-transparent border-b-black"
        />

        <FwbAlert v-if="hasSucceeded" type="success" data-testid="successMessage">
          You have successfully signed up! You can now log in.
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Go to the login page</RouterLink
          >
        </FwbAlert>
        <AlertError :message="errorMessage">
          {{ errorMessage }}
        </AlertError>

        <div class="grid">
          <FwbButton color="default" type="submit" size="xl">Sign up</FwbButton>
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
