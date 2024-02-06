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
        {
          path: '/playgrounds',
          name: 'Playgrounds',
          component: () => import('../views/PlaygroundsMapView.vue'),
        },
        {
          path: '/playgrounds/:id',
          name: 'Playground',
          component: () => import('../views/PlaygroundView.vue'),
        },
        {
          path: 'playgrounds/:id/report',
          name: 'PlaygroundReport',
          component: () => import('../views/NewReportView.vue'),
        },
        {
          path: '/report',
          name: 'NewReport',
          component: () => import('../views/NewReportView.vue'),
        },
        {
          path: 'reports/:id',
          name: 'Report',
          component: () => import('../views/ReportView.vue'),
        },
        {
          path: '/myReports',
          name: 'MyReports',
          component: () => import('../views/MyReportsView.vue'),
        },
      ],
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
      path: '',
      component: HomeLayout,
      beforeEnter: [hideForAuth],
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeViewVue,
        },
      ],
    },
  ],
});

export default router;
