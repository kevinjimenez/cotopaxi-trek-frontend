<script setup lang="ts">
import AccordionContent from "@/shadcn/ui/accordion/AccordionContent.vue";
import AccordionItem from "@/shadcn/ui/accordion/AccordionItem.vue";
import AccordionTrigger from "@/shadcn/ui/accordion/AccordionTrigger.vue";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import { ChevronRight } from "@lucide/vue";
import type { UserResponse } from "../../types/api/response/user-response.type";
import { formatDate, isAfterNow } from "@/shared/utils/date.utils";

interface Props {
  users: UserResponse[] | undefined;
}

defineProps<Props>();

const activeSeason = (item: UserResponse) => item.userSeasons.find((e) => e.enrolled);
</script>

<template>
  <AccordionItem v-for="user in users" :key="user.id" :value="`item-${user.id}`">
    <AccordionTrigger
      class="hover:no-underline items-center justify-center p-3 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90 hover:bg-background"
    >
      <template #icon>
        <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
      </template>
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col gap-y-1 w-full">
          <h6 class="font-bold text-sm">{{ user.name }}</h6>
          <div class="flex flex-row items-center gap-x-2">
            <p class="text-xs text-muted-foreground">
              {{ user.phone }}
            </p>
            <div class="size-1 bg-muted-foreground rounded-full" />
            <p class="text-xs text-muted-foreground">@{{ user.username }}</p>
            <div class="size-1 bg-muted-foreground rounded-full" />
            <p class="text-xs text-muted-foreground">
              {{ user.bookings.length }}
              Montañas
            </p>
          </div>

          <div class="flex flex-row gap-x-2 flex-wrap">
            <BaseBadge
              v-for="(userSeason, idx) in user.userSeasons"
              :key="idx"
              :class="[
                'text-[0.68rem] font-bold',
                userSeason.enrolled ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
              ]"
              :label="userSeason.season.name"
            />
          </div>
        </div>

        <div class="flex items-center gap-x-2.5">
          <BaseBadge
            :class="[
              'text-[0.68rem] font-bold',
              {
                'bg-success/10 text-success': user.status,
                'bg-destructive/10 text-destructive': !user.status,
              },
            ]"
            :label="user.status ? 'Activa' : 'Inactivo'"
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
      <template v-if="user.bookings.length === 0">
        <div class="w-full flex pl-12 pt-2">
          <span class="text-muted-foreground/65 text-xs italic"
            >No está inscrit@ en la temporada activa.</span
          >
        </div>
      </template>

      <template v-else>
        <div class="pl-16 pr-4 pt-2">
          <span class="text-[0.79rem] font-semibold">{{ activeSeason(user)?.season.name }}</span>
          <div
            v-for="(booking, i) in user.bookings"
            :key="i"
            class="flex w-full border my-2 rounded-sm p-2.5 items-center justify-between bg-background"
          >
            <div class="flex gap-x-2 items-center">
              <BaseBadge
                class="size-5 bg-primary/10 text-primary"
                :label="booking.seasonMountain.sortOrder"
              />
              <span class="text-[0.79rem] font-semibold">{{
                booking.seasonMountain.mountain.name
              }}</span>
              <span class="text-xs text-muted-foreground">{{
                formatDate(booking.seasonMountain.startDate, "D MMM")
              }}</span>
            </div>
            <div class="flex gap-x-2">
              <BaseBadge
                :class="[
                  'font-semibold text-[0.6rem]',
                  isAfterNow(booking.seasonMountain.startDate)
                    ? 'bg-gray-500/10 text-gray-500'
                    : 'bg-primary/10 text-primary',
                ]"
                :label="isAfterNow(booking.seasonMountain.startDate) ? 'Realizado' : 'Próxima'"
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
</template>
