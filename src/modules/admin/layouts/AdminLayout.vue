<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
</script>

<template>
  <main class="bg-amber-400 min-h-screen h-auto">
    <div class="bg-background w-full flex px-10 py-3">
      <BaseButton
        label="Temporadas"
        variant="link"
        class="text-foreground underline-offset-12 decoration-primary hover:underline hover:decoration-2"
      />
      <BaseButton label="Montaña" variant="link" />
      <BaseButton label="usuarios" variant="link" />
    </div>
    <router-view />
  </main>
</template>
