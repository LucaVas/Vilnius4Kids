<template>
  <Transition>
    <div v-if="showCategories">
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
}>();
</script>
