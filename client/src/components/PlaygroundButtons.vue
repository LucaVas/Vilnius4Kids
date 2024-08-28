<script setup lang="ts">
import { FwbButton, FwbButtonGroup } from 'flowbite-vue';
import { usePlaygroundStore } from '@/stores/playgroundsStore';
import { isLoggedIn } from '../stores/user';
import AppAuthenticateModal from '@/components/AppAuthenticateModal.vue';
import { ref } from 'vue';

const playgroundStore = usePlaygroundStore();
const isAuthModalOpen = ref(false);
const saveIfAuthenticated = () => {
  if (isLoggedIn.value) {
    playgroundStore.savePlayground();
  } else {
    isAuthModalOpen.value = true;
  }
};
</script>

<template>
  <div
    class="my-2 flex justify-between gap-2"
    v-if="playgroundStore.openPlayground"
  >
    <FwbButton color="dark" outline square @click="$router.go(-1)"
      >Back</FwbButton
    >
    <FwbButtonGroup class="gap-2">
      <FwbButton
        color="purple"
        v-if="!playgroundStore.isSaved"
        square
        :loading="playgroundStore.saveUnsaveBtnLoading"
        loading-position="suffix"
        @click="saveIfAuthenticated()"
        ><template #prefix></template>Add to favorites<template
          #suffix
        ></template
      ></FwbButton>
      <FwbButton
        color="purple"
        v-else
        square
        :loading="playgroundStore.saveUnsaveBtnLoading"
        loading-position="suffix"
        @click="playgroundStore.unsavePlayground()"
        ><template #prefix></template>Remove from favorites<template
          #suffix
        ></template
      ></FwbButton>
    </FwbButtonGroup>
  </div>

  <AppAuthenticateModal
    :isOpen="isAuthModalOpen"
    @close="isAuthModalOpen = false"
    >If you wish to save this playground among your favorites, you must log in
    or create an account.</AppAuthenticateModal
  >
</template>
