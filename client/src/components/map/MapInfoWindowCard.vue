<script setup lang="ts">
import { FwbCard, FwbButtonGroup, FwbButton } from 'flowbite-vue';
import type { Marker, Location } from '@/components/types/Map';
import { ref } from 'vue';
import { trpc } from '@/trpc';
import MapInfoWindowGeolocationBadge from '@/components/map/MapInfoWindowGeolocationBadge.vue';

defineProps<{
  marker: Marker | undefined;
  userLocation: Location | undefined;
}>();

function getGMapsUrl(lat: number, lng: number) {
  return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

const loadingSave = ref(false);
async function savePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.addFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    emits('save', id);
  }
}

async function unsavePlayground(id: number) {
  loadingSave.value = true;
  const success = await trpc.playground.deleteFavoritePlayground.mutate({ id });
  if (success.message) {
    loadingSave.value = false;
    emits('unsave', id);
  }
}

const emits = defineEmits<{
  (e: 'save', id: number): void;
  (e: 'unsave', id: number): void;
}>();
</script>

<template>
  <FwbCard v-if="marker">
    <div class="flex min-w-fit flex-col gap-6 bg-slate-100 p-4 sm:p-6">
      <h5
        class="mb-2 text-lg font-bold tracking-tight text-gray-900"
        data-testid="infobox-playground-address"
      >
        {{ marker.address.street }} {{ marker.address.number }}, {{ marker.address.zipCode }} -
        {{ marker.address.city }}
      </h5>

      <MapInfoWindowGeolocationBadge :marker="marker" :userLocation="userLocation" />

      <FwbButtonGroup class="flex w-full items-center justify-between gap-4">
        <FwbButton color="dark" outline size="md" class="p-1" square>
          <a
            :href="getGMapsUrl(marker.position.lat, marker.position.lng)"
            target="_blank"
            rel="noreferrer"
            ><img src="@/assets/map.png" alt="Maps icon" class="max-h-7"
          /></a>
        </FwbButton>
        <FwbButton
          v-if="!marker.saved"
          :disabled="loadingSave"
          :loading="loadingSave"
          color="dark"
          square
          outline
          loading-position="suffix"
          @click="savePlayground(marker.id)"
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
          @click="unsavePlayground(marker.id)"
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
          :href="{ name: 'Playground', params: { id: marker.id } } as any"
        >
          View
        </FwbButton>
      </FwbButtonGroup>
    </div>
  </FwbCard>
</template>
