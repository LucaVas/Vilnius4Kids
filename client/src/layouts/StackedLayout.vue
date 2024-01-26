<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  FwbAvatar,
  FwbFooter,
  FwbFooterCopyright,
  FwbFooterLink,
  FwbFooterLinkGroup,
  FwbNavbar,
  FwbNavbarCollapse,
  FwbNavbarLink,
} from 'flowbite-vue';
import { isLoggedIn, username } from '@/stores/user';

const { links } = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
}>();

const route = useRoute();

const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
);
</script>

<template>
  <FwbNavbar>
    <template #default="{ isShowMenu }">
      <FwbNavbar-collapse :isShowMenu="isShowMenu">
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
      <div v-if="isLoggedIn" class="flex items-center justify-evenly gap-5">
        <p class="max-w-24 overflow-auto"> {{ username }}</p>
        <FwbAvatar
          img="https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp"
          status="online"
          rounded
        />
      </div>
    </template>
  </FwbNavbar>

  <main class="align-center flex justify-center">
    <div class="container mx-auto py-6">
      <RouterView />
    </div>
  </main>

  <FwbFooter>
    <FwbFooterCopyright by="Vilnius4kids" href="#" />
    <FwbFooterLinkGroup>
      <FwbFooterLink href="#"> About </FwbFooterLink>
      <FwbFooterLink href="#"> Privacy Policy </FwbFooterLink>
      <FwbFooterLink href="#"> Licensing </FwbFooterLink>
      <FwbFooterLink href="#"> Contact </FwbFooterLink>
    </FwbFooterLinkGroup>
  </FwbFooter>
</template>
