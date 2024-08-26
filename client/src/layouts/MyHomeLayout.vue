<script setup lang="ts">
import StackedLayout from './StackedLayout.vue';
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';

const links = ref([
  { label: 'My playgrounds', name: 'MyHome' },
  { label: 'Find a playground', name: 'Playgrounds' },
]);

onBeforeMount(async () => {
  const { isVerified } = await trpc.user.isUserVerified.query();

  if (isVerified) {
    links.value.push({ label: 'My reports', name: 'MyReports' });
  }
});
</script>

<template>
  <StackedLayout :links="links"></StackedLayout>
</template>
