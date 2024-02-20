<script setup lang="ts">
import { FwbModal, FwbButton, FwbInput } from 'flowbite-vue';
import { ref } from 'vue';
import useErrorMessage from '../composables/useErrorMessage/index';
import { trpc } from '../trpc';
import AlertError from '@/components/AlertError.vue';

const address = ref({
  street: '',
  number: '',
  district: '',
  city: '',
  zipCode: '',
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const [createAddress, errorMessage] = useErrorMessage(async () => {
  if (!address.value) return;

  await trpc.address.addAddress.mutate({
    ...address.value,
    number: Number(address.value.number),
    zipCode: Number(address.value.zipCode),
  });

  emit('close');
});
</script>
<template>
  <FwbModal @close="$emit('close')">
    <template #header>
      <div class="flex items-center text-lg">New address</div>
    </template>
    <template #body>
      <form class="p-4 md:p-5" data-testid="newAddressForm">
        <div class="mb-4 grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <FwbInput
              type="text"
              v-model="address.street"
              label="Street"
              data-testid="streetInput"
            />
          </div>
          <div class="col-span-1">
            <FwbInput
              type="number"
              v-model="address.number"
              label="Number"
              data-testid="numberInput"
            />
          </div>
          <div class="col-span-1">
            <FwbInput
              type="number"
              v-model="address.zipCode"
              label="Zip Code"
              data-testid="zipCodeInput"
            />
          </div>
          <div class="col-span-2">
            <FwbInput
              type="text"
              v-model="address.district"
              label="District"
              data-testid="districtInput"
            />
          </div>
          <div class="col-span-3">
            <FwbInput type="text" v-model="address.city" label="City" data-testid="cityInput" />
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
        <FwbButton @click="createAddress" color="purple"> Confirm </FwbButton>
      </div>
    </template>
  </FwbModal>
</template>
