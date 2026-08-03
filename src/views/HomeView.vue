<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>

  <BaseButton class="bg-red-300" label="Click me" />
  <BaseButton class="bg-red-300" label="Click me" :suffix-icon="Home" />
  <!-- <Button class="bg-red-300" variant="destructive" size="icon" aria-label="Submit">
    <ArrowUpIcon />
  </Button> -->
</template>
<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { Home } from '@lucide/vue';
</script>
