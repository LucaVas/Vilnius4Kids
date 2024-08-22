<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { trpc } from '@/trpc';
import { authUserId } from '@/stores/user';
import PlaygroundMap from '@/components/map/PlaygroundMap.vue';
import type { Marker, Location } from '@/components/types/Map';
import { FwbSpinner } from 'flowbite-vue';

const geolocationLoading = ref(false);
const geolocationAllowed = ref(false);
const userLocation = ref<Location>();
const getUserLocation = () => {
  geolocationLoading.value = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geolocationAllowed.value = true;
      geolocationLoading.value = false;
    }),
      (error: GeolocationPositionError) => {
        geolocationAllowed.value = false;
        geolocationLoading.value = false;
        console.error(
          'Geolocation is not supported or not allowed. Allow geolocation to use distance calculation feature.' +
            error.message
        );
      };
  }
};

const markers = ref<Marker[]>([]);
const pageLoaded = ref(false);
onBeforeMount(async () => {
  pageLoaded.value = false;
  const { playgrounds } = await trpc.playground.getPlaygrounds.query();
  markers.value = playgrounds.map((p) => ({
    id: p.id,
    position: {
      lat: Number(p.latitude),
      lng: Number(p.longitude),
    },
    address: p.address,
    saved: p.users.some((user) => user.id === authUserId.value),
  }));
  getUserLocation();
  pageLoaded.value = true;
});
</script>

<template>
  <div class="flex h-full w-full" data-testid="playgrounds-map">
    <PlaygroundMap
      v-if="pageLoaded"
      :markers="markers"
      :userLocation="userLocation"
      class="h-full w-full"
    />
    <FwbSpinner v-else size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
</template>
