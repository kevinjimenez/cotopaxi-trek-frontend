<script setup lang="ts">
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import type { MountainResponse } from "../types/api/response/mountain-response.type";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDivider from "@/shared/components/ui/BaseDivider.vue";

interface Props {
  mountain: MountainResponse;
  total: number;
  index: number;
}

defineProps<Props>();
</script>

<template>
  <div class="w-full hover:bg-background rounded-lg">
    <div class="py-3 px-4 flex items-center justify-between">
      <div class="flex flex-col gap-y-1">
        <h6 class="font-bold text-sm">{{ mountain.name }}</h6>
        <div class="flex flex-row items-center gap-x-2">
          <BaseBadge
            class="bg-primary/10 text-primary text-[0.68rem] font-bold"
            :label="`${mountain.altitudeMeters} mts`"
          />
          <p class="text-xs text-muted-foreground">{{ mountain.location }}</p>
        </div>
      </div>

      <div class="flex items-center gap-x-2.5">
        <BaseBadge
          :class="[
            'text-[0.68rem] font-semibold',
            {
              'bg-success/10 text-success': mountain.status,
              'bg-destructive/10 text-destructive': !mountain.status,
            },
          ]"
          :label="mountain.status ? 'Activo' : 'Inactivo'"
        />
        <BaseButton class="text-[0.8rem] border bg-white" variant="secondary" label="Editar" />
      </div>
    </div>
    <BaseDivider v-if="index !== total - 1" />
  </div>
</template>
