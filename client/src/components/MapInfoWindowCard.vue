<script setup lang="ts">
import { FwbCard } from 'flowbite-vue';
import type { Marker, Location } from '@/components/types/Map';
import MapInfoWindowGeolocationBadge from '@/components/MapInfoWindowGeolocationBadge.vue';
import MapInfoWindowCardButtons from '@/components/MapInfoWindowCardButtons.vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore()

const emits = defineEmits<{
  (e: 'save', id: number): void;
  (e: 'unsave', id: number): void;
}>();
</script>

<template>
  <FwbCard v-if="mapStore.openedMarker">
    <div class="flex min-w-fit flex-col gap-6 bg-slate-100 p-4 sm:p-6">
      <h5
        class="mb-2 text-lg font-bold tracking-tight text-gray-900"
        data-testid="infobox-playground-address"
      >
        {{ mapStore.openedMarker.address.street }} {{ mapStore.openedMarker.address.number }}, {{ mapStore.openedMarker.address.zipCode }} -
        {{ mapStore.openedMarker.address.city }}
      </h5>

      <MapInfoWindowGeolocationBadge />

      <MapInfoWindowCardButtons
        @save="(id) => emits('save', id)"
        @unsave="(id) => emits('unsave', id)"
      />
    </div>
  </FwbCard>
</template>
