<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { cn } from '@/shadcn/utils';
import { useRoute, useRouter } from 'vue-router';
import BaseDivider from '@/shared/components/ui/BaseDivider.vue';

const router = useRouter();
const route = useRoute();

const goTo = (name: string) => {
  router.push({
    name,
  });
};

const navLinkClass = (name: string) =>
  cn(
    'underline-offset-12 decoration-primary hover:underline hover:decoration-2',
    route.name === name ? 'text-foreground underline decoration-2' : 'text-foreground',
  );
</script>

<template>
  <main class="min-h-screen h-auto">
    <header class="flex flex-col w-full">
      <div class="bg-white w-full flex px-10 py-4 items-center justify-between">
        <h5 class="text-lg font-bold">Panel Admin</h5>

        <h6 class="text-muted-foreground text-sm font-medium">Admin</h6>
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
            label="usuarios"
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
