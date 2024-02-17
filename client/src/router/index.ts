import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import { authenticate, hideForAdmin, hideForAuth, showForAdmin, showForVerified } from './guards';
import HomeLayout from '@/layouts/HomeLayout.vue';
import MyHomeLayoutVue from '@/layouts/MyHomeLayout.vue';
import HomeViewVue from '@/views/HomeView.vue';
import AdminLayoutVue from '@/layouts/AdminLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MyHomeLayoutVue,
      beforeEnter: [authenticate, hideForAdmin],
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
          beforeEnter: [showForVerified],
          component: () => import('../views/MyReportsView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: AdminLayoutVue,
      beforeEnter: [authenticate, showForAdmin],
      children: [
        {
          path: '/dashboard',
          name: 'AdminDashboard',
          component: () => import('../views/AdminDasboardView.vue'),
        },
        {
          path: '/reports',
          name: 'AdminReports',
          component: () => import('../views/AdminReportsView.vue'),
        },
      ],
    },
    {
      path: '/verify',
      name: 'Verify',
      component: () => import('../views/VerifyTokenView.vue'),
      props: (route) => ({ email: route.query.email, token: route.query.token }),
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
