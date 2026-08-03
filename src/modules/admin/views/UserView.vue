<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { Plus } from '@lucide/vue';
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Usuarios</h4>
        <p class="text-sm text-muted-foreground">Company</p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nuevo usuario"
        :prefix-icon="Plus"
        icon-class="size-2.5"
      />
    </section>
  </section>
</template>
