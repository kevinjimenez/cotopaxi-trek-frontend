<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { ChevronRight, Plus } from '@lucide/vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { useGetSeasonsWithMountains } from '../actions/season.action';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';

const { data } = useGetSeasonsWithMountains();
</script>

<template>
  <section class="px-10 py-8">
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
      />
    </section>

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`" class="">
        <AccordionTrigger
          class="hover:no-underline items-center justify-center p-4 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90"
        >
          <template #icon>
            <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
          </template>
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-y-1">
              <h6 class="font-bold text-sm">{{ item.name }}</h6>
              <div class="flex flex-row items-center gap-x-2">
                <!-- <BaseBadge
                  class="bg-primary/10 text-primary text-[0.68rem] font-bold"
                  :label="`${item.altitudeMeters} mts`"
                /> -->
                <p class="text-xs text-muted-foreground">
                  {{ item.startDate }} - {{ item.endDate }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ item.seasonMountains.length }} Montañas
                </p>
              </div>
            </div>

            <div class="flex items-center gap-x-2.5">
              <BaseBadge
                class="bg-success/10 text-success text-[0.68rem] font-bold"
                label="Activa"
              />
              <BaseButton
                class="text-[0.8rem] border bg-background"
                variant="secondary"
                label="Editar"
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent> {{ item.id }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
