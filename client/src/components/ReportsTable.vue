<script setup lang="ts">
import {
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

function convertDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}
</script>

<template>
  <FwbTable hoverable class="h-full w-full">
    <FwbTableHead>
      <FwbTableHeadCell>Playground</FwbTableHeadCell>
      <FwbTableHeadCell class="hidden sm:table-cell">Date</FwbTableHeadCell>
      <FwbTableHeadCell class="hidden sm:table-cell">Status</FwbTableHeadCell>
      <FwbTableHeadCell> </FwbTableHeadCell>
    </FwbTableHead>
    <FwbTableBody>
      <FwbTableRow v-for="report in reports" :key="report.id" data-testid="report-row">
        <FwbTableCell class="pr-0"
          >{{ report.playground.address.street }}
          {{ report.playground.address.number }}</FwbTableCell
        >
        <FwbTableCell class="hidden sm:table-cell">{{
          convertDate(report.createdAt)
        }}</FwbTableCell>
        <FwbTableCell class="hidden sm:table-cell">
          <FwbBadge v-if="report.status === 'open'" size="sm" type="green">Open</FwbBadge>
          <FwbBadge v-if="report.status === 'in progress'" size="sm" type="yellow"
            >In progress</FwbBadge
          >
          <FwbBadge v-if="report.status === 'closed'" size="sm" type="red">Closed</FwbBadge>
        </FwbTableCell>
        <FwbTableCell class="align-center flex justify-center">
          <FwbButton
            color="purple"
            square
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'Report', params: { id: report.id } } as any"
          >
            View
          </FwbButton>
        </FwbTableCell>
      </FwbTableRow>
    </FwbTableBody>
  </FwbTable>
</template>
