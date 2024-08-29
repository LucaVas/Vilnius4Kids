import { createRouter, createWebHistory } from 'vue-router';
import { authenticate, hideForAuth } from './guards';
import HomeViewVue from '@/views/HomeView.vue';
import StackedLayout from '@/layouts/StackedLayout.vue';
import AuthenticationLayout from '@/layouts/AuthenticationLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: StackedLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'FavoritePlaygrounds',
          component: () => import('../views/FavoritePlaygroundsView.vue'),
        },
      ],
    },
    {
      path: '',
      component: StackedLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeViewVue,
        },
        {
          path: '/playgrounds/:id',
          name: 'Playground',
          component: () => import('../views/PlaygroundView.vue'),
        },
        {
          path: '/playgrounds',
          name: 'Playgrounds',
          component: () => import('../views/PlaygroundsMapView.vue'),
        },
        {
          path: '/playgrounds/new',
          name: 'AddPlayground',
          component: () => import('../views/AddPlaygroundView.vue'),
        },
      ],
    },
    {
      path: '/verify',
      name: 'Verify',
      beforeEnter: [hideForAuth],
      component: () => import('../views/VerifyTokenView.vue'),
      props: (route) => ({
        email: route.query.email,
        token: route.query.token,
      }),
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      beforeEnter: [hideForAuth],
      component: () => import('../views/ResetPasswordView.vue'),
      props: (route) => ({
        email: route.query.email,
        token: route.query.token,
      }),
    },
    {
      path: '/reset',
      name: 'Reset',
      beforeEnter: [hideForAuth],
      component: () => import('../views/SendResetPasswordLinkView.vue'),
    },

    {
      path: '/',
      component: AuthenticationLayout,
      beforeEnter: [hideForAuth],
      children: [
        {
          path: '/login',
          name: 'Login',
          component: () => import('../views/LoginView.vue'),
        },
        {
          path: '/signup',
          name: 'Signup',
          component: () => import('../views/SignupView.vue'),
        },
      ],
    },

    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: StackedLayout,
      meta: {
        requiresAuth: false,
      },
    },
  ],
});

export default router;
