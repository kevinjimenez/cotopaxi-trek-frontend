<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (name: string) => {
  router.push({
    name,
  });
};
</script>

<template>
  <main class="bg-amber-400 min-h-screen h-auto">
    <div class="bg-background w-full flex px-10 py-2 items-center justify-between">
      <div class="flex">
        <BaseButton
          class="text-foreground underline-offset-12 decoration-primary hover:underline hover:decoration-2"
          label="Temporadas"
          variant="link"
          @click="() => goTo('season')"
        />
        <BaseButton
          class="text-foreground underline-offset-12 decoration-primary hover:underline hover:decoration-2"
          label="Montaña"
          variant="link"
          @click="() => goTo('mountain')"
        />
        <BaseButton
          class="text-foreground underline-offset-12 decoration-primary hover:underline hover:decoration-2"
          label="usuarios"
          variant="link"
          @click="() => goTo('user')"
        />
      </div>
      <h6 class="text-muted-foreground text-sm">Company</h6>
    </div>
    <router-view />
  </main>
</template>
