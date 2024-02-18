<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { FwbNavbarLink, FwbAvatar } from 'flowbite-vue';
import { logout } from '../stores/user';

const { links, tag } = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
  tag: string;
}>();

const route = useRoute();
const router = useRouter();
const showNavbar = ref(false);

function logoutUser() {
  logout();
  router.push({ name: 'Login' });
}

const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
);
</script>

<template>
  <nav class="border-gray-200 bg-white">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <!-- avatar -->
      <div v-if="tag !== ''" class="flex items-center justify-evenly gap-5">
        <FwbAvatar status="online" status-position="top-left" rounded />
        <p class="max-w-24 overflow-auto font-medium" data-testid="username-tag">
          {{ tag }}
        </p>
      </div>

      <!-- burger menu button -->
      <button
        @click="showNavbar = !showNavbar"
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <!-- links -->
      <div class="hidden w-full md:block md:w-auto" :id="showNavbar ? 'show-navbar' : ''">
        <ul
          class="font-sm flex h-full flex-col border bg-gray-50 p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse"
        >
          <button
            type="button"
            @click="showNavbar = false"
            class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 md:hidden"
            data-modal-hide="default-modal"
          >
            <svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <li v-for="link in navigation" :key="link.name" :is-active="route.name === link.name">
            <FwbNavbarLink
              :is-active="route.name === link.name"
              @click="
                router.push({ name: link.name });
                router.go(1);
                showNavbar = false;
              "
              link-attr="to"
              component="RouterLink"
              class="flex content-center items-center"
            >
              {{ link.label }}
            </FwbNavbarLink>
          </li>
          <li>
            <FwbNavbarLink
              @click.prevent="logoutUser"
              link="#"
              class="flex content-center items-center"
              >Logout</FwbNavbarLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
#show-navbar {
  display: block;
  z-index: 90;
  top: 0;
  left: 0;
  height: 100vh;
  position: absolute;
}

#hide-navbar {
  display: none;
}
</style>
