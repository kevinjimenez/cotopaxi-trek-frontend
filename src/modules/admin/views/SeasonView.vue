<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseDatePicker from '@/shared/components/ui/BaseDatePicker.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseToggle from '@/shared/components/ui/BaseToggle.vue';
import { formatDate, fromNow } from '@/shared/utils/date.utils';
import { ChevronRight, GripHorizontal, Plus, X } from '@lucide/vue';
import { ref, watch, type Ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { type Mountain, useGetMountains } from '../actions/mountain.action';
import { useGetSeasonsWithMountains } from '../actions/season.action';

const { data } = useGetSeasonsWithMountains();
const { data: mountains } = useGetMountains();

const cloneMountains = ref<Mountain[]>([]);
const newMountains = ref<Mountain[]>([]);

const moveMountain = (id: string, from: Ref<Mountain[]>, to: Ref<Mountain[]>) => {
  const mountain = from.value.find((m) => m.id === id);
  if (!mountain) return;
  to.value = [...to.value, mountain];
  from.value = from.value.filter((m) => m.id !== id);
};

const addMountain = (id: string) => moveMountain(id, cloneMountains, newMountains);
const removeMountain = (id: string) => moveMountain(id, newMountains, cloneMountains);

const open = ref(false);

watch(
  mountains,
  (newMountains, oldMountains) => {
    console.log({ newMountains, oldMountains });
    if (newMountains) cloneMountains.value = [...newMountains];
  },
  {
    immediate: true,
  },
);
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
        @click="open = true"
      />
      <BaseModal
        title="Nueva temporada"
        :open="open"
        @close="open = false"
        class-container="max-w-120"
      >
        <div class="flex flex-col w-full gap-y-4">
          <BaseInput label="Nombre" />
          <div class="flex flex-row gap-x-4 w-full">
            <BaseDatePicker label="inicio" />
            <BaseDatePicker label="fin" />
          </div>
          <div class="flex w-full">
            <div class="flex flex-col justify-center flex-1">
              <h6 class="text-sm font-semibold">Temporada activa</h6>
              <span class="text-xs text-muted-foreground">Visible y disponible para reservas.</span>
            </div>
            <BaseToggle />
          </div>

          <div class="flex flex-col w-full gap-y-1">
            <span class="text-[0.7rem] uppercase text-muted-foreground font-semibold"
              >disponibles - toca para agregar</span
            >
            <div class="flex flex-wrap gap-x-2">
              <div
                v-for="mountain in cloneMountains"
                :key="mountain.id"
                class="flex p-2 border border-primary border-dashed rounded-xl items-center justify-center gap-x-0.5 cursor-pointer"
                @click="addMountain(mountain.id)"
              >
                <Plus class="size-3 text-primary" />
                <span class="text-xs font-semibold text-primary">
                  {{ mountain.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col w-full gap-y-1">
            <span class="text-[0.7rem] uppercase text-muted-foreground font-semibold"
              >orden de ascenso - arrastra para reordenar</span
            >
            <div class="flex flex-col gap-y-2">
              <VueDraggable ref="el" v-model="newMountains">
                <div v-for="(item, index) in newMountains" :key="item.id">
                  <div
                    class="flex w-full border mb-2 rounded-sm p-2.5 items-center bg-background cursor-move gap-x-2 relative"
                  >
                    <BaseButton
                      :prefix-icon="X"
                      variant="ghost"
                      size="icon-xs"
                      class="absolute top-0 right-0 hover:bg-transparent hover:text-inherit text-muted-foreground"
                      @click="removeMountain(item.id)"
                    />
                    <GripHorizontal class="text-muted-foreground" />
                    <div class="flex gap-x-2 items-center w-full">
                      <BaseBadge class="size-5 bg-primary/10 text-primary" :label="index + 1" />
                      <div class="flex flex-col w-full">
                        <span class="text-[0.79rem] font-semibold">{{ item.name }}</span>
                        <div class="flex gap-x-2">
                          <BaseInput type="number" prefix="$" />
                          <BaseDatePicker :format="'D MMM'" placeholder="Fecha, ej. 25 jul" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VueDraggable>
            </div>
          </div>

          <div class="flex w-full gap-x-2">
            <BaseButton label="Cancelar" class="flex-1 border bg-white" variant="secondary" />
            <BaseButton label="Guardar" class="flex-1" />
          </div>
        </div>
      </BaseModal>
    </section>

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5 bg-white">
      <AccordionItem v-for="season in data" :key="season.id" :value="`item-${season.id}`" class="">
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
          <template v-if="season.mountains.length === 0">
            <div class="w-full flex pl-12 pt-2">
              <span class="text-muted-foreground/65 text-xs italic"
                >No tiene montañas asignada</span
              >
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
                  <BaseBadge
                    class="size-5 bg-primary/10 text-primary"
                    :label="mountain.sortOrder"
                  />
                  <span class="text-[0.79rem] font-semibold">{{ mountain.name }}</span>
                  <span class="text-xs text-muted-foreground"
                    >{{ formatDate(mountain.startDate, 'D MMM') }} -
                    {{ formatDate(mountain.endDate, 'D MMM') }}</span
                  >
                </div>
                <span class="text-[0.79rem] font-bold">${{ mountain.price }}</span>
              </div>
            </div>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
