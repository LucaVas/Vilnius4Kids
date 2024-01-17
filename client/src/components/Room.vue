<script lang="ts" setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import type { BareRoom } from '@homedesign/server/src/shared/entities';
import { FwbButton, FwbModal, FwbInput } from 'flowbite-vue';
import Card from './Card.vue';
import { ref } from 'vue';
import { trpc } from '../trpc';
import useErrorMessage from '../composables/useErrorMessage/index';
import AlertError from '@/components/AlertError.vue';

const props = defineProps<{
  room: BareRoom;
}>();

const editedRoom = ref<BareRoom>(props.room);
const isEditRoom = ref(false);

const [editRoom, errorMessage] = useErrorMessage(async () => {
  await trpc.room.updateRoom.mutate({
    ...editedRoom.value,
  });

  isEditRoom.value = false;
});
</script>

<template>
  <Card class="flex flex-row items-center justify-between" data-testid="room">
    <h5 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      {{ room.name }}
    </h5>
    <div>
      <FwbButton @click="isEditRoom = true">Edit</FwbButton>
      <!-- prettier-ignore -->
      <FwbButton
      component="RouterLink"
      tag="router-link"
      data-testid="viewRoom"
      :href="({ name: 'Room', params: { id: room.id } } as any)"
      class="pr-3 ml-3"
    >
      View
      <ArrowRightIcon aria-hidden="true" class="inline h-4 w-4" />
    </FwbButton>
    </div>
  </Card>
  <FwbModal v-if="isEditRoom" @close="isEditRoom = false">
    <template #header>
      <div class="flex items-center text-lg">Edit room</div>
    </template>
    <template #body>
      <div class="mt-6 flex flex-col gap-4">
        <FwbInput
          aria-label="Room name"
          v-model="editedRoom.name"
          :minlength="2"
          :required="true"
          label="Room name"
          placeholder="My Room"
        />

        <!-- @vue-skip -->
        <FwbInput
          aria-label="Room width"
          v-model="editedRoom.width"
          :type="'number'"
          :minlength="1"
          :required="true"
          label="Room width"
          placeholder="0.00"
        />

        <!-- @vue-skip -->
        <FwbInput
          aria-label="Room length"
          v-model="editedRoom.length"
          :type="'number'"
          :minlength="1"
          :required="true"
          label="Room length"
          placeholder="0.01"
        />
      </div>
      <AlertError :message="errorMessage" />
    </template>
    <template #footer>
      <FwbButton type="submit" @click="editRoom">Save</FwbButton>
      <FwbButton type="submit" @click="isEditRoom = false">Cancel</FwbButton>
    </template>
  </FwbModal>
</template>
