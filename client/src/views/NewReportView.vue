<script setup lang="ts">
import { FwbSelect, FwbButton, FwbButtonGroup, FwbHeading, FwbP } from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';

const selected = ref('');
const availableCategories = ref<{ value: string; name: string }[]>();
const pageLoaded = ref(false);

onBeforeMount(async () => {
  const { categories } = await trpc.reportCategory.getReportCategories.query();
  availableCategories.value = categories.map((c) => {
    return { value: JSON.stringify(c.id), name: c.name };
  });
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="pageLoaded" class="h-full w-full bg-gray-200">
    <FwbHeading tag="h3">Report an issue</FwbHeading>
    <FwbP class="font-light">
      A public playground for kids can be a wonderful place for children to play, socialize, and
      develop important skills. However, there are potential issues that may arise, and it's crucial
      to address them to ensure the safety and well-being of the children.</FwbP
    >
    <FwbButtonGroup class="flex h-full w-full flex-col gap-5">
      <FwbButton
        v-for="category in availableCategories"
        :key="category.value"
        color="default"
        outline
        class="w-full"
        >{{ category.name }}</FwbButton
      >
    </FwbButtonGroup>
  </div>
</template>
