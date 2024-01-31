<script setup lang="ts">
import {
  FwbA,
  FwbButton,
  FwbButtonGroup,
  FwbHeading,
  FwbP,
  FwbTextarea,
  FwbInput,
  FwbTable,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableBody,
  FwbTableRow,
  FwbTableCell,
} from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';
import { type ReportCategorySelect } from '../../../server/src/entities/report_category/schema';
import { useRouter, useRoute } from 'vue-router';
import { Playground } from '../../../server/src/entities/playground/playground';
import useErrorMessage from '../composables/useErrorMessage/index';
import { FwbAlert } from 'flowbite-vue';
import AlertError from '@/components/AlertError.vue';

const router = useRouter();
const route = useRoute();
const playgroundId = Number(route.params.id);

const playgroundName = ref('');
const availablePlaygrounds = ref<Playground[]>();
const searchPlaygrounds = ref<Playground[]>();
const showPlaygroundSearch = ref(false);
const showCategories = ref(false);
const showTopics = ref(false);
const showForm = ref(false);
const availableCategories = ref<ReportCategorySelect[]>();
const subCategories = ref();
const pageLoaded = ref(false);
const reportInfo = ref({
  topic: '',
  categoryId: 0,
  playgroundId: 0,
  message: '',
});
const reportSent = ref(false);

function removeDiacritics(text: string) {
  var output = '';

  var normalized = text.normalize('NFD');
  var i = 0;
  var j = 0;

  while (i < text.length) {
    output += normalized[j];

    j += text[i] == normalized[j] ? 1 : 2;
    i++;
  }

  return output;
}

function filterPlaygrounds() {
  if (availablePlaygrounds.value === undefined) return;
  if (playgroundName.value === '') return;
  searchPlaygrounds.value = availablePlaygrounds.value?.filter((playground) => {
    const normalizedDistrict = removeDiacritics(playground.address.district.toLowerCase());
    const normalizedStreet = removeDiacritics(playground.address.street.toLowerCase());
    const normalizedInput = removeDiacritics(playgroundName.value.toLowerCase());

    return (
      normalizedDistrict.includes(normalizedInput) || normalizedStreet.includes(normalizedInput)
    );
  });
}

function goBack() {
  if (playgroundId) {
    router.go(-1);
  }

  if (showForm.value) {
    showForm.value = false;
    showCategories.value = true;
  } else if (showCategories.value) {
    showForm.value = false;
    showCategories.value = false;
    showTopics.value = true;
  } else if (showTopics.value) {
    showTopics.value = false;
    showPlaygroundSearch.value = true;
  } else {
    router.go(-1);
  }
}

function getCategoriesByTopic(topic: string) {
  subCategories.value = availableCategories.value?.filter((category) => category.topic === topic);
}

const [submitReport, errorMessage] = useErrorMessage(async () => {
  await trpc.report.report.mutate({
    description: reportInfo.value.message,
    reportCategoryId: reportInfo.value.categoryId,
    playgroundId: reportInfo.value.playgroundId,
  });
  reportSent.value = true;
});

onBeforeMount(async () => {
  if (playgroundId) {
    const playground = await trpc.playground.getPlayground.query({ id: playgroundId });
    reportInfo.value.playgroundId = playground.id;
    showTopics.value = true;
  } else {
    const { playgrounds } = await trpc.playground.getPlaygrounds.query();
    availablePlaygrounds.value = playgrounds;
  }

  const { categories } = await trpc.reportCategory.getReportCategories.query();
  availableCategories.value = categories;
  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="pageLoaded" class="flex h-full w-full flex-col p-6">
    <FwbHeading tag="h3" class="mb-4">Report an issue</FwbHeading>
    <FwbP class="mb-4 font-light">
      A public playground for kids can be a wonderful place for children to play, socialize, and
      develop important skills. However, there are potential issues that may arise, and it's crucial
      to address them to ensure the safety and well-being of the children.</FwbP
    >
    <FwbButton
      v-if="!showTopics && !showCategories && !showForm && !showPlaygroundSearch"
      @click="showPlaygroundSearch = true"
      >Report an issue</FwbButton
    >
    <div class="mb-4">
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
              <FwbTableRow v-for="playground in searchPlaygrounds" :key="playground.id">
                <FwbTableCell> {{ playground.address.district }}</FwbTableCell>
                <FwbTableCell>
                  {{ playground.address.street }} {{ playground.address.number }}</FwbTableCell
                >
                <FwbTableCell>
                  <fwb-button
                    color="default"
                    pill
                    square
                    @click="
                      reportInfo.playgroundId = playground.id;
                      showPlaygroundSearch = false;
                      showTopics = true;
                    "
                  >
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </fwb-button>
                </FwbTableCell>
              </FwbTableRow>
            </FwbTableBody>
          </FwbTable>
        </div>
      </Transition>
      <Transition>
        <div v-if="showTopics">
          <FwbButtonGroup class="flex h-full w-full flex-col gap-5">
            <FwbButton
              v-for="category in availableCategories"
              :key="category.id"
              @click="
                reportInfo.topic = category.topic;
                showCategories = true;
                showTopics = false;
                getCategoriesByTopic(category.topic);
              "
              color="default"
              outline
              class="w-full"
              >{{ category.topic }}</FwbButton
            >
          </FwbButtonGroup>
        </div>
      </Transition>
      <Transition>
        <div v-if="showCategories">
          <FwbButtonGroup class="flex h-full w-full flex-col gap-5">
            <FwbButton
              v-for="category in subCategories"
              :key="category.id"
              color="default"
              outline
              @click="
                reportInfo.categoryId = category.id;
                showCategories = false;
                showForm = true;
              "
              class="w-full"
              >{{ category.name }}</FwbButton
            >
          </FwbButtonGroup>
        </div>
      </Transition>
      <Transition>
        <div v-if="showForm">
          <form>
            <FwbTextarea
              v-model="reportInfo.message"
              :rows="5"
              custom
              label="Write a description of your issue"
              placeholder="What is the nature of this report?"
            >
              <template #footer>
                <div class="flex items-center justify-end">
                  <div class="flex gap-3">
                    <FwbButton class="rounded-lg hover:bg-gray-200 hover:dark:bg-gray-600" square>
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        stroke-width="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </FwbButton>
                    <FwbButton class="rounded-lg hover:bg-gray-200 hover:dark:bg-gray-600" square>
                      <svg
                        class="h-6 w-6"
                        fill="none"
                        stroke-width="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </FwbButton>
                  </div>
                </div>
              </template>
            </FwbTextarea>
          </form>
          <p class="ml-auto text-xs text-gray-500 dark:text-gray-400">
            Remember, reporting an issue should follow our
            <FwbA href="#">Community Guidelines</FwbA>.
          </p>
        </div>
      </Transition>
    </div>
    <div class="mb-4">
      <FwbAlert v-if="reportSent" type="success" data-testid="success-message">
        Report sent successfully! Thank you for your contribution.
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>
    </div>
    <FwbButtonGroup class="flex w-full justify-between">
      <FwbButton v-if="!reportSent" color="dark" outline square @click="goBack"> Back </FwbButton>
      <FwbButton
        v-if="showForm && !reportSent"
        :disabled="reportSent"
        square
        @click="submitReport"
      >
        Submit report
      </FwbButton>
      <FwbButton
        v-if="reportSent"
        square
        component="RouterLink"
        tag="router-link"
        :href="{ name: 'MyHome' } as any"
      >
        Back to my home
      </FwbButton>
    </FwbButtonGroup>
  </div>
</template>
