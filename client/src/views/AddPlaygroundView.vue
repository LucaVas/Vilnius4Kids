<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue';
import { FwbButton, FwbAlert } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { googleMapsApiKey } from '../config';
import type { AutocompletedAddress } from '../components/types/Map';
import { trpc } from '../trpc';
import useErrorMessage from '@/composables/useErrorMessage/index';

const playgroundToAdd = ref({
  isPrivate: false,
  isOpen: true,
  fullAddress: {
    street: '',
    number: 0,
    zipCode: 0,
    city: '',
  },
  latitude: 0,
  longitude: 0,
  comments: '',
});

const loading = ref(false);
const autocompleteErrorMessage = ref('');

const [submit, errorMessage] = useErrorMessage(async () => {
  loading.value = true;
  await trpc.playground.referPlayground.mutate(playgroundToAdd.value);
  loading.value = false;
});

const autocompleteOptions = ref({
  types: ['address'],
  componentRestrictions: { country: 'lt' },
  fields: ['address_components', 'geometry', 'name'],
  strictBounds: false,
});

const addressInput = ref<HTMLElement | null>();
const loader = ref<Loader>();
onMounted(async () => {
  loader.value = new Loader({
    apiKey: googleMapsApiKey,
    version: 'weekly',
  });
});

const autocomplete = async () => {
  if (!loader.value || !addressInput.value) return;

  const Places = await loader.value.importLibrary('places');
  const autocomplete = new Places.Autocomplete(
    addressInput.value,
    autocompleteOptions.value
  );
  autocomplete.addListener('place_changed', () => {
    const location: AutocompletedAddress = autocomplete.getPlace();
    console.log(location);

    // check if full address
    if (isNaN(Number(location.address_components[0].long_name))) {
      autocompleteErrorMessage.value =
        'Full address is required (street and number)';
      return;
    } else {
      autocompleteErrorMessage.value = '';
      playgroundToAdd.value = {
        ...playgroundToAdd.value,
        fullAddress: {
          street: location.address_components[1].short_name,
          number: Number(location.address_components[0].long_name),
          zipCode: Number(location.address_components[5].long_name),
          city: location.address_components[2].long_name,
        },
        latitude: location.geometry.location.lat(),
        longitude: location.geometry.location.lng(),
      };
    }
  });
};
</script>

<template>
  <BaseForm
    heading="Add playground"
    formLabel="Add"
    @submit="submit"
    data-testid="add-playground-form"
  >
    <template #default>
      <p class="mb-4 text-sm text-gray-600">
        Fill out the details below to refer a new playground.
      </p>

      <input
        ref="addressInput"
        type="text"
        @keyup="autocomplete()"
        placeholder="Enter the playground address"
        required
        class="input input-bordered w-full text-sm"
      />
      <FwbAlert
        icon
        type="danger"
        v-if="autocompleteErrorMessage"
        data-testid="autocompleteErrorMessage"
      >
        {{ autocompleteErrorMessage }}
      </FwbAlert>

      <div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Is it private?</span>
            <input
              type="checkbox"
              :checked="playgroundToAdd.isPrivate"
              class="checkbox border-[#652ee3] [--chkbg:theme(colors.purple.700)] [--chkfg:white] checked:border-gray-300"
            />
          </label>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text font-semibold">Is it open?</span>
            <input
              type="checkbox"
              :checked="playgroundToAdd.isOpen"
              class="checkbox border-[#652ee3] [--chkbg:theme(colors.purple.700)] [--chkfg:white] checked:border-gray-300"
            />
          </label>
        </div>
      </div>

      <textarea
        v-model="playgroundToAdd.comments"
        placeholder="Any comments? (Optional)"
        class="textarea textarea-bordered textarea-sm w-full"
      />

      <FwbAlert
        icon
        type="danger"
        v-if="errorMessage"
        data-testid="errorMessage"
      >
        {{ errorMessage }}
      </FwbAlert>
    </template>

    <template #footer>
      <div class="mt-5 flex items-center justify-between">
        <FwbButton
          @click="$router.go(-1)"
          class="flex items-center justify-center"
          size="lg"
          color="purple"
          outline
          >Back</FwbButton
        >
        <FwbButton
          class="flex items-center justify-center"
          size="lg"
          color="purple"
          loading-position="suffix"
          type="submit"
          :disabled="loading && !errorMessage"
          :loading="loading && !errorMessage"
          @click="submit()"
          >Add new
          <template #suffix> </template>
        </FwbButton>
      </div>
    </template>
  </BaseForm>
</template>
