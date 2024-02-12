<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const { links } = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
  tag: string;
}>();

const route = useRoute();
const router = useRouter();

const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
);
</script>

<template>
  <div class="navbar">
    <FwbNavbar>
      <template #default="{ isShowMenu }">
        <FwbNavbarCollapse :isShowMenu="isShowMenu" :class="isShowMenu ? 'collapsed' : null">
          <!-- prettier-ignore -->
          <FwbNavbarLink
          v-for="link in navigation"
          :key="link.name"
          :is-active="route.name === link.name"
          @click="router.push({ name: link.name });"
          link-attr="to"
          component="RouterLink"
          class="flex content-center items-center"
        >
          {{ link.label }}
        </FwbNavbarLink>
          <slot name="menu" />
        </FwbNavbarCollapse>
        <div v-if="tag !== ''" class="flex items-center justify-evenly gap-5">
          <p class="max-w-24 overflow-auto font-medium text-violet-800" data-testid="username-tag">
            {{ tag }}
          </p>
          <FwbAvatar img="src/assets/avatar_male.svg" rounded />
        </div>
      </template>
    </FwbNavbar>
  </div>

  <main class="main flex h-full w-screen flex-col content-center items-center p-4">
    <div class="container h-full w-screen">
      <RouterView />
    </div>
  </main>
  <div>
    <FwbFooter>
      <FwbFooterCopyright by="Vilnius4kids" class="mb-2" />
      <FwbFooterLinkGroup>
        <FwbFooterLink href="#" class="text-violet-800"> About </FwbFooterLink>
        <FwbFooterLink href="#" class="text-violet-800"> Privacy Policy </FwbFooterLink>
        <FwbFooterLink href="#" class="text-violet-800"> Licensing </FwbFooterLink>
        <FwbFooterLink href="#" class="text-violet-800"> Contact </FwbFooterLink>
      </FwbFooterLinkGroup>
    </FwbFooter>
  </div>
</template>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  height: 10svh;
}

.collapsed {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 100;
  position: absolute;
  top: 2.5rem;
  left: 0;
}

.main {
  min-height: 75svh;
}

.footer {
  height: 15svh;
}
</style>
