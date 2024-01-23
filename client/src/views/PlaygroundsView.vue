<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';
import { Address } from '../../../server/src/entities/address/address';
import { FwbButton, FwbButtonGroup, FwbCard } from 'flowbite-vue';
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

const loading = ref(false);

const mapInfo = ref({
  center: {
    lat: 54.6872,
    lng: 25.2797,
  },
  options: {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
  },
  markers: [] as Marker[],
});

const openedMarkerID = ref<number | null>();

function openMarker(id: number | null) {
  openedMarkerID.value = id;
}

async function savePlayground(id: number) {
  loading.value = true;
  const success = await trpc.playground.addFavoritePlayground.mutate({ id });
  if (success.message) {
    loading.value = false;
    mapInfo.value.markers.map(m => m.id === id ? m.saved = true : null)
  }
}

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getPlaygrounds.query();
  mapInfo.value.markers = playgrounds.map((p) => ({
    id: p.id,
    position: {
      lat: Number(p.latitude),
      lng: Number(p.longitude),
    },
    address: p.address,
    saved: p.users.some(user => user.id === authUserId.value)
  }));
});
</script>

<template>
  <!-- landing page with Tailwind -->

  <GMapMap :center="mapInfo.center" :zoom="12" map-type-id="terrain" class="h-96 w-full">
    <GMapMarker
      :key="index"
      v-for="(m, index) in mapInfo.markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="openMarker(m.id)"
    >
      <GMapInfoWindow
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
          <div class="flex flex-col bg-gray-200 p-5">
            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ m.address.street }} {{ m.address.number }} - {{ m.address.zipCode }},
              {{ m.address.city }}
            </h5>
            <FwbButtonGroup class="flex justify-end gap-1">
              <FwbButton
              v-if="!m.saved"
                :loading="loading"
                loading-position="suffix"
                color="dark"
                outline
                square
                @click="savePlayground(m.id)"
                >Save
                  <template #suffix>
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </template>
                
              </FwbButton>
                <FwbButton v-else color="green">Saved</FwbButton>

              <FwbButton color="dark" outline square>
                <svg
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    fill-rule="evenodd"
                  />
                </svg>
              </FwbButton>
            </FwbButtonGroup>
          </div>
        </FwbCard>
      </GMapInfoWindow>
    </GMapMarker>
  </GMapMap>
</template>
