<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { ChevronRight, Plus } from '@lucide/vue';
import { useGetUsersWithSeasons } from '../actions/user.action';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';

const { data } = useGetUsersWithSeasons();
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

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`" class="">
        <AccordionTrigger
          class="hover:no-underline items-center justify-center p-4 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90"
        >
          <template #icon>
            <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
          </template>
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-y-1 w-full">
              <h6 class="font-bold text-sm">{{ item.name }}</h6>
              <div class="flex flex-row items-center gap-x-2">
                <p class="text-xs text-muted-foreground">
                  {{ item.phone }}
                </p>
                <p class="text-xs text-muted-foreground">@{{ item.username }}</p>
                <p class="text-xs text-muted-foreground">
                  {{
                    item.userSeasons.find((userSeason) => {
                      return userSeason.status;
                    })?.season.seasonMountains.length
                  }}
                  Montañas
                </p>
              </div>

              <div class="flex flex-row gap-x-2 flex-wrap">
                <BaseBadge
                  v-for="(i, idx) in item.userSeasons"
                  :key="idx"
                  :class="[
                    'text-[0.68rem] font-bold',
                    i.status ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                  ]"
                  :label="i.season.name"
                />
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
                @click.stop
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent> {{ item.id }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
