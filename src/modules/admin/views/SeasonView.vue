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
import { formatDate, fromNow } from '@/shared/utils/date.utils';

const { data } = useGetSeasonsWithMountains();

// const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('en-CA');
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

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5 bg-white">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`" class="">
        <AccordionTrigger
          class="hover:no-underline items-center justify-center p-3 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90 hover:bg-background"
        >
          <template #icon>
            <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
          </template>
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-y-1">
              <h6 class="font-bold text-sm">{{ item.name }}</h6>
              <div class="flex flex-row items-center gap-x-2">
                <p class="text-xs text-muted-foreground">
                  {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
                </p>
                <div class="size-1 bg-muted-foreground rounded-full" />
                <p class="text-xs text-muted-foreground">
                  {{ item.seasonMountains.length }} Montañas
                </p>
              </div>
            </div>

            <div class="flex items-center gap-x-2.5">
              <BaseBadge
                :class="[
                  'text-[0.68rem] font-semibold',
                  fromNow(item.endDate).isAfter
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted-foreground/10 text-muted-foreground',
                ]"
                :label="fromNow(item.endDate).label"
              />
              <BaseBadge
                class="bg-success/10 text-success text-[0.68rem] font-bold"
                label="Activa"
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
          <template v-if="item.seasonMountains.length === 0">
            <div class="w-full flex pl-12 pt-2">
              <span class="text-muted-foreground/65 text-xs italic"
                >No tiene montañas asignada</span
              >
            </div>
          </template>

          <template v-else>
            <div class="pl-16 pr-4 pt-2">
              <div
                v-for="(seasonMountain, i) in item.seasonMountains"
                :key="i"
                class="flex w-full border mb-2 rounded-sm p-2.5 items-center justify-between bg-background"
              >
                <div class="flex gap-x-2 items-center">
                  <BaseBadge
                    class="size-5 bg-primary/10 text-primary"
                    :label="seasonMountain.sortOrder"
                  />
                  <span class="text-[0.79rem] font-semibold">{{
                    seasonMountain.mountain.name
                  }}</span>
                  <span class="text-xs text-muted-foreground">{{
                    formatDate(seasonMountain.startDate, 'D MMM')
                  }}</span>
                </div>
                <span class="text-[0.79rem] font-bold">${{ seasonMountain.price }}</span>
              </div>
            </div>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
