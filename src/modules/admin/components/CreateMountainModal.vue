<script setup lang="ts">
import MapPicker from "@/shared/components/MapPicker.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDivider from "@/shared/components/ui/BaseDivider.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseInputFile from "@/shared/components/ui/BaseInputFile.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseTextarea from "@/shared/components/ui/BaseTextarea.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { useToast } from "@/shared/composables/use-toast";
import { ref, watch } from "vue";
import { useMountainForm } from "../composables/use-mountain-form";
import { useCreateMountain } from "../mutations/create-mountain.mutation";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const { success, error } = useToast();
const { mutate: createMountain, isPending } = useCreateMountain();
const {
  name,
  altitudeMetersInput,
  general,
  location,
  reference,
  technical,
  status,
  lat,
  lng,
  altitudeMetersAttrs,
  generalAttrs,
  locationAttrs,
  nameAttrs,
  referenceAttrs,
  statusAttrs,
  technicalAttrs,
  errors,
  handleSubmit,
  buildPayload,
  resetForm,
} = useMountainForm();

const logoFile = ref<File>();

const onSubmit = handleSubmit(
  async (value) => {
    const mountainToCreate = buildPayload(value);
    createMountain(mountainToCreate, {
      onSuccess: () => {
        resetForm();
        success("Montaña creada", `${mountainToCreate.name} ya está disponible en la plataforma.`);
        emit("close");
      },
      onError: (err) => {
        error("No se pudo crear la montaña", err.message);
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
  <BaseModal title="Nueva montaña" :open="open" @close="emit('close')">
    <div class="flex flex-col w-full gap-y-5">
      <div class="flex flex-row w-full gap-x-4">
        <BaseInputFile v-model="logoFile" class="w-40 min-w-40" />
        <div class="flex flex-col w-full justify-center flex-1 gap-y-4">
          <BaseInput
            label="nombre"
            helper-text="Ingrese el nombre de la montaña"
            v-model="name"
            v-bind="nameAttrs"
            :error="errors.name"
            required
          />
          <div class="flex gap-x-4">
            <BaseInput
              type="number"
              label="altitud"
              placeholder="ej. 5.897 mts"
              helper-text="Ingrese la altitud de la montaña"
              v-model="altitudeMetersInput"
              v-bind="altitudeMetersAttrs"
              :error="errors.altitudeMeters"
              required
            />
            <BaseInput
              label="ubicacion"
              helper-text="Ingrese la ubicación de la montaña"
              v-model="location"
              v-bind="locationAttrs"
              :error="errors.location"
              required
            />
          </div>
        </div>
      </div>
      <BaseDivider />
      <div class="flex flex-col w-full gap-y-4">
        <span class="uppercase text-xs font-bold"> Ubicacion y mapa </span>
        <div class="flex flex-col w-full gap-y-4">
          <BaseInput
            label="Referencia"
            placeholder="Referencia o direccione exacta del acceso"
            helper-text="Ingrese la ubicación de la montaña"
            v-model="reference"
            v-bind="referenceAttrs"
          />
          <MapPicker v-model:latitude="lat" v-model:longitude="lng" />
        </div>
      </div>
      <BaseDivider />
      <div class="flex flex-col w-full gap-y-4">
        <span class="uppercase text-xs font-bold"> Descripcion </span>
        <div class="flex w-full gap-x-4 items-center justify-center">
          <BaseTextarea
            label="general"
            helper-text="Ingrese una descripcion general para el publico"
            v-model="general"
            v-bind="generalAttrs"
            :error="errors.generalDescription"
          />
          <BaseTextarea
            label="tecnica"
            description="Dificultad, equipo y detalles de la ascensión"
            v-model="technical"
            v-bind="technicalAttrs"
            :error="errors.technicalDescription"
          />
        </div>
      </div>
      <BaseDivider />
      <div class="flex w-full">
        <div class="flex flex-col justify-center flex-1">
          <h6 class="text-sm font-semibold">Montaña activa</h6>
          <span class="text-xs text-muted-foreground">Visible en el catálogo de la app.</span>
        </div>
        <BaseToggle v-model="status" v-bind="statusAttrs" />
      </div>
      <div class="flex w-full gap-x-2">
        <BaseButton
          label="Cancelar"
          class="flex-1 border bg-white"
          variant="secondary"
          @click="emit('close')"
        />
        <BaseButton label="Guardar" class="flex-1" :loading="isPending" @click="onSave" />
      </div>
    </div>
  </BaseModal>
</template>
