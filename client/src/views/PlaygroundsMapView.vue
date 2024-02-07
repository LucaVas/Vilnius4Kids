<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { trpc } from '../trpc';
import { Address } from '../../../server/src/entities/address/address';
import { FwbButton, FwbButtonGroup, FwbCard, FwbSpinner } from 'flowbite-vue';
import { authUserId } from '../stores/user';

type Marker = {
  id: number;
  saved: boolean;
  address: Address;
  position: {
    lat: number;
    lng: number;
  };
};

const loadingSave = ref(false);
const pageLoaded = ref(false);

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

onMounted(async () => {
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
      <GMapMarker
        :key="index"
        v-for="(m, index) in mapInfo.markers"
        :data-testid="'map-marker-' + m.id"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="{
          url: 'https://img.icons8.com/color/48/marker--v1.png',
          scaledSize: { width: 25, height: 25 },
          labelOrigin: { x: 16, y: -10 },
        }"
        @click="openMarker(m.id)"
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
            <div class="flex flex-col bg-gray-200 p-4">
              <h5
                class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
                data-testid="infobox-playground-address"
              >
                {{ m.address.street }} {{ m.address.number }}, {{ m.address.zipCode }} -
                {{ m.address.city }}
              </h5>
              <FwbButtonGroup class="flex w-full items-center justify-end gap-1">
                <FwbButton color="purple" size="xs" outline square>
                  <a :href="getAppUrl(m.position.lat, m.position.lng)">Open in Maps</a>
                </FwbButton>
                <FwbButton
                  v-if="!m.saved"
                  :disabled="loadingSave"
                  :loading="loadingSave"
                  size="xs"
                  color="green"
                  square
                  outline
                  class="min-w-min"
                  @click="savePlayground(m.id)"
                  >Save
                </FwbButton>
                <FwbButton
                  v-else
                  :loading="loadingSave"
                  data-testid="save-playground-button"
                  color="green"
                  size="xs"
                  @click="unsavePlayground(m.id)"
                  >Unsave
                </FwbButton>

                <FwbButton
                  color="yellow"
                  outline
                  square
                  size="xs"
                  data-testid="go-to-playground-button"
                  component="RouterLink"
                  tag="router-link"
                  :href="{ name: 'Playground', params: { id: m.id } } as any"
                >
                  <svg
                    class="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </FwbButton>
              </FwbButtonGroup>
            </div>
          </FwbCard>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapMap>

    <FwbSpinner v-else size="12" />
  </div>
</template>

<style scoped>
.map {
  margin: -1rem 0rem;
  width: 100svw;
  height: 75svh;
}
</style>
