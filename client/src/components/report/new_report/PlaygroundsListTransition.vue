<template>
  <Transition>
    <div v-if="showPlaygroundSearch">
      <FwbInput
        v-model="playgroundName"
        label="Search for a playground"
        placeholder="Enter a playground name"
        size="lg"
        @keyup="filterPlaygrounds"
      >
        <template #prefix>
          <svg
            aria-hidden="true"
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </template>
      </FwbInput>
      <FwbTable class="mt-4">
        <FwbTableHead>
          <FwbTableHeadCell>District</FwbTableHeadCell>
          <FwbTableHeadCell>Address</FwbTableHeadCell>
          <FwbTableHeadCell>
            <span class="sr-only">Select</span>
          </FwbTableHeadCell>
        </FwbTableHead>
        <FwbTableBody>
          <FwbTableRow
            v-for="playground in getPlaygroundsToShow(searchPlaygrounds ?? availablePlaygrounds)"
            :key="playground.id"
          >
            <FwbTableCell> {{ playground.address.district }}</FwbTableCell>
            <FwbTableCell>
              {{ playground.address.street }} {{ playground.address.number }}</FwbTableCell
            >
            <FwbTableCell>
              <FwbButton color="purple" square @click="$emit('selectPlayground', playground)">
                Report
              </FwbButton>
            </FwbTableCell>
          </FwbTableRow>
        </FwbTableBody>
      </FwbTable>
      <div class="my-4 flex w-full items-center justify-end gap-2">
        <FwbButton @click="showMorePlaygrounds" outline color="purple"> Show more </FwbButton>
        <FwbButton @click="showLessPlaygrounds" outline color="purple"> Show less </FwbButton>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  FwbButton,
  FwbInput,
  FwbTable,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableBody,
  FwbTableRow,
  FwbTableCell,
} from 'flowbite-vue';
import { ref } from 'vue';
import { Playground } from '../../../../../server/src/entities/playground/playground';
import { removeDiacritics } from '@/utils/stringUtils';

const playgroundName = ref<string>('');
const limit = ref(5);
const searchPlaygrounds = ref<Playground[]>();

const getPlaygroundsToShow = (playgrounds: Playground[] | undefined) => {
  return playgrounds
    ? playgrounds.filter((playground) => playgrounds.indexOf(playground) < limit.value)
    : [];
  };

const filterPlaygrounds = () => {
  if (availablePlaygrounds === undefined) return;
  if (playgroundName.value === '') return;
  if (limit.value !== 5) limit.value = 5;
  searchPlaygrounds.value = availablePlaygrounds?.filter((playground) => {
    const normalizedDistrict = removeDiacritics(playground.address.district.toLowerCase());
    const normalizedStreet = removeDiacritics(playground.address.street.toLowerCase());
    const normalizedInput = removeDiacritics(playgroundName.value.toLowerCase());

    return (
      normalizedDistrict.includes(normalizedInput) || normalizedStreet.includes(normalizedInput)
    );
  });
};

const showMorePlaygrounds = () => {
  if (searchPlaygrounds.value === undefined) return;
  limit.value <= searchPlaygrounds.value.length - 5
    ? (limit.value += 5)
    : (limit.value = searchPlaygrounds.value?.length);
};

const showLessPlaygrounds = () => {
  if (searchPlaygrounds.value === undefined) return;
  limit.value >= 10 && searchPlaygrounds.value.length >= 5 ? (limit.value -= 5) : limit.value;
};

const { showPlaygroundSearch, availablePlaygrounds } = defineProps<{
  showPlaygroundSearch: boolean;
  availablePlaygrounds: Playground[] | undefined;
}>();

defineEmits<{
  (event: 'selectPlayground', playground: Playground): void;
}>();
</script>
