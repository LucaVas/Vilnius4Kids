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
  <nav class="flex w-full items-center justify-between border-gray-200 bg-white px-6 py-4">
    <div class="flex gap-6">
      <!-- logo -->
      <a href="/" class="flex items-center">
        <img src="../assets/logo.png" class="h-12 rounded-full" alt="Vilniu4Kids Logo" />
      </a>

      <!-- avatar -->
      <div v-if="tag !== ''" class="flex items-center justify-evenly gap-5 bg-white">
        <FwbAvatar status="online" status-position="top-left" rounded />
        <p class="max-w-24 overflow-auto font-medium" data-testid="username-tag">
          {{ tag }}
        </p>
      </div>
    </div>

    <!-- burger menu button -->
    <button
      @click="showNavbar = !showNavbar"
      type="button"
      class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
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
    <div
      class="font-md text-md hidden border bg-slate-100 opacity-95 lg:block lg:border-0"
      :id="showNavbar ? 'show-navbar' : ''"
    >
      <!-- closing button -->
      <div class="flex p-2 lg:hidden">
        <button
          type="button"
          @click="showNavbar = false"
          class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          data-modal-hide="default-modal"
        >
          <svg
            class="h-4 w-4"
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
      </div>
      <ul
        class="mt-4 flex max-h-fit flex-col items-center space-y-4 p-4 lg:mt-0 lg:max-w-fit lg:flex-row lg:space-x-6 lg:space-y-0 lg:bg-white lg:p-0"
      >
        <li
          v-for="link in navigation"
          :key="link.name"
          :is-active="route.name === link.name"
          class="max-w-fit"
        >
          <FwbNavbarLink
            :is-active="route.name === link.name"
            @click="
              router.push({ name: link.name });
              router.go(1);
              showNavbar = false;
            "
            link-attr="to"
            component="RouterLink"
          >
            {{ link.label }}
          </FwbNavbarLink>
        </li>
        <li>
          <FwbNavbarLink
            v-if="tag !== ''"
            @click.prevent="logoutUser"
            link="#"
            class="flex content-center items-center"
            data-testid="logoutButton"
            >Logout</FwbNavbarLink
          >
        </li>
      </ul>
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
  width: 100vw;
  position: absolute;
}

#hide-navbar {
  display: none;
}
</style>
