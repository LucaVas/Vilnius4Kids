<script lang="ts" setup>
import { FwbFooter, FwbFooterCopyright } from 'flowbite-vue';
import AppNavbar from '@/components/AppNavbar.vue';
import { ref, computed } from 'vue';
import { isLoggedIn } from '../stores/user';
import type { BaseLink } from '@/components/types/baseLink';

const baseLinks = ref<BaseLink[]>([
  {
    label: 'My playgrounds',
    name: 'FavoritePlaygrounds',
    showForAuth: true,
    showForGuest: false,
  },
  {
    label: 'Find a playground',
    name: 'Playgrounds',
    showForAuth: true,
    showForGuest: true,
  },
  { label: 'Login', name: 'Login', showForAuth: false, showForGuest: true },
  { label: 'Signup', name: 'Signup', showForAuth: false, showForGuest: true },
]);
const links = computed(() => {
  if (isLoggedIn.value) {
    return baseLinks.value.filter((l) => l.showForAuth);
  } else {
    return baseLinks.value.filter((l) => !l.showForAuth || l.showForGuest);
  }
});
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
