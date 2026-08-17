<script setup lang="ts">
import MapPicker from "@/shared/components/MapPicker.vue";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDivider from "@/shared/components/ui/BaseDivider.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseInputFile from "@/shared/components/ui/BaseInputFile.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseTextarea from "@/shared/components/ui/BaseTextarea.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { useToast } from "@/shared/composables/use-toast";
import { forwardGeocode } from "@/shared/services/nominatim.service";
import { Plus } from "@lucide/vue";
import { watchDebounced } from "@vueuse/core";
import { computed, ref } from "vue";
import { useMountainForm } from "../composables/use-mountain-form";
import { useCreateMountain } from "../mutations/create-mountain.mutation";
import { useGetMountains } from "../queries/get-mountains.query";

const { data: mountains } = useGetMountains();
const { success, error } = useToast();
const { mutate: createMountain, isPending } = useCreateMountain();
const {
  name,
  altitudeMeters,
  general,
  location,
  reference,
  technical,
  status,
  altitudeMetersAttrs,
  generalAttrs,
  locationAttrs,
  nameAttrs,
  referenceAttrs,
  statusAttrs,
  technicalAttrs,
  errors,
  handleSubmit,
  resetForm,
} = useMountainForm();

const open = ref(false);
const logoFile = ref<File>();
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);

const onSave = () => {
  onSubmit();
};

const altitudeMetersInput = computed({
  get: () => altitudeMeters.value?.toString() ?? "",
  set: (value: string) => {
    altitudeMeters.value = Number(value);
  },
});

const openModal = () => {
  resetForm();
  open.value = true;
};

const onSubmit = handleSubmit(
  async (value) => {
    const mountainToCreate = {
      ...value,
      latitude: latitude.value !== null ? Number(latitude.value.toFixed(6)) : undefined,
      longitude: longitude.value !== null ? Number(longitude.value.toFixed(6)) : undefined,
    };
    createMountain(mountainToCreate, {
      onSuccess: () => {
        resetForm();
        success("Montaña creada", `${mountainToCreate.name} ya está disponible en la plataforma.`);
        open.value = false;
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

watchDebounced(
  () => reference.value,
  async (value) => {
    if (!value) return;
    const result = await forwardGeocode(value);
    if (result) {
      latitude.value = result.lat;
      longitude.value = result.lng;
    }
  },
  { debounce: 800 },
);
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Montañas</h4>
        <p class="text-sm text-muted-foreground">
          Catalago de Company, independiente de las temporadas
        </p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nueva montaña"
        :prefix-icon="Plus"
        icon-class="size-2.5"
        @click="openModal()"
      />
      <BaseModal title="Nueva montaña" :open="open" @close="open = false">
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
              <MapPicker v-model:latitude="latitude" v-model:longitude="longitude" />
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
              @click="open = false"
            />
            <BaseButton label="Guardar" class="flex-1" :loading="isPending" @click="onSave" />
          </div>
        </div>
      </BaseModal>
    </section>

    <div class="border w-full rounded-lg flex flex-col mt-5 bg-white">
      <div
        v-for="(mountain, index) in mountains"
        :key="mountain.id"
        class="w-full hover:bg-background rounded-lg"
      >
        <div class="py-3 px-4 flex items-center justify-between">
          <div class="flex flex-col gap-y-1">
            <h6 class="font-bold text-sm">{{ mountain.name }}</h6>
            <div class="flex flex-row items-center gap-x-2">
              <BaseBadge
                class="bg-primary/10 text-primary text-[0.68rem] font-bold"
                :label="`${mountain.altitudeMeters} mts`"
              />
              <p class="text-xs text-muted-foreground">{{ mountain.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-x-2.5">
            <BaseBadge
              :class="[
                'text-[0.68rem] font-semibold',
                {
                  'bg-success/10 text-success': mountain.status,
                  'bg-destructive/10 text-destructive': !mountain.status,
                },
              ]"
              :label="mountain.status ? 'Activo' : 'Inactivo'"
            />
            <BaseButton class="text-[0.8rem] border bg-white" variant="secondary" label="Editar" />
          </div>
        </div>
        <BaseDivider v-if="index !== (mountains?.length ?? 0) - 1" />
      </div>
    </div>
  </section>
</template>
