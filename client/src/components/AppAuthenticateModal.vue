<script setup lang="ts">
import { FwbModal, FwbButton } from 'flowbite-vue';
import { useRouter } from 'vue-router';
const router = useRouter();

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <FwbModal v-if="isOpen" @close="$emit('close')" position="center">
    <template #header>
      <div class="flex items-center text-lg">Login or Signup</div>
    </template>
    <template #body>
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        <slot name="default" />
      </p>
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Would you like to continue?
      </p>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <FwbButton @click="$emit('close')" color="alternative">
          Cancel
        </FwbButton>
        <FwbButton @click="router.push({ name: 'Login' })" color="green">
          Let's go
        </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
