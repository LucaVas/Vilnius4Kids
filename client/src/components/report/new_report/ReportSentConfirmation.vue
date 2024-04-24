<template>
  <div v-if="reportSent">
    <div class="flex h-full w-full flex-col items-center justify-center space-y-10">
      <div class="h-1/2 w-1/2 sm:h-1/3 sm:w-1/3 lg:h-1/5 lg:w-1/5">
        <img src="../../../assets/reports/report_sent_success.svg" alt="success-image-1" />
        <img src="src/assets/reports/report_sent_success.svg" alt="success-image-2" />
        <img src="/src/assets/reports/report_sent_success.svg" alt="success-image-3" />
        <img src="/client/src/assets/reports/report_sent_success.svg" alt="success-image-4" />
      </div>
      <AlertMessage
        :type="'success'"
        data-testid="success-message"
        class="w-full lg:w-1/2"
        :message="'Report sent successfully! Thank you for your contribution.'"
      />

      <FwbButtonGroup class="flex w-full justify-end">
        <FwbButton @click="$emit('goHome')" color="purple">Back to your home</FwbButton>
      </FwbButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FwbButtonGroup, FwbButton } from 'flowbite-vue';
import AlertMessage from '@/components/AlertMessage.vue';

const { reportSent } = defineProps<{ reportSent: boolean }>();

defineEmits<{
  (event: 'goHome'): void;
}>();
</script>
