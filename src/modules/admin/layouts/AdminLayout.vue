<script setup lang="ts">
import { cn } from "@/shadcn/utils";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDivider from "@/shared/components/ui/BaseDivider.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const goTo = (name: string) => {
  router.push({
    name,
  });
};

const navLinkClass = (name: string) =>
  cn(
    "underline-offset-12 decoration-primary hover:underline hover:decoration-2",
    route.name === name ? "text-foreground underline decoration-2" : "text-foreground",
  );
</script>

<template>
  <main class="min-h-screen h-auto">
    <header class="flex flex-col w-full">
      <div class="bg-white w-full flex px-10 py-4 items-center justify-between">
        <h5 class="text-lg font-bold">Panel Admin</h5>
        <div class="flex flex-row gap-x-2 items-center justify-center">
          <div
            class="flex flex-row items-center justify-center gap-x-1 bg-ring/20 rounded-md px-3 py-1"
          >
            <div class="size-2 bg-success rounded-full" />
            <span class="text-foreground text-xs font-semibold">Admin</span>
          </div>

          <BaseButton
            class="border bg-white"
            label="Cerrar sesión"
            size="sm"
            variant="secondary"
            @click="
              () => {
                router.replace({ name: 'login' });
              }
            "
          />
        </div>
      </div>
      <BaseDivider />
      <div class="bg-white w-full flex px-10 py-2 items-center justify-between">
        <div class="flex">
          <BaseButton
            :class="navLinkClass('company')"
            label="Empresas"
            variant="link"
            @click="() => goTo('company')"
          />
          <BaseButton
            :class="navLinkClass('season')"
            label="Temporadas"
            variant="link"
            @click="() => goTo('season')"
          />
          <BaseButton
            :class="navLinkClass('mountain')"
            label="Montaña"
            variant="link"
            @click="() => goTo('mountain')"
          />
          <BaseButton
            :class="navLinkClass('user')"
            label="Usuarios"
            variant="link"
            @click="() => goTo('user')"
          />
        </div>
        <h6 class="text-muted-foreground text-sm font-medium">Company</h6>
      </div>
      <BaseDivider />
    </header>
    <router-view />
  </main>
</template>
