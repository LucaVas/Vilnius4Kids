<script setup lang="ts">
import { InfoWindow } from 'vue3-google-map';
import type { Marker, Location } from '@/components/types/Map';
import MapInfoWindowCard from '@/components/map/MapInfoWindowCard.vue';

defineProps<{
  marker: Marker | undefined;
  userLocation: Location | undefined;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'save', id: number): void;
  (e: 'unsave', id: number): void;
}>();
</script>

<template>
  <InfoWindow
    v-if="marker"
    :options="{
      position: marker.position,
      maxWidth: 320,
      minWidth: 320,
      pixelOffset: {
        height: -20,
      },
    }"
    :closeclick="true"
    @closeclick="$emit('close')"
  >
    <MapInfoWindowCard
      :userLocation="userLocation"
      :marker="marker"
      @save="(id) => $emit('save', id)"
      @unsave="(id) => $emit('unsave', id)"
    />
  </InfoWindow>
</template>
