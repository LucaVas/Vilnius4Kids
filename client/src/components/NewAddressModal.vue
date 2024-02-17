<script setup lang="ts">
import { FwbModal, FwbButton, FwbInput } from 'flowbite-vue';
import { ref } from 'vue';
import { type AddressInsert } from '../../../server/src/entities/address/schema';

const address = ref({
  street: '',
  number: '',
  district: '',
  city: '',
  zipCode: '',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create', value: AddressInsert): void;
}>();

function editPlayground() {
  if (!address.value) return;
  
  emit('create', {
    ...address.value,
    number: Number(address.value.number),
    zipCode: Number(address.value.zipCode),
  });
}
</script>
<template>
  <FwbModal @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">New address</div>
    </template>
    <template #body>
      <form class="p-4 md:p-5">
        <div class="mb-4 grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <FwbInput type="text" v-model="address.street" label="Street" />
          </div>
          <div class="col-span-1">
            <FwbInput type="number" v-model="address.number" label="Number" />
          </div>
          <div class="col-span-1">
            <FwbInput type="number" v-model="address.zipCode" label="Zip Code" />
          </div>
          <div class="col-span-2">
            <FwbInput type="text" v-model="address.district" label="District" />
          </div>
          <div class="col-span-3">
            <FwbInput type="text" v-model="address.city" label="City" />
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
