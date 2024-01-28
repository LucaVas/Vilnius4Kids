<script lang="ts" setup>
import { FwbAlert } from 'flowbite-vue'

defineProps<{
  message: string
}>()
</script>

<template>
  <FwbAlert v-if="message" data-testid="error-message" type="danger">
    {{ message }}
  </FwbAlert>
</template>
