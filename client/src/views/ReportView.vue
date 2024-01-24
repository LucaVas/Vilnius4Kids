<script setup lang="ts">
import {
  FwbBadge,
  FwbCarousel,
  FwbRating,
  FwbSpinner,
  FwbAlert,
  FwbP,
  FwbButtonGroup,
  FwbButton,
  FwbTimeline,
  FwbTimelineItem,
  FwbTimelinePoint,
  FwbTimelineContent,
  FwbTimelineTime,
  FwbTimelineTitle,
  FwbTimelineBody,
} from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { Report } from '../../../server/src/entities/report/report';
import { FwbInput, FwbHeading } from 'flowbite-vue';
import { Address } from '../../../server/src/entities/address/address';

const route = useRoute();
const reportId = Number(route.params.id);
const currentReport = ref<Report>();
const pageLoaded = ref(false);

function convertDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

function getStringifiedStreet(address: Address) {
  return `${address.street} ${address.number}, ${address.zipCode} ${address.city}`;
}

function getAge(date: Date) {
  const today = new Date();
  const dateToCompare = new Date(date);
  const diffTime = Math.abs(today.getTime() - dateToCompare.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

onBeforeMount(async () => {
  const report = await trpc.report.getReportById.query({ id: reportId });
  if (report) {
    currentReport.value = report;
    pageLoaded.value = true;
  }
});
</script>

<template>
  <div v-if="!pageLoaded" class="flex h-full items-center justify-center">
    <FwbSpinner size="12" />
  </div>
  <div v-else class="flex h-full w-full flex-col px-4 py-2">
    <form class="mb-6">
      <div class="mb-2 flex flex-row justify-between gap-2">
        <FwbInput class="w-1/2 text-black" :value="currentReport!.category.topic" label="Topic" disabled />
        <FwbInput class="w-1/2 text-black" :value="currentReport!.category.name" label="Category" disabled />
      </div>
      <div class="mb-4">
        <FwbInput
          class="w-full text-black"
          :value="getStringifiedStreet(currentReport!.playground.address)"
          label="Playground"
          disabled
        />
      </div>
      <div class="flex gap-2">
        <div class="flex items-center gap-2">
          <FwbP class="text-sm">Status</FwbP>
          <FwbBadge v-if="currentReport!.status === 'open'" size="sm" type="green">Open</FwbBadge>
          <FwbBadge v-if="currentReport!.status === 'in progress'" size="sm" type="yellow"
            >In progress</FwbBadge
          >
          <FwbBadge v-if="currentReport!.status === 'closed'" size="sm" type="red">Closed</FwbBadge>
        </div>
        <div class="flex gap-2">
          <FwbP class="text-sm">Aging: {{ getAge(currentReport!.createdAt) }} days</FwbP>
          <FwbP class="text-sm"
            >Last update:
            {{ getAge(currentReport!.changeLogs[currentReport!.changeLogs.length - 1].changedAt) }}
            days ago</FwbP
          >
        </div>
      </div>
    </form>
    <div class="bg-gray-600 p-4">
      <FwbHeading tag="h5" class="mb-4">Timeline</FwbHeading>
      <FwbTimeline>
        <FwbTimelineItem v-for="log in currentReport?.changeLogs" :key="log.id">
          <FwbTimelinePoint />
          <FwbTimelineContent>
            <FwbTimelineTime> {{ convertDate(log.changedAt) }} </FwbTimelineTime>
            <FwbTimelineTitle> Status: {{ log.status }} </FwbTimelineTitle>
            <FwbTimelineBody>
              {{ log.changeStatusMessage }}
            </FwbTimelineBody>
          </FwbTimelineContent>
        </FwbTimelineItem>
      </FwbTimeline>
    </div>
  </div>
</template>
