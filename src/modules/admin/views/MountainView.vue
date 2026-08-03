<script setup lang="ts">
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { Plus } from '@lucide/vue';
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Montañas</h4>
        <p class="text-sm text-muted-foreground">
          Catalago de Company, independiente de las temporadas
        </p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nueva montaña"
        :prefix-icon="Plus"
        icon-class="size-2.5"
      />
    </section>

    <div class="border w-full p-4 rounded-lg flex items-center justify-between mt-5">
      <div class="flex flex-col gap-y-1">
        <h6 class="font-bold text-sm">Fuya Fuya</h6>
        <div class="flex flex-row items-center gap-x-2">
          <BaseBadge class="bg-primary/10 text-primary text-[0.68rem] font-bold" label="5126 mts" />
          <p class="text-xs text-muted-foreground font-medium">Location</p>
        </div>
      </div>

      <div class="flex items-center gap-x-2.5">
        <BaseBadge class="bg-success/10 text-success text-[0.68rem] font-bold" label="Activa" />
        <BaseButton class="text-[0.8rem] border bg-background" variant="secondary" label="Editar" />
      </div>
    </div>
  </section>
</template>
