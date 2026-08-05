<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { ChevronRight, Plus } from '@lucide/vue';
import { useGetUsersWithSeasons, type UserWithSeasons } from '../actions/user.action';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { formatDate, isAfterNow } from '@/shared/utils/date.utils';

const { data } = useGetUsersWithSeasons();

const activeSeason = (item: UserWithSeasons) => item.userSeasons.find((e) => e.status);
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

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5 bg-white">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`">
        <AccordionTrigger
          class="hover:no-underline items-center justify-center p-3 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90 hover:bg-background"
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
                <div class="size-1 bg-muted-foreground rounded-full" />
                <p class="text-xs text-muted-foreground">@{{ item.username }}</p>
                <div class="size-1 bg-muted-foreground rounded-full" />
                <p class="text-xs text-muted-foreground">
                  {{
                    item.userSeasons.find((userSeason) => {
                      return userSeason.status;
                    })?.season.seasonMountains.length ?? 0
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
                class="text-[0.8rem] border bg-white"
                variant="secondary"
                label="Editar"
                @click.stop
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <template
            v-if="!activeSeason(item) || activeSeason(item)?.season.seasonMountains.length === 0"
          >
            <div class="w-full flex pl-12 pt-2">
              <span class="text-muted-foreground/65 text-xs italic"
                >No está inscrit@ en la temporada activa.</span
              >
            </div>
          </template>

          <template v-else>
            <div class="pl-16 pr-4 pt-2">
              <span class="text-[0.79rem] font-semibold">{{
                activeSeason(item)?.season.name
              }}</span>
              <div
                v-for="(userSeason, i) in activeSeason(item)?.season.seasonMountains"
                :key="i"
                class="flex w-full border my-2 rounded-sm p-2.5 items-center justify-between bg-background"
              >
                <div class="flex gap-x-2 items-center">
                  <BaseBadge
                    class="size-5 bg-primary/10 text-primary"
                    :label="userSeason.sortOrder"
                  />
                  <span class="text-[0.79rem] font-semibold">{{ userSeason.mountain.name }}</span>
                  <span class="text-xs text-muted-foreground">{{
                    formatDate(userSeason.startDate, 'D MMM')
                  }}</span>
                </div>
                <div class="flex gap-x-2">
                  <BaseBadge
                    :class="[
                      'font-semibold text-[0.6rem]',
                      isAfterNow(userSeason.startDate)
                        ? 'bg-gray-500/10 text-gray-500'
                        : 'bg-primary/10 text-primary',
                    ]"
                    :label="isAfterNow(userSeason.startDate) ? 'Realizado' : 'Próxima'"
                  />
                  <BaseBadge
                    class="bg-success/10 text-success font-semibold text-[0.6rem]"
                    label="Pagado"
                  />
                </div>
              </div>
            </div>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
