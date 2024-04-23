<template>
  <Transition>
    <div v-if="showTopics" class="flex flex-col gap-5">
      <FwbButtonGroup class="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2">
        <FwbButton
          v-for="topic in getTopics(availableCategories)"
          :key="topic"
          color="purple"
          outline
          class="w-full"
          @click="$emit('getCategoriesByTopic', topic)"
          >{{ topic }}</FwbButton
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
import { type ReportCategorySelect } from '../../../../../server/src/entities/report_category/schema';
const getTopics = (availableCategories: ReportCategorySelect[] | undefined) => {
  return availableCategories
    ? availableCategories.reduce((acc: string[], curr) => {
        if (!acc.includes(curr.topic)) {
          acc.push(curr.topic);
        }
        return acc;
      }, [])
    : [];
};

const { showTopics, availableCategories } = defineProps<{
  showTopics: boolean;
  availableCategories: ReportCategorySelect[] | undefined;
}>();

defineEmits<{
  (event: 'getCategoriesByTopic', topic: string): void;
  (event: 'back'): void;
}>();
</script>
