<script setup lang="ts">
import {
  FwbBadge,
  FwbSpinner,
  FwbP,
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
  <div v-if="!pageLoaded">
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2"/>
  </div>
  <div v-else class="flex h-full w-full flex-col bg-slate-300 rounded-lg p-4">
    <form class="mb-6">
      <div class="mb-2 flex flex-row justify-between">
        <FwbHeading tag="h5" class="w-full"> Report details </FwbHeading>
        <FwbHeading tag="h5" class="max-w-max text-slate-500"> # {{ currentReport?.id }} </FwbHeading>
      </div>
      
      <div class="mb-2 flex flex-row justify-between gap-2">
        <FwbInput class="w-1/2 text-black" :placeholder="currentReport!.category.topic" label="Topic" disabled />
        <FwbInput class="w-1/2 text-black" :placeholder="currentReport!.category.name" label="Category" disabled />
      </div>
      <div class="mb-4">
        <FwbInput
          class="w-full text-black"
          :placeholder="getStringifiedStreet(currentReport!.playground.address)"
          label="Playground"
          disabled
        />
      </div>
      <div class="flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
        <div class="flex items-center gap-2">
          <FwbP class="text-sm">Status</FwbP>
          <FwbBadge v-if="currentReport!.status === 'open'" size="sm" type="green">Open</FwbBadge>
          <FwbBadge v-if="currentReport!.status === 'in progress'" size="sm" type="yellow"
            >In progress</FwbBadge
          >
          <FwbBadge v-if="currentReport!.status === 'closed'" size="sm" type="red">Closed</FwbBadge>
        </div>
        <div class="flex gap-2">
          <FwbP class="text-sm"> Opened: {{ getAge(currentReport!.createdAt) }} days ago | </FwbP>
          <FwbP class="text-sm"
            > Last update:
            {{ getAge(currentReport!.changeLogs[currentReport!.changeLogs.length - 1].changedAt) }}
            days ago </FwbP
          >
        </div>
      </div>
    </form>
    <div>
      <FwbHeading tag="h5" class="mb-4">Timeline</FwbHeading>
      <FwbTimeline>
        <FwbTimelineItem v-for="log in currentReport?.changeLogs" :key="log.id">
          <FwbTimelinePoint />
          <FwbTimelineContent>
            <FwbTimelineTime> {{ convertDate(log.changedAt) }} </FwbTimelineTime>
            <FwbTimelineTitle class="text-slate-600"> Status: {{ log.status }} </FwbTimelineTitle>
            <FwbTimelineBody>
              {{ log.changeStatusMessage }}
            </FwbTimelineBody>
          </FwbTimelineContent>
        </FwbTimelineItem>
      </FwbTimeline>
    </div>
  </div>
</template>
