<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { trpc } from '@/trpc';
import { authUserId } from '@/stores/user';
import useErrorMessage from '@/composables/useErrorMessage/index';
import PlaygroundMap from '@/components/PlaygroundMap.vue';
import { type Marker } from '@/components/types/Map';
import { FwbSpinner } from 'flowbite-vue';

// const loadingSave = ref(false);
// const pageLoaded = ref(false);
// const userLocation = ref<Location>();
// const geolocationAllowed = ref(false);
// const geolocationLoading = ref(false);
// const playgroundLocation = ref<Location | undefined>();
// const playgroundDistance = ref('');
// const distanceRetrieved = ref(false);
// const retrievingDistance = ref(false);

// const openedMarkerID = ref<number | null>();

// function getAppUrl(lat: number, lng: number) {
//   const isIOS =
//     /iPad|iPhone|iPod/.test(navigator.platform) ||
//     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

//   const isMac = /Mac/.test(navigator.platform);

//   if (isIOS || isMac) {
//     return `maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
//   }
//   return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
// }

// function openMarker(id: number | null) {
//   openedMarkerID.value = id;
// }

// async function savePlayground(id: number) {
//   loadingSave.value = true;
//   const success = await trpc.playground.addFavoritePlayground.mutate({ id });
//   if (success.message) {
//     loadingSave.value = false;
//     mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = true) : null));
//   }
// }

// async function unsavePlayground(id: number) {
//   loadingSave.value = true;
//   const success = await trpc.playground.deleteFavoritePlayground.mutate({ id });
//   if (success.message) {
//     loadingSave.value = false;
//     mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = false) : null));
//   }
// }

// const [calculateDistance, errorMessage] = useErrorMessage(async () => {
//   distanceRetrieved.value = false;
//   retrievingDistance.value = true;
//   if (!geolocationLoading.value) {
//     if (geolocationAllowed.value && playgroundLocation.value && userLocation.value) {
//       playgroundDistance.value = await trpc.playground.getDistance.query({
//         origin: userLocation.value,
//         destination: playgroundLocation.value,
//       });
//       distanceRetrieved.value = true;
//       retrievingDistance.value = false;
//     } else {
//       geolocationAllowed.value = false;
//       retrievingDistance.value = false;
//     }
//   }
// });

const geolocationLoading = ref(false);
const geolocationAllowed = ref(false);
const userLocation = ref();
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
      // if (playgroundLocation.value) calculateDistance();
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
      :center="userLocation"
      class="h-full w-full"
    />
    <FwbSpinner v-else size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
</template>
