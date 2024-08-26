<script setup lang="ts">
import { ref } from 'vue';
import NavbarMenu from '@/components/NavbarMenu.vue';

const { links } = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
}>();

const appName = ref('Vilnius4Kids');
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <NavbarMenu :links="links" />
    </div>

    <div class="navbar-end">
      <a href="/" class="btn btn-ghost text-xl">{{ appName }}</a>
    </div>
  </div>
</template>
