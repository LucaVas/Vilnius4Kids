<script setup lang="ts">
import { FwbModal, FwbButton, FwbTextarea, FwbToggle, FwbInput } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import AlertError from '@/components/AlertError.vue';
import useErrorMessage from '../composables/useErrorMessage/index';
import { trpc } from '../trpc';
import { type BarePlayground } from '../../../server/src/entities/playground/schema';

const props = defineProps<{
  playground: BarePlayground;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const playgroundEditInfo = ref({
  isPrivate: false,
  isOpen: true,
  latitude: '',
  longitude: '',
  description: '',
});

const [editPlayground, errorMessage] = useErrorMessage(async () => {
  await trpc.playground.updatePlayground.mutate({
    ...props.playground,
    isPrivate: playgroundEditInfo.value.isPrivate,
    isOpen: playgroundEditInfo.value.isOpen,
    longitude: Number(props.playground.longitude),
    latitude: Number(props.playground.latitude),
    description: playgroundEditInfo.value.description,
  });
  emit('close');
});

onMounted(() => {
  playgroundEditInfo.value.isPrivate = props.playground.isPrivate;
  playgroundEditInfo.value.isOpen = props.playground.isOpen;
  playgroundEditInfo.value.description = props.playground.description ?? '';
  playgroundEditInfo.value.latitude = props.playground.latitude.toString();
  playgroundEditInfo.value.longitude = props.playground.longitude.toString();
});
</script>
<template>
  <FwbModal size="xl" @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">Edit playground {{ playground.id }}</div>
    </template>
    <template #body>
      <form class="p-4 md:p-5">
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div class="col-span-1">
            <FwbToggle
              v-model="playgroundEditInfo.isPrivate"
              :label="playgroundEditInfo.isPrivate ? 'Private' : 'Public'"
            />
          </div>
          <div class="col-span-1">
            <FwbToggle
              v-model="playgroundEditInfo.isOpen"
              :label="playgroundEditInfo.isOpen ? 'Open' : 'Closed'"
            />
          </div>
          <div class="col-span-1">
            <FwbInput
              type="number"
              data-testid="latitudeInput"
              v-model="playgroundEditInfo.latitude"
              label="Latitude"
            />
          </div>
          <div class="col-span-1">
            <FwbInput
              type="number"
              data-testid="longitudeInput"
              v-model="playgroundEditInfo.longitude"
              label="Longitude"
              
            />
          </div>
          <div class="col-span-2">
            <FwbTextarea v-model="playgroundEditInfo.description" :rows="4" label="Description" />
          </div>
        </div>
      </form>
      <AlertError
        icon
        type="danger"
        v-if="errorMessage"
        :message="errorMessage"
        data-testid="errorMessage"
      >
        {{ errorMessage }}
      </AlertError>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <FwbButton @click="$emit('close')" color="purple" outline> Cancel </FwbButton>
        <FwbButton @click="editPlayground" color="purple"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
