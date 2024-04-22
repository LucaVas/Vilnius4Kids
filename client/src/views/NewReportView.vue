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
  FwbFileInput,
} from 'flowbite-vue';
import { trpc } from '../trpc';
import { ref, onBeforeMount } from 'vue';
import { type ReportCategorySelect } from '../../../server/src/entities/report_category/schema';
import { useRouter, useRoute } from 'vue-router';
import { Playground } from '../../../server/src/entities/playground/playground';
import { FwbAlert } from 'flowbite-vue';
import AlertError from '@/components/AlertError.vue';
import { TRPCClientError } from '@trpc/client';
import { DEFAULT_SERVER_ERROR } from '../consts';

const router = useRouter();
const route = useRoute();
const playgroundId = Number(route.params.id);

const playgroundName = ref('');
const availablePlaygrounds = ref<Playground[]>();
const searchPlaygrounds = ref<Playground[]>();
const limit = ref(5);
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
const sendingReport = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');
const isUserVerified = ref(true);
const files = ref<File[]>([]);

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
  if (limit.value !== 5) limit.value = 5;
  searchPlaygrounds.value = availablePlaygrounds.value?.filter((playground) => {
    const normalizedDistrict = removeDiacritics(playground.address.district.toLowerCase());
    const normalizedStreet = removeDiacritics(playground.address.street.toLowerCase());
    const normalizedInput = removeDiacritics(playgroundName.value.toLowerCase());

    return (
      normalizedDistrict.includes(normalizedInput) || normalizedStreet.includes(normalizedInput)
    );
  });
}

function showMorePlaygrounds() {
  if (searchPlaygrounds.value === undefined) return;
  limit.value <= searchPlaygrounds.value.length - 5
    ? (limit.value += 5)
    : (limit.value = searchPlaygrounds.value?.length);
}

function showLessPlaygrounds() {
  if (searchPlaygrounds.value === undefined) return;
  limit.value >= 10 && searchPlaygrounds.value.length >= 5 ? (limit.value -= 5) : limit.value;
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

async function uploadImages() {
  for (const file of files.value) {
    if (!file.type.includes('image/png') || !file.type.includes('image/jpeg')) {
      infoMessage.value =
        'One or more file types are not allowed. Such files will not be uploaded.';
      continue;
    }

    try {
      // get secure url from server
      const { url } = await trpc.s3Images.getSignedUrl.query();
      // post image to s3 bucket
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file,
      });
    } catch (e) {
      // if error while uploading, do continue report process, but inform user
      errorMessage.value =
        'There was an issue while uploading your images. The report is submitted, but images might not be uploaded.';
    }
  }
}

async function submitReport() {
  if (reportInfo.value.message.trim().length < 5) {
    errorMessage.value = 'Report description must be at least 5 characters long.';
    return;
  }
  sendingReport.value = true;

  try {
    await uploadImages();
    await trpc.report.report.mutate({
      description: reportInfo.value.message,
      reportCategoryId: reportInfo.value.categoryId,
      playgroundId: reportInfo.value.playgroundId,
    });
    errorMessage.value = ''
    reportSent.value = true;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.log(error.data.httpStatus);
      if (error.data.httpStatus === 403) {
        errorMessage.value = 'You need to verify your email to report on a playground';
        return;
      }
      errorMessage.value = error.data.message || error.message;
    } else {
      errorMessage.value = DEFAULT_SERVER_ERROR;
    }
  } finally {
    sendingReport.value = false;
  }
}

onBeforeMount(async () => {
  const { isVerified } = await trpc.user.isUserVerified.query();
  if (!isVerified) {
    isUserVerified.value = isVerified;
    pageLoaded.value = true;
    return;
  } else {
    isUserVerified.value = true;
  }

  if (playgroundId) {
    const playground = await trpc.playground.getPlayground.query({ id: playgroundId });
    reportInfo.value.playgroundId = playground.id;
    showTopics.value = true;
  } else {
    const { playgrounds } = await trpc.playground.getPlaygrounds.query();
    availablePlaygrounds.value = playgrounds;
    searchPlaygrounds.value = availablePlaygrounds.value;
  }

  const { categories } = await trpc.reportCategory.getReportCategories.query();
  availableCategories.value = categories;

  pageLoaded.value = true;
});
</script>

