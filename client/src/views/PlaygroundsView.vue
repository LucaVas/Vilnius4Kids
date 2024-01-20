<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { trpc } from '../trpc';
import { Address } from '../../../server/src/entities/address/address';

type Marker = {
  id: number;
  address: Address;
  position: {
    lat: number;
    lng: number;
  };
};

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

onBeforeMount(async () => {
  const { playgrounds } = await trpc.playground.getPlaygrounds.query();
  mapInfo.value.markers = playgrounds.map((p) => ({
    id: p.id,
    position: {
      lat: Number(p.latitude),
      lng: Number(p.longitude),
    },
    address: p.address,
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
        <div>{{ m.address.street }} {{  m.address.number }} - {{ m.address.zipCode }}, {{ m.address.city }}</div>
      </GMapInfoWindow>
    </GMapMarker>
  </GMapMap>
</template>
