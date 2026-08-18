<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { useToast } from "@/shared/composables/use-toast.ts";
import { VueDraggable } from "vue-draggable-plus";
import { useSeasonForm } from "../../composables/use-season-form.ts";
import { useSeasonMountains } from "../../composables/use-season-mountains.ts";
import { useCreateSeason } from "../../mutations/create-season.mutation.ts";
import { useGetMountains } from "../../queries/get-mountains.query.ts";
import AvailableMountainChip from "./AvailableMountainChip.vue";
import RowEnrolledMountain from "./RowEnrolledMountain.vue";
import { watch } from "vue";
import dayjs from "dayjs";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const { success, error } = useToast();
const { data: mountains } = useGetMountains({ status: true });
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
  buildPayload,
} = useSeasonForm();
const { cloneMountains, mountainName, addMountain, removeMountain, reorderMountain } =
  useSeasonMountains(mountains, mountainsFieldArray);

const tomorrow = dayjs().add(1, "day").toDate();

const onSubmit = handleSubmit(
  async (values) => {
    const seasonToCreate = buildPayload(values);
    createSeason(seasonToCreate, {
      onSuccess: () => {
        resetForm();
        cloneMountains.value = mountains.value ? [...mountains.value] : [];
        success("Temporada creada", `${seasonToCreate.name} ya está disponible en la plataforma.`);
        emit("close");
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

const onSave = () => {
  onSubmit();
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);
</script>

<template>
  <BaseModal
    title="Nueva temporada"
    :open="open"
    @close="emit('close')"
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
          :min-date="tomorrow"
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
          <AvailableMountainChip
            v-for="mountain in cloneMountains"
            :key="mountain.id"
            :mountain="mountain"
            @add="addMountain(mountain.id)"
          />
        </div>
      </div>

      <div class="flex flex-col w-full gap-y-1">
        <span class="text-[0.7rem] uppercase text-muted-foreground font-semibold"
          >orden de ascenso - arrastra para reordenar</span
        >
        <div class="flex flex-col gap-y-2">
          <VueDraggable :model-value="mountainsFieldArray.fields.value" @update="reorderMountain">
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
          @click="emit('close')"
        />
        <BaseButton label="Guardar" class="flex-1" @click="onSave" :loading="isPending" />
      </div>
    </div>
  </BaseModal>
</template>
