<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue';
import StackedLayout from './StackedLayout.vue';
import { getUsername, logout } from '@/stores/user';
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';

const router = useRouter();

const links = ref([
  { label: 'My playgrounds', name: 'MyHome' },
  { label: 'Find a playground', name: 'Playgrounds' },
  { label: 'Report an issue', name: 'NewReport' },
]);

function logoutUser() {
  logout();
  router.push({ name: 'Login' });
}

const tag = ref('');

onBeforeMount(async () => {
  const { isVerified } = await trpc.user.isUserVerified.query();

  if (isVerified) {
    links.value.push({ label: 'My reports', name: 'MyReports' });
  }
  const username = await getUsername();
  tag.value = username;
});
</script>

<template>
  <StackedLayout :links="links" :tag="tag">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#" class="flex content-center items-center"
        >Logout</FwbNavbarLink
      >
    </template>
  </StackedLayout>
</template>
