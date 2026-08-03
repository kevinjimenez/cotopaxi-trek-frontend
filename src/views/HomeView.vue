<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>

  <BaseButton label="Click me size:defautl" :suffix-icon="Home" />

  <BaseButton label="Click me size:xs" :suffix-icon="Home" size="xs" />

  <BaseButton label="Click me size:sm" :suffix-icon="Home" size="sm" disabled />

  <BaseButton label="Click me size:lg" :suffix-icon="Home" size="lg" variant="outline" />
</template>
<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { Home } from '@lucide/vue';
</script>
