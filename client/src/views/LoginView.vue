<script lang="ts" setup>
import { login } from '@/stores/user'
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import useErrorMessage from '@/composables/useErrorMessage'
import LogoSection from '@/components/LogoSection.vue';

const router = useRouter()

const userForm = ref({
  email: '',
  password: '',
})

const [submitLogin, errorMessage] = useErrorMessage(async () => {
  await login(userForm.value)

  router.push({ name: 'Dashboard' })
})
</script>

<template>
  <div class="flex h-full flex-row">
    <LogoSection></LogoSection>
    <PageForm heading="Log in" formLabel="Login" @submit="submitLogin">
      <template #default>
        <FwbInput label="Email" type="email" v-model="userForm.email" :required="true" class="border-transparent border-b-black"/>

        <FwbInput
          label="Password"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          v-model="userForm.password"
          :required="true"
          class="border-transparent border-b-black"
        />

        <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger">
          {{ errorMessage }}
        </FwbAlert>

        <div class="grid">
          <FwbButton color="default" type="submit" size="xl">Log in</FwbButton>
        </div>
      </template>

      <template #footer>
        <FwbAlert class="bg-transparent text-center">
          Not a member?
          {{ ' ' }}
          <RouterLink
            :to="{ name: 'Signup' }"
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >Sign up</RouterLink
          >
        </FwbAlert>
      </template>
    </PageForm>
  </div>
</template>
