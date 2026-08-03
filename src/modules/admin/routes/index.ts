import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';

export const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  component: AdminLayout,
  children: [
    {
      path: 'season',
      name: 'season',
      component: () => import('@/modules/admin/views/SeasonView.vue'),
      meta: {
        title: 'Temporadas',
        requiresAuth: false,
      },
    },
    {
      path: 'mountain',
      name: 'mountain',
      component: () => import('@/modules/admin/views/MountainView.vue'),
      meta: {
        title: 'Montañas',
        requiresAuth: false,
      },
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/modules/admin/views/UserView.vue'),
      meta: {
        title: 'Usuarios',
        requiresAuth: false,
      },
    },
  ],
};
