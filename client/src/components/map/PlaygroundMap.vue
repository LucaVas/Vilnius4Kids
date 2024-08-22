<script lang="ts" setup>
import { ref, computed } from 'vue';
import { GoogleMap, AdvancedMarker } from 'vue3-google-map';
import { googleMapsApiKey, googleMapsMapId } from '@/config';
import type { Marker, Location } from '@/components/types/Map';
import MapInfoWindow from './MapInfoWindow.vue';

const save = (id: number) => {
  mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = true) : null));
};

const unsave = (id: number) => {
  mapInfo.value.markers.map((m) => (m.id === id ? (m.saved = false) : null));
};

const props = defineProps<{
  userLocation: Location | undefined;
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
        stylers: [{ visibility: 'on' }, { saturation: -100 }, { color: '#99FF33' }],
      },
      {
        featureType: 'administrative',
        stylers: [{ visibility: 'off' }],
      },
    ],
  },
  markers: props.markers,
});

const playgroundLocation = ref<Location | undefined>();
const openedMarker = ref<Marker>();
const openMarker = (marker: Marker | null) => {
  if (marker) {
    openedMarker.value = marker;
    playgroundLocation.value = marker.position;
  }
};
const mapCenter = computed(() => {
  if (openedMarker.value) {
    return openedMarker.value.position;
  } else return props.userLocation ?? mapInfo.value.center;
});
</script>

<template>
  <GoogleMap
    :language="`US-en`"
    :api-key="googleMapsApiKey"
    class="map"
    :center="mapCenter"
    :zoom="12"
    :map-id="googleMapsMapId"
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
      :options="{ position: marker.position, gmpDraggable: false }"
      @click="openMarker(marker)"
    />
    <MapInfoWindow
      :userLocation="userLocation"
      :marker="openedMarker"
      @close="openedMarker = undefined"
      @save="(id) => save(id)"
      @unsave="(id) => unsave(id)"
      class="mb-3 mr-3"
    />
  </GoogleMap>
</template>

<style scoped>
.map {
  width: 100svw;
  height: 96svh;
}
</style>
