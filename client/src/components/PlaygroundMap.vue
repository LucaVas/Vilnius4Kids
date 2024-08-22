<script lang="ts" setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import { trpc } from '@/trpc';
import { Address } from '../../../server/src/entities/address/address';
import { FwbButton, FwbButtonGroup, FwbCard, FwbSpinner, FwbBadge } from 'flowbite-vue';
import { authUserId } from '@/stores/user';
import useErrorMessage from '@/composables/useErrorMessage/index';
import { GoogleMap, AdvancedMarker } from 'vue3-google-map';
import { googleMapsApiKey } from '@/config';
import { type Marker } from '@/components/types/Map';

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

// function getUserLocation() {
//   geolocationLoading.value = true;
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
//       userLocation.value = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };
//       geolocationAllowed.value = true;
//       geolocationLoading.value = false;
//       if (playgroundLocation.value) calculateDistance();
//     }),
//       (error: GeolocationPositionError) => {
//         geolocationAllowed.value = false;
//         geolocationLoading.value = false;
//         console.error(
//           'Geolocation is not supported or not allowed. Allow geolocation to use distance calculation feature.' +
//             error.message
//         );
//       };
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

const props = defineProps<{
  center: string,
  markers: Marker[];
}>();

const mapInfo = ref({
  center: {
    lat: 54.6872,
    lng: 25.2797,
  },
  options: {
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: 'poi.school',
        stylers: [{ visibility: 'on' }, { "saturation": -100 }, { "color": "#99FF33" }],
      },
      {
        featureType: 'administrative',
        stylers: [{ visibility: 'off' }],
      },
    ],
  },
  markers: props.markers,
});
</script>

<template>
  <GoogleMap
    :language="`US-en`"
    :api-key="googleMapsApiKey"
    class="map"
    :center="center ?? mapInfo.center"
    :zoom="12"
    :map-id="`DEMO_MAP_ID`"
    :options="mapInfo.options"
    :disable-default-ui="true"
    :gesture-handling="`greedy`"
    :map-type-id="`roadmap`"
    :map-type-control="false"
    :zoom-control="false"
    :scale-control="false"
    :street-view-control="true"
    :rotate-control="true"
    :fullscreen-control="true"
    :styles="mapInfo.options.styles"
  >
    <AdvancedMarker
      v-for="marker in markers"
      :key="marker.id"
      :options="{ position: marker.position }"
    />
  </GoogleMap>
</template>

<style scoped>
.map {
  width: 100svw;
  height: 100svh;
}
</style>
