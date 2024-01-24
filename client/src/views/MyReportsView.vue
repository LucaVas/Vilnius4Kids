<script lang="ts" setup>
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { FwbSpinner } from 'flowbite-vue';
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
  <div v-if="!pageLoaded" class="flex h-full items-center justify-center">
    <FwbSpinner size="12" />
  </div>
  <div v-else>
    <div>
      <ReportsTable :reports="userReports" />
    </div>
  </div>
</template>
