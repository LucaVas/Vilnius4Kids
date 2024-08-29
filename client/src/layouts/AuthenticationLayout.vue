<script lang="ts" setup>
import AppFamily from '@/components/images/AppFamily.vue';
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-between">
    <div class="md:flex h-full w-1/2 items-center justify-center bg-gray-900 p-6 hidden">
      <component :is="AppFamily" />
    </div>

    <div class="h-full w-full md:w-1/2 flex items-center justify-center">
      <RouterView />
    </div>
  </div>
</template>
