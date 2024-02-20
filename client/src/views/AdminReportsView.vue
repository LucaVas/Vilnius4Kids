<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { FwbSpinner, FwbPagination } from 'flowbite-vue';
import { trpc } from '../trpc';
import ReportsTable from '@/components/ReportsTable.vue';
import type { Report } from '@vilnius4kids/server/src/entities';
import { FwbSelect } from 'flowbite-vue';

const pageLoaded = ref(false);
const availableReports = ref<Report[]>([]);

// filters
const reportStatusSelected = ref('');
const reportsStatuses = ref([
  { value: 'open', name: 'Open' },
  { value: 'in progress', name: 'In progress' },
  { value: 'closed', name: 'Closed' },
]);
const sortingOptions = ref([
  { value: 'newest', name: 'Newest' },
  { value: 'oldest', name: 'Oldest' },
]);

const reportsToShow = ref<Report[]>([]);
const currentPage = ref(0);
const reportsLimit = 5;
const totalPages = ref(1);

const reportToEdit = ref(0);
const isEditReportModalOpen = ref(false);

function paginateReports() {
  if (availableReports.value === undefined) return;
  const start = currentPage.value * reportsLimit;
  const end = start + reportsLimit;

  reportsToShow.value = availableReports.value.filter((_, index) => index >= start && index < end);
}

function openEditReportModal(id: number) {
  reportToEdit.value = id;
  isEditReportModalOpen.value = true;
}

function filterReports() {
  if (reportStatusSelected.value === '') {
    reportsToShow.value = availableReports.value.slice(0, reportsLimit);
    return;
  }
  reportsToShow.value = availableReports.value
    .filter((report) => report.status === reportStatusSelected.value)
    .slice(0, reportsLimit);
}

// async function editReport(editedPlayground: BarePlayground) {
//   await trpc.playground.updatePlayground.mutate(editedPlayground);
//   availablePlaygrounds.value[reportToEdit.value] = {
//     ...availablePlaygrounds.value[reportToEdit.value],
//     ...editedPlayground,
//   };
//   isEditReportModalOpen.value = false;
// }

onBeforeMount(async () => {
  const reports = await trpc.report.getReports.query();
  availableReports.value = reports;
  reportsToShow.value = availableReports.value.slice(0, reportsLimit);
  totalPages.value = Math.floor(reports.length / reportsLimit);
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="!pageLoaded">
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>

  <div v-else class="gap-2">
    <div class="mb-4 flex gap-2">
      <FwbSelect
        v-model="reportStatusSelected"
        :options="reportsStatuses"
        @change="filterReports"
        label="Status"
        size="sm"
      />
      <FwbSelect
        v-model="reportStatusSelected"
        :options="sortingOptions"
        label="Sort by"
        size="sm"
      />
    </div>
    <ReportsTable :reports="reportsToShow" />
    <div class="flex justify-center">
      <FwbPagination
        class="mt-4"
        v-model="currentPage"
        :total-pages="totalPages >= 1 ? totalPages : 1"
        :slice-length="2"
        @click="paginateReports"
      ></FwbPagination>
    </div>
  </div>
</template>
