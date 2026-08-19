<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import { Plus } from "@lucide/vue";

defineEmits<{
  open: [];
}>();
</script>

<template>
  <section class="flex flex-row justify-between items-center">
    <div class="flex flex-col">
      <h4 class="text-xl font-bold">Temporadas</h4>
      <p class="text-sm text-muted-foreground">Company</p>
    </div>
    <BaseButton
      class="text-[0.8rem]"
      label="Nueva temporada"
      :prefix-icon="Plus"
      icon-class="size-2.5"
      @click="$emit('open')"
    />
  </section>
</template>
