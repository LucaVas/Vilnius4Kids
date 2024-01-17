<script lang="ts" setup>
import { signup } from '@/stores/user'
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbCheckbox, FwbInput } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import AlertError from '@/components/AlertError.vue'
import LogoSection from '@/components/LogoSection.vue'
// import useErrorMessage from '@/composables/useErrorMessage'

const userForm = ref({
  email: '',
  password: '',
})

const check = ref(false)

const hasSucceeded = ref(false)

const errorMessage = ref('')
async function submitSignup() {
  try {
    const signupData = await signup(userForm.value)
    console.log(signupData)

    errorMessage.value = ''
    hasSucceeded.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}

// Or, if we move the generic error handling to a separate composable
// function, which creates an error message ref for us and handles
// the try/catch block, we can simplify our submitSignup function to:
// const [submitSignup, errorMessage] = useErrorMessage(async () => {
//   await signup(userForm.value)

//   hasSucceeded.value = true
// })
</script>

<template>
  <div class="flex h-full flex-row">
    <LogoSection></LogoSection>
    <PageForm heading="Sign up" formLabel="Signup" @submit="submitSignup">
      <template #default>
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

        <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
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
