<script lang="ts" setup>
import { ref } from 'vue';

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
  markers: [
    {
      id: 'dfsldjl3r',
      position: {
        lat: 54.6872,
        lng: 25.2797,
      },
    },
  ],
});

const openedMarkerID = ref<string | null>();

function openMarker(id: string | null) {
  openedMarkerID.value = id;
}
</script>

<template>
  <!-- landing page with Tailwind -->

  <GMapMap :center="mapInfo.center" :zoom="12" map-type-id="terrain" class="h-96 w-full">
    <GMapMarker :key="index" v-for="(m, index) in mapInfo.markers" :position="m.position" :clickable="true" :draggable="true"
        @click="openMarker(m.id)" >
          <GMapInfoWindow
          :closeclick="true"
          @closeclick="openMarker(null)"
          :opened="openedMarkerID === m.id"
          :options=" {
              pixelOffset: {
                width: 10, height: 0
              },
              maxWidth: 320,
              maxHeight: 320,
       }"
      >
        <div>I am in info window {{ m.id }} </div>
      </GMapInfoWindow>
        </GMapMarker>
  </GMapMap>
</template>
