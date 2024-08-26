<script setup lang="ts">
import { FwbButton, FwbButtonGroup } from 'flowbite-vue';
import { type PlaygroundSelectWithAddress } from '../../../server/src/entities/playground/schema';
import ArrowRight from '@/components/icons/ArrowRight.vue';
import PinnedIcon from '@/components/icons/PinnedIcon.vue';

defineProps<{
  playground: PlaygroundSelectWithAddress;
}>();
defineEmits<{
  delete: [id: number];
}>();
</script>

<template>
  <div class="card w-full bg-base-100 shadow-md min-w-[20rem]">
    <div class="card-body space-y-1 p-5">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-[1.1rem]">{{ playground.address.street }} {{ playground.address.number }}</h2>
        <component class="w-6" :is="PinnedIcon" />
      </div>
      <FwbButtonGroup class="flex w-full gap-3">
        <FwbButton
          component="RouterLink"
          tag="router-link"
          :href="{ name: 'Playground', params: { id: playground.id } } as any"
          color="purple"
          size="sm"
          >View <template #suffix> <component :is="ArrowRight" /></template
        ></FwbButton>
        <FwbButton
          component="RouterLink"
          tag="router-link"
          size="sm"
          data-testid="delete-playground-button"
          color="red"
          outline
          @click="$emit('delete', playground.id)"
          >Remove
        </FwbButton>
      </FwbButtonGroup>
    </div>
  </div>
</template>
