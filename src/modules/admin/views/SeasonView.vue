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
import { ref, watch } from 'vue';
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus';
import { useGetMountains } from '../queries/get-mountains.query';
import { useGetSeasons } from '../queries/get-seasons.query';
import type { MountainResponse } from '../types/api/response/mountain-response.type';
import { useFieldArray, useForm } from 'vee-validate';
import { seasonFormSchema, type SeasonFormSchema } from '../schemas/season-form.schema';
import type { SeasonMountainFormSchema } from '../schemas/season-mountain-form.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { useCreateSeason } from '../mutations/create-season.mutation';
import { toast } from 'vue-sonner';
import dayjs from 'dayjs';

const { data } = useGetSeasons();
const { data: mountains } = useGetMountains();

const cloneMountains = ref<MountainResponse[]>([]);

const { mutate: createSeason, isPending } = useCreateSeason();

const { handleSubmit, defineField, errors, resetForm } = useForm<SeasonFormSchema>({
  validationSchema: toTypedSchema(seasonFormSchema),
  initialValues: {
    companyId: '00000000-0000-0000-0000-000000000001',
    name: '',
    year: '' as unknown as number,
    startDate: undefined as unknown as Date,
    endDate: undefined as unknown as Date,
    isCurrent: true,
    mountains: [],
  },
});

const [name, nameAttrs] = defineField('name');
const [startDate, startDateAttrs] = defineField('startDate');
const [endDate, endDateAttrs] = defineField('endDate');
const [isCurrent, isCurrentAttrs] = defineField('isCurrent');

const { fields, push, remove, move } = useFieldArray<SeasonMountainFormSchema>('mountains');

const mountainName = (mountainId: number) =>
  mountains.value?.find((m) => Number(m.id) === mountainId)?.name ?? '';

const parsePrice = (value?: string): number => {
  if (!value) return undefined as unknown as number;
  return Number(value.replace(/\./g, '').replace(',', '.'));
};

const touchedMountainRows = ref(new Set<number>());
const touchMountainRow = (index: number) => touchedMountainRows.value.add(index);
const mountainRowError = (index: number, path: 'price' | 'startDate') =>
  touchedMountainRows.value.has(index) ? errors.value[`mountains[${index}].${path}`] : undefined;

const onSave = () => {
  onSubmit();
};

const onSubmit = handleSubmit(
  async (value) => {
    const seasonToCreate = {
      ...value,
      year: dayjs(value.startDate).year(),
      mountains: value.mountains.map((mountain, index) => ({
        ...mountain,
        sortOrder: index + 1,
        endDate: mountain.startDate,
      })),
    };
    createSeason(seasonToCreate, {
      onSuccess: () => {
        resetForm();
        cloneMountains.value = mountains.value ? [...mountains.value] : [];
        toast.success('Temporada creada', {
          position: 'top-right',
          description: `${seasonToCreate.name} ya está disponible en la plataforma.`,
        });
        open.value = false;
      },
      onError: (error) => {
        toast.error('No se pudo crear la temporada', {
          position: 'top-right',
          description: error.message,
        });
      },
    });
  },
  ({ errors }) => {
    fields.value.forEach((_, index) => touchMountainRow(index));
    console.error('validation failed', errors);
  },
);

const addMountain = (id: string) => {
  const mountain = cloneMountains.value.find((m) => m.id === id);
  if (!mountain) return;
  push({
    mountainId: Number(mountain.id),
    startDate: undefined as unknown as Date,
    price: undefined as unknown as number,
  });
  cloneMountains.value = cloneMountains.value.filter((m) => m.id !== id);
};

const removeMountain = (index: number) => {
  const mountainId = fields.value[index]?.value.mountainId;
  const mountain = mountains.value?.find((m) => Number(m.id) === mountainId);
  if (mountain) cloneMountains.value = [...cloneMountains.value, mountain];
  remove(index);
};

const onReorder = (event: DraggableEvent<SeasonMountainFormSchema>) => {
  const { oldIndex, newIndex } = event;
  if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
  move(oldIndex, newIndex);
};

const open = ref(false);

watch(
  mountains,
  (newMountains) => {
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
          <BaseInput
            label="Nombre"
            required
            v-model="name"
            v-bind="nameAttrs"
            helperText="Ingrese el nombre de la temporada"
            :error="errors.name"
          />
          <div class="flex flex-row gap-x-4 w-full">
            <BaseDatePicker
              label="inicio"
              required
              v-model="startDate"
              v-bind="startDateAttrs"
              helperText="Fecha de inicio de la temporada"
              :error="errors.startDate"
              :min-date="dayjs().add(1, 'day').toDate()"
              :max-date="endDate"
            />
            <BaseDatePicker
              label="fin"
              required
              v-model="endDate"
              v-bind="endDateAttrs"
              helperText="Fecha de fin de la temporada"
              :error="errors.endDate"
              :min-date="startDate"
            />
          </div>
          <div class="flex w-full">
            <div class="flex flex-col justify-center flex-1">
              <h6 class="text-sm font-semibold">Temporada activa</h6>
              <span class="text-xs text-muted-foreground">Visible y disponible para reservas.</span>
            </div>
            <BaseToggle v-model="isCurrent" v-bind="isCurrentAttrs" />
          </div>

          <div class="flex flex-col w-full gap-y-1">
            <span class="text-[0.7rem] uppercase text-muted-foreground font-semibold"
              >disponibles - toca para agregar</span
            >
            <div class="flex flex-wrap gap-2">
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
              <VueDraggable :model-value="fields" @update="onReorder">
                <div v-for="(field, index) in fields" :key="field.key">
                  <div
                    class="flex w-full border mb-2 rounded-sm p-2.5 items-center bg-background cursor-move gap-x-2 relative"
                  >
                    <BaseButton
                      :prefix-icon="X"
                      variant="ghost"
                      size="icon-xs"
                      class="absolute top-0 right-0 hover:bg-transparent hover:text-inherit text-muted-foreground"
                      @click="removeMountain(index)"
                    />
                    <GripHorizontal class="text-muted-foreground" />
                    <div class="flex gap-x-2 items-center w-full">
                      <BaseBadge class="size-5 bg-primary/10 text-primary" :label="index + 1" />
                      <div class="flex flex-col w-full">
                        <span class="text-[0.79rem] font-semibold">{{
                          mountainName(field.value.mountainId)
                        }}</span>
                        <div class="flex gap-x-2">
                          <BaseInput
                            prefix="$"
                            required
                            :mask="{ number: { locale: 'es-EC', fraction: 2 } }"
                            :model-value="field.value.price?.toString() ?? ''"
                            @update:model-value="
                              (v) => {
                                field.value.price = parsePrice(v);
                                touchMountainRow(index);
                              }
                            "
                            @blur="touchMountainRow(index)"
                            :error="mountainRowError(index, 'price')"
                          />
                          <BaseDatePicker
                            required
                            :format="'D MMM'"
                            placeholder="Fecha, ej. 25 jul"
                            :min-date="startDate"
                            :max-date="endDate"
                            :model-value="field.value.startDate"
                            @update:model-value="
                              (v) => {
                                field.value.startDate = v as Date;
                                touchMountainRow(index);
                              }
                            "
                            :error="mountainRowError(index, 'startDate')"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VueDraggable>
            </div>
          </div>

          <div class="flex w-full gap-x-2">
            <BaseButton
              label="Cancelar"
              class="flex-1 border bg-white"
              variant="secondary"
              @click="open = false"
            />
            <BaseButton label="Guardar" class="flex-1" @click="onSave" :loading="isPending" />
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
