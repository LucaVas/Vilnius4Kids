import { createRouter, createWebHistory } from 'vue-router';
import { authenticate } from './guards';
import HomeLayout from '@/layouts/HomeLayout.vue';
import MyHomeLayoutVue from '@/layouts/MyHomeLayout.vue';
import HomeViewVue from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/myHome',
      component: MyHomeLayoutVue,
      beforeEnter: [authenticate],
      children: [
        {
          path: '/myHome',
          name: 'MyHome',
          component: () => import('../views/MyHomeView.vue'),
        },
        // {
        //   path: '',
        //   name: 'MyPlaygrounds',
        //   component: () => import('../views/MyPlaygroundsView.vue'),
        // },
        // {
        //   path: '/profile',
        //   name: 'Profile',
        //   component: () => import('../views/ProfileView.vue'),
        // },
        // {
        //   path: '/addresses/add',
        //   name: 'AddAddress',
        //   component: () => import('../views/AddAddressView.vue'),
        // },
        // {
        //   path: 'playgrounds',
        //   name: 'SeePlaygrounds',
        //   component: () => import('../views/SeePlaygroundsView.vue'),
        // },
        {
          path: 'playgrounds/add',
          name: 'AddPlayground',
          component: () => import('../views/MyHomeView.vue'),
        },
        // {
        //   path: 'playgrounds/:id',
        //   name: 'Playground',
        //   component: () => import('../views/PlaygroundView.vue'),
        // },
        // {
        //   path: 'playgrounds/:id/reports',
        //   name: 'PlaygroundReports',
        //   component: () => import('../views/PlaygroundReportsView.vue'),
        // },
        // {
        //   path: 'playgrounds/:id/report',
        //   name: 'PlaygroundReport',
        //   component: () => import('../views/NewReportView.vue'),
        // },
        // {
        //   path: 'report',
        //   name: 'NewReport',
        //   component: () => import('../views/NewReportView.vue'),
        // },
        // {
        //   path: 'reports/:id',
        //   name: 'Report',
        //   component: () => import('../views/ReportView.vue'),
        // },
        // {
        //   path: 'reports',
        //   name: 'NewReport',
        //   component: () => import('../views/NewReportView.vue'),
        // },
      ],
    },
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
    {
      path: '',
      component: HomeLayout,
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
