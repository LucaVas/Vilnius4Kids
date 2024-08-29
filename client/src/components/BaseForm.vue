<script lang="ts" setup>
import { FwbHeading } from 'flowbite-vue';

defineProps<{
  heading: string;
  formLabel: string;
}>();

defineEmits<{
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="flex flex-col justify-between p-8 w-full max-w-[40rem]">
    <div>
      <FwbHeading tag="h2" class="text-gray-900">{{ heading }}</FwbHeading>

      <form
        class="space-y-6 mt-5"
        :aria-label="formLabel"
        @submit.prevent="$emit('submit')"
      >
        <slot />
      </form>
    </div>

    <slot name="footer" />
  </div>
</template>
