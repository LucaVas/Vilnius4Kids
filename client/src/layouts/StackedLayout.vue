<script lang="ts" setup>
import { FwbFooter, FwbFooterCopyright, FwbFooterLink, FwbFooterLinkGroup } from 'flowbite-vue';
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

  <div>
    <FwbFooter>
      <FwbFooterCopyright by="Vilnius4kids" class="mb-2" />
      <FwbFooterLinkGroup>
        <FwbFooterLink href="#"> About </FwbFooterLink>
        <FwbFooterLink href="#"> Privacy Policy </FwbFooterLink>
        <FwbFooterLink href="#"> Licensing </FwbFooterLink>
        <FwbFooterLink href="#"> Contact </FwbFooterLink>
      </FwbFooterLinkGroup>
    </FwbFooter>
  </div>
</template>

<style scoped>
main {
  min-height: 75svh;
}
</style>