<template>
  <div v-if="pageLoaded" class="flex h-full w-full flex-col justify-between p-6">
    <FwbHeading tag="h3" class="mb-4">Report an issue</FwbHeading>
    <FwbP class="mb-12 font-light">
      A public playground for kids can be a wonderful place for children to play, socialize, and
      develop important skills. However, there are potential issues that may arise, and it's crucial
      to address them to ensure the safety and well-being of the children.</FwbP
    >
    <div v-if="isUserVerified">
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
                <FwbTableRow
                  v-for="playground in searchPlaygrounds?.filter(
                    (playground) => searchPlaygrounds!.indexOf(playground) < limit
                  ) || []"
                  :key="playground.id"
                >
                  <FwbTableCell> {{ playground.address.district }}</FwbTableCell>
                  <FwbTableCell>
                    {{ playground.address.street }} {{ playground.address.number }}</FwbTableCell
                  >
                  <FwbTableCell>
                    <FwbButton
                      color="purple"
                      square
                      @click="
                        reportInfo.playgroundId = playground.id;
                        showPlaygroundSearch = false;
                        showTopics = true;
                      "
                    >
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
        <Transition>
          <div v-if="showTopics">
            <FwbButtonGroup class="flex h-full w-full flex-col gap-5">
              <FwbButton
                v-for="topic in availableCategories?.reduce((acc: string[], curr) => {
                  if (!acc.includes(curr.topic)) {
                    acc.push(curr.topic);
                  }
                  return acc;
                }, []) || []"
                :key="topic"
                @click="
                  reportInfo.topic = topic;
                  showCategories = true;
                  showTopics = false;
                  getCategoriesByTopic(topic);
                "
                color="purple"
                outline
                class="w-full"
                >{{ topic }}</FwbButton
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
                color="purple"
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
            <form @submit.prevent="null">
              <FwbTextarea
                v-model="reportInfo.message"
                :rows="5"
                custom
                minlength="5"
                label="Write a description of your issue"
                placeholder="What is the nature of this report?"
              >
                <template #footer>
                  <div class="flex w-full flex-col items-start">
                    <p class="min-w-fit text-sm text-gray-500 dark:text-gray-300">
                      JPEG | JPG | PNG
                    </p>
                    <FwbFileInput
                      class="w-full"
                      @update:model-value="(file) => files.push(file[0])"
                      multiple
                      :disabled="sendingReport"
                      accept="image/png, image/jpeg, image/jpg"
                    >
                      <div
                        v-if="files.length !== 0"
                        class="mt-4 flex flex-col gap-3 rounded-md border-[1px] border-gray-300 p-2 text-sm"
                      >
                        <div
                          v-for="file in files"
                          :key="file.name"
                          class="flex w-full items-center justify-between border border-transparent border-b-violet-200"
                        >
                          {{ file.name }}
                          <FwbButton
                            size="sm"
                            color="purple"
                            outline
                            :disabled="sendingReport || reportSent"
                            @click="files.splice(files.indexOf(file), 1)"
                            >X</FwbButton
                          >
                        </div>
                      </div>
                    </FwbFileInput>
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
      <div class="mb-4 flex flex-col gap-2">
        <AlertError
          v-if="reportSent"
          :type="'success'"
          data-testid="success-message"
          :message="'Report sent successfully! Thank you for your contribution.'"
        />
        <AlertError
          v-if="infoMessage"
          :type="'info'"
          data-testid="info-message"
          :message="infoMessage"
        />
        <AlertError
          v-if="errorMessage"
          :type="'danger'"
          data-testid="error-message"
          :message="errorMessage"
        />
      </div>
      <FwbButtonGroup class="flex w-full justify-between">
        <FwbButton v-if="!reportSent" color="dark" outline square @click="goBack"> Back </FwbButton>
        <FwbButton
          v-if="showForm && !reportSent"
          :disabled="reportSent || sendingReport"
          :loading="sendingReport"
          square
          color="purple"
          @click="submitReport"
        >
          Submit report
        </FwbButton>
        <FwbButton
          v-if="reportSent"
          square
          color="purple"
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'MyHome' } as any"
        >
          Back to my home
        </FwbButton>
        <FwbButton
          v-if="!showTopics && !showCategories && !showForm && !showPlaygroundSearch"
          @click="showPlaygroundSearch = true"
          color="purple"
          >Report an issue</FwbButton
        >
      </FwbButtonGroup>
    </div>
    <div v-else>
      <FwbAlert border icon type="danger" data-testid="notVerifiedMessage" class="mt-4 flex">
        Only verified users can report on playgrounds. Make sure to confirm your email first.
      </FwbAlert>
    </div>
  </div>
</template>
