import { adminRoutes } from "@/modules/admin/routes";
import LoginView from "@/modules/admin/views/LoginView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    adminRoutes,
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Panel Admin` : "Panel Admin";
});

export default router;
