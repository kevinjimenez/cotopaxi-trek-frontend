<script setup lang="ts">
import BaseAccordion from "@/shared/components/ui/BaseAccordion.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { useToast } from "@/shared/composables/use-toast.ts";
import { Plus } from "@lucide/vue";
import dayjs from "dayjs";
import { ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import RowEnrolledMountain from "../components/season/RowEnrolledMountain.vue";
import RowSeason from "../components/season/RowSeason.vue";
import { useSeasonForm } from "../composables/use-season-form.ts";
import { useSeasonMountains } from "../composables/use-season-mountains.ts";
import { useCreateSeason } from "../mutations/create-season.mutation";
import { useGetMountains } from "../queries/get-mountains.query";
import { useGetSeasons } from "../queries/get-seasons.query";

const { success, error } = useToast();
const { data: seasons } = useGetSeasons();
// mountains solo las activas
const { data: mountains } = useGetMountains();
const { mutate: createSeason, isPending } = useCreateSeason();
const {
  endDate,
  endDateAttrs,
  errors,
  mountainsFieldArray,
  handleSubmit,
  isCurrent,
  isCurrentAttrs,
  name,
  nameAttrs,
  resetForm,
  startDate,
  startDateAttrs,
} = useSeasonForm();
const { cloneMountains, mountainName, addMountain, removeMountain, reorderMountain } =
  useSeasonMountains(mountains, mountainsFieldArray);

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
        success("Temporada creada", `${seasonToCreate.name} ya está disponible en la plataforma.`);
        open.value = false;
      },
      onError: (err) => {
        error("No se pudo crear la temporada", err.message);
      },
    });
  },
  ({ errors }) => {
    console.error("validation failed", errors);
  },
);

const open = ref(false);
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
        @close="
          () => {
            resetForm();
            open = false;
          }
        "
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
              <VueDraggable
                :model-value="mountainsFieldArray.fields.value"
                @update="reorderMountain"
              >
                <div v-for="(field, index) in mountainsFieldArray.fields.value" :key="field.key">
                  <RowEnrolledMountain
                    :index="index"
                    :name="mountainName(field.value.mountainId)"
                    :start-date-min="startDate"
                    :start-date-max="endDate"
                    @remove="removeMountain(index)"
                  />
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

    <BaseAccordion class="mt-5">
      <RowSeason v-for="season in seasons" :key="season.id" :season="season" />
    </BaseAccordion>
  </section>
</template>
