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
  FwbImg,
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
    <FwbSpinner size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
  <div v-else class="flex h-full w-full flex-col rounded-lg bg-white p-6">
    <form class="mb-8 space-y-6 border border-transparent border-b-gray-200 pb-8">
      <div class="mb-2 flex flex-row justify-between">
        <FwbHeading tag="h5" class="w-full"> Report details </FwbHeading>
        <FwbHeading tag="h5" class="max-w-max text-slate-500">
          # {{ currentReport?.id }}
        </FwbHeading>
      </div>

      <div class="mb-2 flex flex-row justify-between gap-2">
        <FwbInput
          class="w-1/2 text-black"
          :placeholder="currentReport!.category.topic"
          label="Topic"
          disabled
        />
        <FwbInput
          class="w-1/2 text-black"
          :placeholder="currentReport!.category.name"
          label="Category"
          disabled
        />
      </div>
      <div class="mb-4">
        <FwbInput
          class="w-full text-black"
          :placeholder="getStringifiedStreet(currentReport!.playground.address)"
          label="Playground"
          disabled
        />
      </div>
      <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div class="flex items-center gap-2">
          <FwbP class="text-sm">Status</FwbP>
          <FwbBadge v-if="currentReport!.status === 'open'" size="sm" type="green">Open</FwbBadge>
          <FwbBadge v-if="currentReport!.status === 'in progress'" size="sm" type="yellow"
            >In progress</FwbBadge
          >
          <FwbBadge v-if="currentReport!.status === 'closed'" size="sm" type="red">Closed</FwbBadge>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <FwbP class="border border-transparent p-0 text-sm sm:border-r-black sm:pr-2">
            Opened: {{ getAge(currentReport!.createdAt) }} days ago</FwbP
          >
          <FwbP class="border border-transparent text-sm">
            Last update:
            {{ getAge(currentReport!.changeLogs[currentReport!.changeLogs.length - 1].changedAt) }}
            days ago
          </FwbP>
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
    <div v-if="currentReport!.images" class="flex flex-col">
      <FwbHeading tag="h5" class="mb-4">Images</FwbHeading>
      <div class="flex max-h-[15rem] w-full gap-3 overflow-x-scroll">
        <FwbImg
          v-for="image in currentReport!.images"
          :key="image.id"
          :alt="image.name"
          img-class="rounded-lg border-[1px]"
          size="max-w-lg"
          :src="image.url"
        />
      </div>
    </div>
  </div>
</template>
