<script setup lang="ts">
import { FwbModal, FwbButton, FwbInput } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import { type BareAddress, type AddressUpdate } from '../../../server/src/entities/address/schema';

const props = defineProps<{
  address: BareAddress;
}>();

const addressToEdit = ref({
  street: '',
  number: '',
  district: '',
  city: '',
  zipCode: '',
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', value: AddressUpdate): void;
}>();

function editAddress() {
  if (!addressToEdit.value) return;

  emit('edit', {
    ...addressToEdit.value,
    number: Number(addressToEdit.value.number),
    zipCode: Number(addressToEdit.value.zipCode),
  });
}

onMounted(() => {
  console.log(props.address);
  addressToEdit.value = {
    ...props.address,
    number: props.address.number.toString(),
    zipCode: props.address.zipCode.toString(),
  };
});
</script>
<template>
  <FwbModal @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">Edit address</div>
    </template>
    <template #body>
      <form class="p-4 md:p-5">
        <div class="mb-4 grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <FwbInput type="text" v-model="addressToEdit.street" label="Street" />
          </div>
          <div class="col-span-1">
            <FwbInput type="number" v-model="addressToEdit.number" label="Number" />
          </div>
          <div class="col-span-1">
            <FwbInput type="number" v-model="addressToEdit.zipCode" label="Zip Code" />
          </div>
          <div class="col-span-2">
            <FwbInput type="text" v-model="addressToEdit.district" label="District" />
          </div>
          <div class="col-span-3">
            <FwbInput type="text" v-model="addressToEdit.city" label="City" />
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <FwbButton @click="$emit('close')" color="purple" outline> Cancel </FwbButton>
        <FwbButton @click="editAddress" color="purple"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
