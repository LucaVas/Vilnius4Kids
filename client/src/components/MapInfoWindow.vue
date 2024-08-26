<script setup lang="ts">
import { InfoWindow } from 'vue3-google-map';
import MapInfoWindowCard from '@/components/MapInfoWindowCard.vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <InfoWindow
    v-if="mapStore.openedMarker"
    :options="{
      position: mapStore.openedMarker.position,
      maxWidth: 320,
      minWidth: 320,
      pixelOffset: {
        height: -20,
      },
    }"
    :closeclick="true"
    @closeclick="$emit('close')"
  >
    <MapInfoWindowCard />
  </InfoWindow>
</template>
