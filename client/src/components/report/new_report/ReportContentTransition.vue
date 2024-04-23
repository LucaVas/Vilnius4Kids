<template>
  <Transition>
    <div v-if="showForm" class="flex flex-col gap-4">
      <form @submit.prevent="null">
        <FwbTextarea
          v-model="newReport.description"
          :rows="5"
          custom
          minlength="5"
          label="Write a description of your issue"
          placeholder="What is the nature of this report?"
        >
          <template #footer>
            <div class="flex w-full flex-col items-start">
              <FwbFileInput
                label="Files upload"
                class="w-full"
                v-model="newReport.files"
                multiple
                :disabled="sendingReport"
                accept="image/png, image/jpg"
              >
                <p class="mt-3 min-w-fit text-sm text-gray-500 dark:text-gray-300">
                  {{ filesUploadInfo }}
                </p>
                <div
                  v-if="newReport.files.length !== 0"
                  class="mt-4 flex max-h-[14rem] flex-col gap-3 overflow-y-auto rounded-md border-[1px] border-gray-300 p-2 text-sm"
                >
                  <div
                    v-for="file in newReport.files"
                    :key="file.name"
                    class="flex w-full items-center justify-between border border-transparent border-b-violet-200 p-2"
                    :class="
                      allowedTypes.every((type) => !type.includes(file.type)) ||
                      file.size > allowedSize
                        ? 'rounded-md bg-red-300'
                        : 'bg-transparent'
                    "
                  >
                    {{ file.name }}
                    <FwbButton
                      size="sm"
                      color="purple"
                      outline
                      :disabled="sendingReport || reportSent"
                      @click="newReport.files.splice(newReport.files.indexOf(file), 1)"
                      >X</FwbButton
                    >
                  </div>
                </div>
              </FwbFileInput>
            </div>
          </template>
        </FwbTextarea>
        <p class="ml-auto text-xs text-gray-500 dark:text-gray-400">
          Remember, reporting an issue should follow our
          <FwbA href="#">Community Guidelines</FwbA>.
        </p>
      </form>

      <FwbButtonGroup class="flex w-full justify-between">
        <FwbButton
          v-if="!reportSent"
          color="dark"
          outline
          square
          :disabled="sendingReport"
          @click="$emit('back')"
        >
          Back
        </FwbButton>
        <FwbButton
          v-if="showForm && !reportSent"
          :disabled="reportSent || sendingReport"
          :loading="sendingReport"
          square
          color="purple"
          @click="$emit('submitReport', newReport)"
        >
          Submit report
        </FwbButton>
      </FwbButtonGroup>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { FwbTextarea, FwbButtonGroup, FwbButton, FwbFileInput, FwbA } from 'flowbite-vue';
import { filesTypesAllowed, maxFileSizeAllowed } from '@/config';
import { ref } from 'vue';

type NewReport = {
  description: string;
  files: File[];
};
const newReport = ref<NewReport>({
  description: '',
  files: [],
});
const filesUploadInfo = ref('JPEG | JPG | PNG (Max 5MB)');
const allowedTypes = filesTypesAllowed.split(',').map((t) => t.trim());
const allowedSize = Number(maxFileSizeAllowed);

const { showForm, sendingReport, reportSent } = defineProps<{
  showForm: boolean;
  sendingReport: boolean;
  reportSent: boolean;
}>();

defineEmits<{
  (event: 'submitReport', report: NewReport): void;
  (event: 'back'): void;
}>();
</script>
