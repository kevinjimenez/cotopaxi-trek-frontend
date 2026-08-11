<script setup lang="ts">
import { Toaster } from '@/shadcn/ui/sonner';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>

<template>
  <router-view />
  <Toaster />
  <VueQueryDevtools />
</template>
