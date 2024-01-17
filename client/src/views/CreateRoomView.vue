<script setup lang="ts">
import { trpc } from '@/trpc';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FwbButton, FwbHeading, FwbInput } from 'flowbite-vue';
import useErrorMessage from '@/composables/useErrorMessage';
import AlertError from '@/components/AlertError.vue';
import { type RoomInsert } from '@homedesign/server/src/shared/entities';

const router = useRouter();

const roomForm = ref({
  name: '',
  width: 0,
  length: 0,
});

const [createRoom, errorMessage] = useErrorMessage(async () => {
  await trpc.room.createRoom.mutate(roomForm.value as RoomInsert);

  router.go(-1);
});
</script>

<template>
  <div class="flex items-center justify-between">
    <form aria-label="Room" @submit.prevent="createRoom">
      <div class="space-y-6">
        <FwbHeading tag="h4">Create a new room</FwbHeading>

        <div class="mt-6">
          <FwbInput
            aria-label="Room name"
            v-model="roomForm.name"
            :minlength="2"
            :required="true"
            label="Room name"
            placeholder="My Room"
          />
          <FwbInput
            aria-label="Room width"
            :value="roomForm.width"
            @input="(event) => (roomForm.width = parseFloat(event.target.value))"
            :type="'number'"
            :minlength="1"
            :required="true"
            label="Room width"
            placeholder="0.00"
          />
          <FwbInput
            aria-label="Room length"
            :value="roomForm.length"
            @input="(event) => (roomForm.length = parseFloat(event.target.value))"
            :type="'number'"
            :minlength="1"
            :required="true"
            label="Room length"
            placeholder="0.01"
          />
        </div>
      </div>

      <AlertError :message="errorMessage" />

      <div class="mt-6 grid grid-cols-2 items-center gap-3">
        <FwbButton type="submit">Save</FwbButton>
        <RouterLink
          class="text-center text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          component="RouterLink"
          :to="{ name: 'Dashboard' }"
          >Cancel</RouterLink
        >
      </div>
    </form>
  </div>
</template>
