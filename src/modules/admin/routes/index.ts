import { useAuthStore } from "@/shared/stores/auth.store.ts";
import type { RouteRecordRaw } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";

export const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  name: "admin",
  redirect: { name: "user" },
  component: AdminLayout,
  children: [
    {
      path: "company",
      name: "company",
      component: () => import("@/modules/admin/views/CompanyView.vue"),
      meta: {
        title: "Empresa",
      },
      beforeEnter: () => {
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) return { name: "login" };
        if (authStore.role !== "superadmin") return { name: "user" };
      },
    },
    {
      path: "season",
      name: "season",
      component: () => import("@/modules/admin/views/SeasonView.vue"),
      meta: {
        title: "Temporadas",
      },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
    {
      path: "mountain",
      name: "mountain",
      component: () => import("@/modules/admin/views/MountainView.vue"),
      meta: {
        title: "Montañas",
      },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
    {
      path: "user",
      name: "user",
      component: () => import("@/modules/admin/views/UserView.vue"),
      meta: {
        title: "Usuarios",
      },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
  ],
};
