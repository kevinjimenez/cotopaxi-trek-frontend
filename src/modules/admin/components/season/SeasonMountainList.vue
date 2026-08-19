<script setup lang="ts">
import { formatDate } from "@/shared/utils/date.utils";
import type { Mountain } from "../../types/mountain.type";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";

interface Props {
  mountains: Mountain[];
}

defineProps<Props>();
</script>

<template>
  <template v-if="mountains.length === 0">
    <div class="w-full flex pl-12 pt-2">
      <span class="text-muted-foreground/65 text-xs italic">No tiene montañas asignada</span>
    </div>
  </template>

  <template v-else>
    <div class="pl-16 pr-4 pt-2">
      <div
        v-for="mountain in mountains"
        :key="mountain.id"
        class="flex w-full border mb-2 rounded-sm p-2.5 items-center justify-between bg-background"
      >
        <div class="flex gap-x-2 items-center">
          <BaseBadge class="size-5 bg-primary/10 text-primary" :label="mountain.sortOrder" />
          <span class="text-[0.79rem] font-semibold">{{ mountain.name }}</span>
          <span class="text-xs text-muted-foreground"
            >{{ formatDate(mountain.startDate, "D MMM") }} -
            {{ formatDate(mountain.endDate, "D MMM") }}</span
          >
        </div>
        <span class="text-[0.79rem] font-bold">${{ mountain.price }}</span>
      </div>
    </div>
  </template>
</template>
