<script setup lang="ts">
import { FwbModal, FwbButton, FwbSelect, FwbTextarea, FwbInput, FwbToggle } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import { type PlaygroundInsert } from '../../../server/src/entities/playground/schema';
import { trpc } from '../trpc';
import { type AddressSelect } from '../../../server/src/entities/address/schema';

const availableAddresses = ref<AddressSelect[]>();
const addressOptions = ref([
  {
    value: '',
    name: '',
  },
]);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create', value: PlaygroundInsert): void;
}>();

const newPlaygroundInfo = ref({
  isPrivate: false,
  isOpen: true,
  description: '',
  latitude: '',
  longitude: '',
  addressId: '',
});

function editPlayground() {
  if (!newPlaygroundInfo.value) return;
  emit('create', {
    ...newPlaygroundInfo.value,
    isOpen: newPlaygroundInfo.value.isOpen,
    isPrivate: newPlaygroundInfo.value.isPrivate,
    latitude: Number(newPlaygroundInfo.value.latitude),
    longitude: Number(newPlaygroundInfo.value.longitude),
    addressId: Number(newPlaygroundInfo.value.addressId),
  });
}

onMounted(async () => {
  const { addresses } = await trpc.address.getAddresses.query();
  availableAddresses.value = addresses;
  addressOptions.value = availableAddresses.value.map((address) => ({
    value: address.id.toString(),
    name: `${address.street} ${address.number}, ${address.district} ,${address.zipCode} ${address.city}`,
  }));
});
</script>
<template>
  <FwbModal @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">New playground</div>
    </template>
    <template #body>
      <form class="p-4 md:p-5">
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div class="col-span-1">
            <FwbToggle
              v-model="newPlaygroundInfo.isPrivate"
              :label="newPlaygroundInfo.isPrivate ? 'Private' : 'Public'"
            />
          </div>
          <div class="col-span-1">
            <FwbToggle
              v-model="newPlaygroundInfo.isOpen"
              :label="newPlaygroundInfo.isOpen ? 'Open' : 'Closed'"
            />
          </div>
          <div class="col-span-1">
            <FwbInput v-model="newPlaygroundInfo.latitude" label="Latitude" />
          </div>
          <div class="col-span-1">
            <FwbInput v-model="newPlaygroundInfo.longitude" label="Longitude" />
          </div>
          <div class="col-span-2">
            <FwbSelect
              v-model="newPlaygroundInfo.addressId"
              :options="addressOptions"
              label="Address"
            />
          </div>
          <div class="col-span-2">
            <FwbTextarea v-model="newPlaygroundInfo.description" :rows="4" label="Description" />
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
