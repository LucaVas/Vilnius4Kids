<script setup lang="ts">
import StackedLayout from './StackedLayout.vue';
import { getUsername } from '@/stores/user';
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';

const links = ref([
  { label: 'My playgrounds', name: 'MyHome' },
  { label: 'Find a playground', name: 'Playgrounds' },
  { label: 'Report an issue', name: 'NewReport' },
]);

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
  <StackedLayout :links="links" :tag="tag"></StackedLayout>
</template>
