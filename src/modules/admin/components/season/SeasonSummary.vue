<script setup lang="ts">
import { formatDate, fromNow } from "@/shared/utils/date.utils";
import type { Season } from "../../types/season.type";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";

interface Props {
  season: Season;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex flex-col gap-y-1">
      <h6 class="font-bold text-sm">{{ season.name }}</h6>
      <div class="flex flex-row items-center gap-x-2">
        <p class="text-xs text-muted-foreground">
          {{ formatDate(season.startDate) }} - {{ formatDate(season.endDate) }}
        </p>
        <div class="size-1 bg-muted-foreground rounded-full" />
        <p class="text-xs text-muted-foreground">{{ season.mountains.length }} Montañas</p>
      </div>
    </div>

    <div class="flex items-center gap-x-2.5">
      <BaseBadge
        :class="[
          'text-[0.68rem] font-semibold',
          fromNow(season.endDate).isAfter
            ? 'bg-primary/10 text-primary'
            : 'bg-muted-foreground/10 text-muted-foreground',
        ]"
        :label="fromNow(season.endDate).label"
      />
      <BaseBadge
        :class="[
          'text-[0.68rem] font-bold',
          season.isCurrent ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
        ]"
        :label="season.isCurrent ? 'Activa' : 'Inactiva'"
      />
      <BaseButton
        class="text-[0.8rem] border bg-white"
        variant="secondary"
        label="Editar"
        @click.stop
      />
    </div>
  </div>
</template>
