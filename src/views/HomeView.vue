<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>

  <BaseButton class="bg-red-500 text-white" label="Click me size:defautl" :suffix-icon="Home" />

  <BaseButton
    class="bg-red-500 text-white"
    label="Click me size:xs"
    :suffix-icon="Home"
    size="xs"
  />

  <BaseButton
    class="bg-red-500 text-white"
    label="Click me size:sm"
    :suffix-icon="Home"
    size="sm"
    :disabled="true"
    :loading="true"
  />

  <BaseButton label="Click me size:lg" :suffix-icon="Home" size="lg" variant="outline" />
</template>
<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue';
import { Home } from '@lucide/vue';
</script>
