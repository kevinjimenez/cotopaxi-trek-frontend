import { adminRoutes } from '@/modules/admin/routes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [adminRoutes],
});

export default router;
