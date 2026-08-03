import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';

export const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  component: AdminLayout,
  children: [
    {
      path: 'mountain',
      name: 'mountain',
      component: () => import('@/modules/admin/views/MountainView.vue'),
      meta: {
        title: 'Montañas',
        requiresAuth: false,
      },
    },
  ],
};
