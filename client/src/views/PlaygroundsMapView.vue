<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import Map from '@/components/Map.vue';
import { FwbSpinner } from 'flowbite-vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const pageLoaded = ref(false);
onBeforeMount(async () => {
  pageLoaded.value = false;
  mapStore.populate();
  mapStore.loadUserLocation();
  pageLoaded.value = true;
});
</script>

<template>
  <div class="flex h-full w-full" data-testid="playgrounds-map">
    <Map v-if="pageLoaded" class="h-full w-full" />
    <FwbSpinner
      v-else
      size="12"
      color="purple"
      class="absolute left-1/2 top-1/2"
    />
  </div>
</template>
