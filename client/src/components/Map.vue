<script lang="ts" setup>
import { GoogleMap, AdvancedMarker } from 'vue3-google-map';
import { googleMapsApiKey, googleMapsMapId } from '@/config';
import MapInfoWindow from '@/components/MapInfoWindow.vue';
import { useMapStore } from '@/stores/mapStore';
import AppAuthenticateModal from './AppAuthenticateModal.vue';

const mapStore = useMapStore();
</script>

<template>
  <GoogleMap
    :language="`US-en`"
    :api-key="googleMapsApiKey"
    class="map"
    :center="mapStore.mapCenter"
    :zoom="14"
    :map-id="googleMapsMapId"
    :disable-default-ui="true"
    :gesture-handling="`greedy`"
    :map-type-id="`roadmap`"
    :map-type-control="false"
    :zoom-control="false"
    :scale-control="false"
    :street-view-control="true"
    :rotate-control="true"
    :fullscreen-control="true"
    :my-location-enabled="true"
    :styles="mapStore.styles"
  >
    <AdvancedMarker
      v-if="mapStore.userLocation"
      :options="{ position: mapStore.userLocation }"
      :pin-options="{ background: '#FBBC04', scale: 0.5 }"
    />

    <AdvancedMarker
      v-for="marker in mapStore.playgrounds"
      :key="marker.id"
      :options="{ position: marker.position, gmpDraggable: false }"
      @click="mapStore.openMarker(marker);"
      :pin-options="{ scale: 0.5 }"
    />
    <MapInfoWindow @close="mapStore.closeMarker()" class="mb-3 mr-3" />
  </GoogleMap>

  <AppAuthenticateModal
    :isOpen="mapStore.authModalOpen"
    @close="mapStore.authModalOpen = false"
    >If you wish to save this playground, you must log in or create an
    account.</AppAuthenticateModal
  >
</template>

<style scoped>
.map {
  width: 100svw;
  height: 96svh;
}
</style>
