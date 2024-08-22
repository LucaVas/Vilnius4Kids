<script setup lang="ts">
import { FwbSpinner, FwbBadge } from 'flowbite-vue';
import { ref, watch, onMounted } from 'vue';
import useErrorMessage from '@/composables/useErrorMessage/index';
import { type Marker } from '@/components/types/Map';
import { trpc } from '@/trpc';
import { type Location } from '@/components/types/Map';

const props = defineProps<{
  marker: Marker | undefined;
  userLocation: Location | undefined;
}>();

const retrievingDistance = ref(false);
const distanceRetrieved = ref(false);
const playgroundDistance = ref('');

const [calculateDistance, errorMessage] = useErrorMessage(async () => {
  distanceRetrieved.value = false;
  retrievingDistance.value = true;
  if (props.marker) {
    if (props.marker.position && props.userLocation) {
      playgroundDistance.value = await trpc.playground.getDistance.query({
        origin: props.userLocation,
        destination: props.marker.position,
      });
      distanceRetrieved.value = true;
      retrievingDistance.value = false;
    } else {
      retrievingDistance.value = false;
    }
  }
});

watch(
  () => props.marker,
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
    <FwbBadge v-if="!userLocation" size="sm" type="red" class="w-full"
      >Geolocation not available</FwbBadge
    >
    <FwbBadge v-if="distanceRetrieved" size="sm" type="indigo" class="w-full"
      >{{ playgroundDistance }} away from you.</FwbBadge
    >
    <FwbBadge v-if="errorMessage" size="sm" type="red">{{ errorMessage }}</FwbBadge>
  </div>
</template>
