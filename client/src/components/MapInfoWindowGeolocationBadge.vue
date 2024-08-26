<script setup lang="ts">
import { FwbSpinner, FwbBadge } from 'flowbite-vue';
import { ref, watch, onMounted } from 'vue';
import useErrorMessage from '@/composables/useErrorMessage/index';
import { trpc } from '@/trpc';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

const retrievingDistance = ref(false);
const distanceRetrieved = ref(false);
const playgroundDistance = ref('');

const [calculateDistance, errorMessage] = useErrorMessage(async () => {
  distanceRetrieved.value = false;
  retrievingDistance.value = true;
  if (mapStore.openedMarker) {
    if (mapStore.openedMarker.position && mapStore.userLocation) {
      playgroundDistance.value = await trpc.playground.getDistance.query({
        origin: mapStore.userLocation,
        destination: mapStore.openedMarker.position,
      });
      distanceRetrieved.value = true;
      retrievingDistance.value = false;
    } else {
      retrievingDistance.value = false;
    }
  }
});

watch(
  () => mapStore.openedMarker,
  (newValue, oldValue) => {
    calculateDistance();
  }
);

onMounted(() => {
  calculateDistance();
});
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <FwbSpinner v-if="retrievingDistance" size="4" color="purple" />
    <FwbBadge v-if="!mapStore.userLocation" size="xs" type="red" class="w-full text-center"
      >Distance not available. Make sure you allow your location to be discovered.</FwbBadge
    >
    <FwbBadge v-if="distanceRetrieved" size="sm" type="indigo" class="w-full text-center"
      >{{ playgroundDistance }} away from you.</FwbBadge
    >
    <FwbBadge v-if="errorMessage" size="sm" type="red" class="w-full">{{ errorMessage }}</FwbBadge>
  </div>
</template>
