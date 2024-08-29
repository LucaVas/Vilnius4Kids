<script setup lang="ts">
import { FwbButtonGroup, FwbButton } from 'flowbite-vue';
import { useMapStore } from '@/stores/mapStore';

function getGMapsUrl(lat: number, lng: number) {
  return `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
}

const mapStore = useMapStore();
</script>

<template>
  <FwbButtonGroup
    v-if="mapStore.openedMarker"
    class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#cddcf24b] p-3 shadow-md"
  >
    <FwbButton
      color="dark"
      outline
      size="md"
      class="flex w-[3rem] items-center justify-center p-1"
      square
    >
      <a
        :href="
          getGMapsUrl(
            mapStore.openedMarker.position.lat,
            mapStore.openedMarker.position.lng
          )
        "
        target="_blank"
        rel="noreferrer"
        ><img src="@/assets/map.png" alt="Maps icon" class="max-h-7"
      /></a>
    </FwbButton>
    <FwbButton
      v-if="!mapStore.openedMarker.saved"
      :disabled="mapStore.saveUnsaveBtnLoading"
      :loading="mapStore.saveUnsaveBtnLoading"
      color="dark"
      size="md"
      square
      outline
      class="min-w-[3rem]"
      loading-position="suffix"
      @click="mapStore.savePlayground()"
      ><template #prefix></template>Save
      <template #suffix></template>
    </FwbButton>
    <FwbButton
      v-else
      :loading="mapStore.saveUnsaveBtnLoading"
      data-testid="save-playground-button"
      color="dark"
      size="md"
      loading-position="suffix"
      @click="mapStore.unsavePlayground(mapStore.openedMarker.id)"
      ><template #prefix></template>Unsave
      <template #suffix></template>
    </FwbButton>

    <FwbButton
      color="purple"
      square
      size="md"
      class="w-[3rem] text-center"
      data-testid="go-to-playground-button"
      component="RouterLink"
      tag="router-link"
      :href="
        { name: 'Playground', params: { id: mapStore.openedMarker.id } } as any
      "
    >
      View
    </FwbButton>
  </FwbButtonGroup>
</template>
