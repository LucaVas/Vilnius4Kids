<template>
  <Transition>
    <div v-if="showCategories" class="flex flex-col gap-5">
      <FwbButtonGroup class="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2">
        <FwbButton
          v-for="category in categories"
          :key="category.id"
          color="purple"
          outline
          class="w-full"
          @click="$emit('selectCategory', category)"
          >{{ category.name }}</FwbButton
        >
      </FwbButtonGroup>
      <FwbButtonGroup class="flex w-full justify-between">
        <FwbButton color="dark" outline square @click="$emit('back')"> Back </FwbButton>
      </FwbButtonGroup>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { FwbButtonGroup, FwbButton } from 'flowbite-vue';
import type { ReportCategorySelect } from '../../../../../server/src/entities/report_category/schema';

const { showCategories, categories } = defineProps<{
  showCategories: boolean;
  categories: ReportCategorySelect[] | undefined;
}>();

defineEmits<{
  (event: 'selectCategory', category: any): void;
  (event: 'back'): void;
}>();
</script>
