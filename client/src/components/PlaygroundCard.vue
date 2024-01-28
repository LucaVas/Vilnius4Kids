<script setup lang="ts">
import { FwbCard, FwbButton, FwbButtonGroup } from 'flowbite-vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';

defineProps<{
  playground: PlaygroundSelectWithAddress;
}>();
defineEmits<{
  delete: [id: number];
}>();
</script>

<template>
  <FwbCard
    img-alt="Desk"
    img-src="https://flowbite.com/docs/images/blog/image-1.jpg"
    variant="image"
  >
    <div class="flex flex-col items-center justify-around p-5">
      <h5 class="mb-5 font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
        {{ playground.address.street }} {{ playground.address.number }}
      </h5>

      <FwbButtonGroup class="align-center flex w-full justify-around">
        <FwbButton
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'Playground', params: { id: playground.id } } as any"
          class="min-w-min"
          color="blue"
          outline
          >View
          <template #suffix>
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
            </svg> </template
        ></FwbButton>
        <FwbButton
          component="RouterLink"
          tag="router-link"
          class="min-w-min"
          data-testid="delete-playground-button"
          color="red"
          outline
          @click="$emit('delete', playground.id)"
          >Remove
        </FwbButton>
      </FwbButtonGroup>
    </div>
  </FwbCard>
</template>
