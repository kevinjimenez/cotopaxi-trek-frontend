<script setup lang="ts">
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import { formatDate, fromNow } from "@/shared/utils/date.utils";
import { ChevronRight } from "@lucide/vue";
import type { getSeasons } from "../../queries/get-seasons.query";

interface Props {
  season: Awaited<ReturnType<typeof getSeasons>>[number];
}

defineProps<Props>();
</script>

<template>
  <AccordionItem :value="`item-${season.id}`">
    <AccordionTrigger
      class="hover:no-underline items-center justify-center p-3 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90 hover:bg-background"
    >
      <template #icon>
        <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
      </template>
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
              season.isCurrent
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive',
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
    </AccordionTrigger>
    <AccordionContent class="bg-white">
      <template v-if="season.mountains.length === 0">
        <div class="w-full flex pl-12 pt-2">
          <span class="text-muted-foreground/65 text-xs italic">No tiene montañas asignada</span>
        </div>
      </template>

      <template v-else>
        <div class="pl-16 pr-4 pt-2">
          <div
            v-for="mountain in season.mountains"
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
    </AccordionContent>
  </AccordionItem>
</template>
