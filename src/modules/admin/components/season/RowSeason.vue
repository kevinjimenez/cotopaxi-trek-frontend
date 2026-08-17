<script setup lang="ts">
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";
import { ChevronRight } from "@lucide/vue";
import type { Season } from "../../types/season.type";
import SeasonMountainList from "./SeasonMountainList.vue";
import SeasonSummary from "./SeasonSummary.vue";

interface Props {
  season: Season;
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
      <SeasonSummary :season="season" />
    </AccordionTrigger>
    <AccordionContent class="bg-white">
      <SeasonMountainList :mountains="season.mountains" />
    </AccordionContent>
  </AccordionItem>
</template>
