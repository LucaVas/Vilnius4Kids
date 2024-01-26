<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue';
import StackedLayout from './StackedLayout.vue';
import { logout } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const links = [
  { label: 'My playgrounds', name: 'MyHome' },
  { label: 'Find a playground', name: 'Playgrounds' },
  { label: 'Report an issue', name: 'NewReport' },
  { label: 'My reports', name: 'MyReports' },
];

function logoutUser() {
  logout();
  router.push({ name: 'Login' });
}
</script>

<template>
  <StackedLayout :links="links">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#" class="flex content-center items-center"
        >Logout</FwbNavbarLink
      >
    </template>
  </StackedLayout>
</template>
