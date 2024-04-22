<script lang="ts" setup>
import { FwbAlert } from 'flowbite-vue';
import type { AlertType } from 'flowbite-vue/components/FwbAlert/types.js';

defineProps<{
  closable?: boolean;
  type?: AlertType;
  message: string;
}>();
</script>

<template>
  <FwbAlert
    v-if="message"
    data-testid="error-message"
    :type="type ?? 'danger'"
    :closable="closable ?? false"
  >
    {{ message }}
  </FwbAlert>
</template>
