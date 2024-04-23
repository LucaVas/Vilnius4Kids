<script setup lang="ts">
import { FwbButton, FwbButtonGroup, FwbHeading, FwbP } from 'flowbite-vue';
import { trpc } from '@/trpc';
import { ref, onBeforeMount } from 'vue';
import { type ReportCategorySelect } from '../../../server/src/entities/report_category/schema';
import { useRouter, useRoute } from 'vue-router';
import { Playground } from '../../../server/src/entities/playground/playground';
import { FwbAlert } from 'flowbite-vue';
import AlertMessage from '@/components/AlertMessage.vue';
import { TRPCClientError } from '@trpc/client';
import { DEFAULT_SERVER_ERROR } from '@/constants';
import { filesTypesAllowed, maxFileSizeAllowed } from '../config';
import TopicsTransition from '@/components/report/new_report/TopicsTransition.vue';
import CategoriesTransition from '@/components/report/new_report/CategoriesTransition.vue';
import PlaygroundsListTransition from '@/components/report/new_report/PlaygroundsListTransition.vue';
import ReportContentTransition from '@/components/report/new_report/ReportContentTransition.vue';
import ReportSentConfirmation from '@/components/report/new_report/ReportSentConfirmation.vue';

const router = useRouter();
const route = useRoute();
const playgroundId = Number(route.params.id);

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
});
const reportSent = ref(false);
const sendingReport = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');
const isUserVerified = ref(true);

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

const allowedTypes = filesTypesAllowed.split(',').map((t) => t.trim());
const allowedSize = Number(maxFileSizeAllowed);
function isValidFiles(files: File[]): boolean {
  for (const file of files) {
    if (allowedTypes.every((type) => !type.includes(file.type))) {
      errorMessage.value = 'One or more file types are not allowed.';
      return false;
    }
    if (file.size > allowedSize) {
      errorMessage.value = 'One or more image size is above the allowed limit.';
      return false;
    }
  }
  return true;
}

async function uploadImages(files: File[]) {
  const imagesInfo = [];
  for (const file of files) {
    try {
      // get secure url from server
      const { url, imageName } = await trpc.s3Images.getSignedUrl.query();
      // post image to s3 bucket
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: file,
      });
      imagesInfo.push({
        url: url.split('?')[0],
        type: file.type,
        name: file.name,
        key: imageName,
      });
    } catch (e) {
      // if error while uploading, do continue report process, but inform user
      errorMessage.value =
        'There was an issue while uploading your images. The report is submitted, but images might not be uploaded.';
    }
  }

  return imagesInfo;
}

async function submitReport(
  description: string,
  categoryId: number,
  playgroundId: number,
  files: File[]
) {
  if (description.trim().length < 5) {
    errorMessage.value = 'Report description must be at least 5 characters long.';
    return;
  }
  if (!isValidFiles(files)) return;

  sendingReport.value = true;

  try {
    const imagesInfo = await uploadImages(files);
    await trpc.report.report.mutate({
      description: description,
      reportCategoryId: categoryId,
      playgroundId: playgroundId,
      imagesInfo: imagesInfo ?? [],
    });
    errorMessage.value = '';
    reportSent.value = true;
    showForm.value = false;
  } catch (error) {
    if (error instanceof TRPCClientError) {
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
    <div v-if="!reportSent">
      <FwbHeading tag="h3" class="mb-4">Report an issue</FwbHeading>
      <FwbP class="mb-12 font-light">
        A public playground for kids can be a wonderful place for children to play, socialize, and
        develop important skills. However, there are potential issues that may arise, and it's
        crucial to address them to ensure the safety and well-being of the children.</FwbP
      >
    </div>
    <div v-if="isUserVerified">
      <div class="mb-4" id="transitions-container">
        <PlaygroundsListTransition
          :showPlaygroundSearch="showPlaygroundSearch"
          :availablePlaygrounds="availablePlaygrounds"
          @selectPlayground="
            (playground) => {
              reportInfo.playgroundId = playground.id;
              showPlaygroundSearch = false;
              showTopics = true;
            }
          "
        />
        <TopicsTransition
          :showTopics="showTopics"
          :availableCategories="availableCategories"
          @back="goBack()"
          @getCategoriesByTopic="
            (topic) => {
              reportInfo.topic = topic;
              showCategories = true;
              showTopics = false;
              getCategoriesByTopic(topic);
            }
          "
        />
        <CategoriesTransition
          :categories="subCategories"
          :showCategories="showCategories"
          @back="goBack()"
          @select-category="
            (category) => {
              reportInfo.categoryId = category.id;
              showCategories = false;
              showForm = true;
            }
          "
        />
        <ReportContentTransition
          :showForm="showForm"
          :sendingReport="sendingReport"
          :reportSent="reportSent"
          @back="goBack()"
          @submitReport="
            (report) =>
              submitReport(
                report.description,
                reportInfo.categoryId,
                reportInfo.playgroundId,
                report.files
              )
          "
        />
      </div>
      <ReportSentConfirmation :reportSent="reportSent" @goHome="router.push({ name: 'Home' })" />
      <div class="mb-4 flex flex-col gap-2" id="alerts-container">
        <AlertMessage
          v-if="infoMessage"
          :type="'info'"
          data-testid="info-message"
          :message="infoMessage"
          :closable="true"
        />
        <AlertMessage
          v-if="errorMessage"
          :type="'danger'"
          data-testid="error-message"
          :message="errorMessage"
        />
      </div>
      <FwbButtonGroup class="flex w-full justify-end" v-if="!reportSent">
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
