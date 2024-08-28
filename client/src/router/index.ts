import { createRouter, createWebHistory } from 'vue-router';
import { authenticate, hideForAuth } from './guards';
import HomeLayout from '@/layouts/HomeLayout.vue';
import MyHomeLayoutVue from '@/layouts/MyHomeLayout.vue';
import HomeViewVue from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MyHomeLayoutVue,
      beforeEnter: [authenticate],
      children: [
        {
          path: '/myHome',
          name: 'MyHome',
          component: () => import('../views/MyHomeView.vue'),
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
      path: '/login',
      name: 'Login',
      beforeEnter: [hideForAuth],
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      beforeEnter: [hideForAuth],
      component: () => import('../views/SignupView.vue'),
    },

    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: HomeLayout,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'Home',
          beforeEnter: [hideForAuth],
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
      ],
    },
  ],
});

export default router;
