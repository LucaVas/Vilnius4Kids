<script lang="ts" setup>
import { trpc } from '@/trpc'
import { ref, onBeforeMount } from 'vue';
import { FwbAlert, FwbButton } from 'flowbite-vue'
import type { BareRoom } from '@homedesign/server/src/shared/entities'
import Room from '@/components/Room.vue'

const rooms = ref<BareRoom[]>([])

onBeforeMount(async () => {
  rooms.value = await trpc.room.getRooms.query()
})
</script>

<template>
  <div class="DashboardView">
    <div v-if="rooms.length" data-testid="roomList">
      <Room v-for="room in rooms" :key="room.id" :room="room" />
    </div>
    <FwbAlert v-else data-testid="roomListEmpty">No rooms created yet!</FwbAlert>

    <div class="mt-4">
      <!-- prettier-ignore -->
      <FwbButton
        component="RouterLink"
        tag="router-link"
        :href="({ name: 'CreateRoom' } as any)"
        data-testid="createRoom"
        size="xl"
      >
        New room
      </FwbButton>
    </div>
  </div>
</template>
