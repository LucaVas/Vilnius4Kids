<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue';
import StackedLayout from './StackedLayout.vue';
import { getUsername, logout } from '@/stores/user';
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';

const router = useRouter();
const usernameTag = ref('');

const links = ref([
  { label: 'Playgrounds', name: 'AdminDashboard' },
  { label: 'Reports', name: 'AdminReports' },
  { label: 'Addresses', name: 'AdminAddresses' },

]);

function logoutUser() {
  logout();
  router.push({ name: 'Login' });
}

onBeforeMount(async () => {
  const username = await getUsername();
  usernameTag.value = username;
});
</script>

<template>
  <StackedLayout :links="links" :tag="usernameTag">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#" class="flex content-center items-center"
        >Logout</FwbNavbarLink
      >
    </template>
  </StackedLayout>
</template>
