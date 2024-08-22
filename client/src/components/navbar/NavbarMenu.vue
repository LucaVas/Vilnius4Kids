<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { FwbNavbarLink } from 'flowbite-vue';
import { logout } from '@/stores/user';
import NavbarBurger from '@/components/icons/NavbarBurger.vue';

const props = defineProps<{
  links: {
    label: string;
    name: string;
  }[];
}>();

const route = useRoute();
const router = useRouter();

function logoutUser() {
  logout();
  router.push({ name: 'Login' });
}

const navigation = computed(() =>
  props.links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
);

const goTo = async (linkName: string) => {
  await router.push({ name: linkName });
  router.go(0);
};
</script>

<template>
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <component :is="NavbarBurger" />
    </div>
    <ul
      tabindex="0"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
    >
      <li
        v-for="link in navigation"
        :key="link.name"
        :is-active="route.name === link.name"
        class="max-w-fit"
      >
        <FwbNavbarLink
          class="text-lg text-gray-500 hover:text-gray-900 md:text-base"
          :is-active="route.name === link.name"
          @click="goTo(link.name)"
          link-attr="to"
          component="RouterLink"
        >
          {{ link.label }}
        </FwbNavbarLink>
      </li>
      <div class="divider"></div>
      <li>
        <FwbNavbarLink
          @click.prevent="logoutUser"
          link="#"
          class="text-lg text-gray-500 hover:text-gray-900 md:text-base"
          data-testid="logoutButton"
          >Logout</FwbNavbarLink
        >
      </li>
    </ul>
  </div>
</template>
