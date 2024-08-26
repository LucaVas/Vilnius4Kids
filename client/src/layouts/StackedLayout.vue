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
  <div class="flex h-screen w-screen flex-col items-center justify-between">
    <AppNavbar :links="links" class="flex-none" />

    <RouterView class="flex-1" />

    <FwbFooter class="w-full flex-none rounded-none">
      <FwbFooterCopyright by="Vilnius4kids" class="text-xs" />
    </FwbFooter>
  </div>
</template>
