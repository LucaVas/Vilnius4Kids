<script setup lang="ts">
import {
  FwbA,
  FwbBadge,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue';
import type { Report } from '../../../server/src/entities/report/report';
import { FwbButton } from 'flowbite-vue';

defineProps<{
  reports: Report[];
}>();
// defineEmits<{
//   delete: [id: number];
// }>();

function convertDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}
</script>

<template>
  <FwbTable hoverable class="h-full w-full">
    <FwbTableHead class="bg-gray-800 dark:bg-gray-200 ">
      <FwbTableHeadCell class="text-slate-50 dark:text-slate-800">Playground</FwbTableHeadCell>
      <FwbTableHeadCell class="hidden sm:table-cell text-slate-50 dark:text-slate-800">Date</FwbTableHeadCell>
      <FwbTableHeadCell class="text-slate-50 dark:text-slate-800">Status</FwbTableHeadCell>
      <FwbTableHeadCell class="align-center flex justify-center text-slate-50 dark:text-slate-800"
        >Actions
      </FwbTableHeadCell>
    </FwbTableHead>
    <FwbTableBody>
      <FwbTableRow v-for="report in reports" :key="report.id">
        <FwbTableCell
          >{{ report.playground.address.street }}
          {{ report.playground.address.number }}</FwbTableCell
        >
        <FwbTableCell class="hidden sm:table-cell">{{ convertDate(report.createdAt) }}</FwbTableCell>
        <FwbTableCell>
          <FwbBadge v-if="report.status === 'open'" size="sm" type="green">Open</FwbBadge>
          <FwbBadge v-if="report.status === 'in progress'" size="sm" type="yellow"
            >In progress</FwbBadge
          >
          <FwbBadge v-if="report.status === 'closed'" size="sm" type="red">Closed</FwbBadge>
        </FwbTableCell>
        <FwbTableCell class="align-center flex justify-center">
          <FwbButton
            color="dark"
            outline
            square
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Report', params: { id: report.id } } as any"
          >
            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                fill-rule="evenodd"
              />
            </svg>
          </FwbButton>
        </FwbTableCell>
      </FwbTableRow>
    </FwbTableBody>
  </FwbTable>
</template>
