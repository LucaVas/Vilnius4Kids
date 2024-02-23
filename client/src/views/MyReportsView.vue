<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { FwbSpinner, FwbHeading, FwbP } from 'flowbite-vue';
import { Report } from '../../../server/src/entities/report/report';
import ReportsTable from '@/components/ReportsTable.vue';

const userReports = ref<Report[]>([]);
const pageLoaded = ref(false);

onBeforeMount(async () => {
  const { reports } = await trpc.report.getReportsByUser.query();
  userReports.value = reports;
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="!pageLoaded">
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
  <div v-else class="w-full px-2 py-4">
    <FwbHeading tag="h4" class="mb-4">My reports</FwbHeading>
    <div v-if="userReports.length !== 0">
      <ReportsTable :reports="userReports" />
    </div>
    <div
      v-else
      role="status"
      class="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
    >
      <FwbP>No reports available</FwbP>
      <div class="flex items-center justify-between">
        <div>
          <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
