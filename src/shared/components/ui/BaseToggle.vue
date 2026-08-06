<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import { ref } from 'vue';

const status = ref('active');
</script>

<template>
  <ToggleGroup v-model="status" type="single" :spacing="1" class="bg-muted rounded-lg p-1">
    <ToggleGroupItem
      value="active"
      class="rounded-lg data-[state=on]:bg-white data-[state=on]:text-success"
    >
      Activa
    </ToggleGroupItem>
    <ToggleGroupItem
      value="inactive"
      class="rounded-lg data-[state=on]:bg-white data-[state=on]:text-destructive"
    >
      Inactiva
    </ToggleGroupItem>
  </ToggleGroup>
</template>
