<script lang="ts" setup>
import { FwbFooter, FwbFooterCopyright } from 'flowbite-vue';
import AppNavbar from '@/components/AppNavbar.vue';

const { links } = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
}>();
</script>

<template>
  <AppNavbar :links="links" />

  <main class="flex w-screen flex-col items-center justify-start px-6 py-8">
    <RouterView />
  </main>

  <FwbFooter>
    <FwbFooterCopyright by="Vilnius4kids" class="text-xs" />
  </FwbFooter>
</template>
