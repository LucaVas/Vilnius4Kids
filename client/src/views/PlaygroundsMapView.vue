<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';
import { Address } from '../../../server/src/entities/address/address';
import { FwbButton, FwbButtonGroup, FwbCard, FwbSpinner, FwbBadge } from 'flowbite-vue';
import { authUserId } from '../stores/user';
import useErrorMessage from '../composables/useErrorMessage/index';

type Marker = {
  id: number;
  saved: boolean;
  address: Address;
  position: {
    lat: number;
    lng: number;
  };
};
type Location = {
  lat: number;
  lng: number;
};

const loadingSave = ref(false);
const pageLoaded = ref(false);
const userLocation = ref<Location>();
const geolocationAllowed = ref(false);
const geolocationLoading = ref(false);
const playgroundLocation = ref<Location | undefined>();
const playgroundDistance = ref('');
const distanceRetrieved = ref(false);
const retrievingDistance = ref(false);

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
        featureType: 'poi',
        // deselects all point of interest areas
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'poi.school',
        stylers: [{ visibility: 'on' }],
      },
      {
        featureType: 'administrative',
        // deselects all administrative areas
        stylers: [{ visibility: 'off' }],
      },
    ],
  },
  markers: [] as Marker[],
});

const openedMarkerID = ref<number | null>();

function getAppUrl(lat: number, lng: number) {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isMac = /Mac/.test(navigator.platform);

  if (isIOS || isMac) {
    return `maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
  }
  return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

function openMarker(id: number | null) {
  openedMarkerID.value = id;
}

async function savePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.addFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = true) : null));
  }
}

async function unsavePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.deleteFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = false) : null));
  }
}

function getUserLocation() {
  geolocationLoading.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geolocationAllowed.value = true;
      geolocationLoading.value = false;
      if (playgroundLocation.value) calculateDistance();
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
}

const [calculateDistance, errorMessage] = useErrorMessage(async () => {
  distanceRetrieved.value = false;
  retrievingDistance.value = true;
  if (!geolocationLoading.value) {
    if (geolocationAllowed.value && playgroundLocation.value && userLocation.value) {
      playgroundDistance.value = await trpc.playground.getDistance.query({
        origin: userLocation.value,
        destination: playgroundLocation.value,
      });
      distanceRetrieved.value = true;
      retrievingDistance.value = false;
    } else {
      geolocationAllowed.value = false;
      retrievingDistance.value = false;
    }
  }
});

onBeforeMount(async () => {
  pageLoaded.value = false;
  const { playgrounds } = await trpc.playground.getPlaygrounds.query();
  mapInfo.value.markers = playgrounds.map((p) => ({
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
  <!-- landing page with Tailwind -->
  <div class="flex items-center justify-center" data-testid="playgrounds-map">
    <GMapMap
      v-if="pageLoaded"
      :center="mapInfo.center"
      :zoom="11"
      :options="mapInfo.options"
      class="map"
    >
      <div data-testid="mapMarkers">
        <GMapMarker
          :key="index"
          v-for="(m, index) in mapInfo.markers"
          :data-testid="'mapMarker-' + m.id"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          :icon="{
            url: 'https://img.icons8.com/color/48/marker--v1.png',
            scaledSize: { width: 25, height: 25 },
            labelOrigin: { x: 16, y: -10 },
          }"
          @click="
            openMarker(m.id);
            playgroundLocation = m.position;
            calculateDistance();
          "
        >
          <GMapInfoWindow
            data-testid="infobox"
            :closeclick="true"
            @closeclick="openMarker(null)"
            :opened="openedMarkerID === m.id"
            :options="{
              pixelOffset: {
                width: 10,
                height: 0,
              },
              maxWidth: 320,
              maxHeight: 320,
            }"
          >
            <FwbCard>
              <div class="flex min-w-fit flex-col gap-6 bg-slate-100 p-4 sm:p-6">
                <h5
                  class="mb-2 text-lg font-bold tracking-tight text-gray-900"
                  data-testid="infobox-playground-address"
                >
                  {{ m.address.street }} {{ m.address.number }}, {{ m.address.zipCode }} -
                  {{ m.address.city }}
                </h5>

                <div class="flex w-full items-center justify-center">
                  <FwbSpinner
                    v-if="retrievingDistance && geolocationAllowed"
                    size="4"
                    color="purple"
                  />
                  <FwbBadge v-if="!geolocationAllowed" size="sm" type="red" class="w-full"
                    >Geolocation not available</FwbBadge
                  >
                  <FwbBadge
                    v-if="!geolocationLoading && distanceRetrieved"
                    size="sm"
                    type="indigo"
                    class="w-full"
                    >{{ playgroundDistance }} away from you.</FwbBadge
                  >
                  <FwbBadge v-if="errorMessage" size="sm" type="red">{{ errorMessage }}</FwbBadge>
                </div>

                <FwbButtonGroup class="flex w-full items-center justify-evenly gap-4">
                  <FwbButton color="dark" outline size="md" class="p-1" square>
                    <a
                      :href="getAppUrl(m.position.lat, m.position.lng)"
                      target="_blank"
                      rel="noreferrer"
                      ><img src="@/assets/map.png" alt="Maps icon" class="max-h-7"
                    /></a>
                  </FwbButton>
                  <FwbButton
                    v-if="!m.saved"
                    :disabled="loadingSave"
                    :loading="loadingSave"
                    color="dark"
                    square
                    outline
                    loading-position="suffix"
                    @click="savePlayground(m.id)"
                    ><template #prefix></template>Save
                    <template #suffix></template>
                  </FwbButton>
                  <FwbButton
                    v-else
                    :loading="loadingSave"
                    data-testid="save-playground-button"
                    color="dark"
                    size="md"
                    loading-position="suffix"
                    @click="unsavePlayground(m.id)"
                    ><template #prefix></template>Unsave
                    <template #suffix></template>
                  </FwbButton>

                  <FwbButton
                    color="purple"
                    square
                    size="md"
                    data-testid="go-to-playground-button"
                    component="RouterLink"
                    tag="router-link"
                    :href="{ name: 'Playground', params: { id: m.id } } as any"
                  >
                    View
                  </FwbButton>
                </FwbButtonGroup>
              </div>
            </FwbCard>
          </GMapInfoWindow>
        </GMapMarker>
      </div>
    </GMapMap>

    <FwbSpinner v-else size="12" color="purple" class="absolute left-1/2 top-1/2" />
  </div>
</template>

<style scoped>
.map {
  margin: -1rem 0rem;
  width: 100svw;
  height: 75svh;
}
</style>
