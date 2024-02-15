<script setup lang="ts">
import { FwbModal, FwbButton, FwbSelect, FwbTextarea } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import { type BarePlayground } from '../../../server/src/entities/playground/schema';

const props = defineProps<{
  playground: BarePlayground;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', value: BarePlayground): void;
}>();

const playgroundEditInfo = ref({
  isPrivate: '',
  isOpen: '',
  description: '',
});

const isPrivateOptions = [
  { value: 'true', name: 'Private' },
  { value: 'false', name: 'Public' },
];

const isOpenOptions = [
  { value: 'true', name: 'Open' },
  { value: 'false', name: 'Closed' },
];

function editPlayground() {
  const editedPlayground = {
    ...props.playground,
    isPrivate: playgroundEditInfo.value.isPrivate === 'true',
    isOpen: playgroundEditInfo.value.isOpen === 'true',
    longitude: Number(props.playground.longitude),
    latitude: Number(props.playground.latitude),
    description: playgroundEditInfo.value.description,
  };
  emit('edit', editedPlayground);
}

onMounted(() => {
  playgroundEditInfo.value.isPrivate = props.playground.isPrivate.toString();
  playgroundEditInfo.value.isOpen = props.playground.isOpen.toString();
  playgroundEditInfo.value.description = props.playground.description ?? '';
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
          <div class="col-span-2">
            <FwbSelect
              v-model="playgroundEditInfo.isPrivate"
              :options="isPrivateOptions"
              label="Private"
            />
          </div>
          <div class="col-span-2">
            <FwbSelect v-model="playgroundEditInfo.isOpen" :options="isOpenOptions" label="Open" />
          </div>
          <div class="col-span-2">
            <FwbTextarea v-model="playgroundEditInfo.description" :rows="4" label="Description" />
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <FwbButton @click="$emit('close')" color="purple" outline> Cancel </FwbButton>
        <FwbButton @click="editPlayground" color="purple"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
