<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FwbAvatar, FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'

const { links } = defineProps<{
  links: {
    label: string
    name: string
  }[]
}>()

const route = useRoute()

const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
)
</script>

<template>
  <FwbNavbar>
    <template #default="{ isShowMenu }">
      <FwbNavbar-collapse :isShowMenu="isShowMenu" >
        <!-- prettier-ignore -->
        <FwbNavbarLink
          v-for="link in navigation"
          :key="link.name"
          :is-active="link.isActive"
          :link="({ name: link.name } as any)"
          link-attr="to"
          component="RouterLink"
          class="flex content-center items-center"
        >
          {{ link.label }}
        </FwbNavbarLink>
        <slot name="menu" />
      </FwbNavbar-collapse>
      <FwbAvatar img="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp" status="online" rounded />
    </template>
  </FwbNavbar>

  <main>
    <div class="container w-wull mx-auto px-6 py-8">
      <RouterView />
    </div>
  </main>
</template>
