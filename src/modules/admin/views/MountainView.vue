<script setup lang="ts">
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseDivider from '@/shared/components/ui/BaseDivider.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseTextarea from '@/shared/components/ui/BaseTextarea.vue';
import BaseToggle from '@/shared/components/ui/BaseToggle.vue';
import { Plus } from '@lucide/vue';
import { watchDebounced } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useGetMountains } from '../queries/get-mountains.query';
import BaseInputFile from '@/shared/components/ui/BaseInputFile.vue';
import { useForm } from 'vee-validate';
import { mountainFormSchema, type MountainFormSchema } from '../schemas/mountain-form.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { useCreateMountain } from '../mutations/create-mountain.mutation';
import { toast } from 'vue-sonner';
import MapPicker from '@/shared/components/MapPicker.vue';
import { forwardGeocode } from '@/shared/services/nominatim.service';

const { data } = useGetMountains();
const { mutate: createMountain, isPending } = useCreateMountain();

const open = ref(false);
const logoFile = ref<File>();
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);

const { handleSubmit, defineField, errors, resetForm } = useForm<MountainFormSchema>({
  validationSchema: toTypedSchema(mountainFormSchema),
  initialValues: {
    companyId: '019ff298-3573-70ff-a00a-65bcdfe4267c',
    name: '',
    altitudeMeters: '' as unknown as number,
    location: '',
    generalDescription: '',
    technicalDescription: '',
    status: true,
  },
});

const onSave = () => {
  onSubmit();
};

const [name, nameAttrs] = defineField('name');
const [altitudeMeters, altitudeMetersAttrs] = defineField('altitudeMeters');
const [location, locationAttrs] = defineField('location');
const [general, generalAttrs] = defineField('generalDescription');
const [technical, technicalAttrs] = defineField('technicalDescription');
const [status, statusAttrs] = defineField('status');

const altitudeMetersInput = computed({
  get: () => altitudeMeters.value?.toString() ?? '',
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
    console.log({ mountainToCreate, rawLatitude: latitude.value, rawLongitude: longitude.value });
    createMountain(mountainToCreate, {
      onSuccess: () => {
        resetForm();
        toast.success('Montaña creada', {
          position: 'top-right',
          description: `${mountainToCreate.name} ya está disponible en la plataforma.`,
        });
        open.value = false;
      },
      onError: (error) => {
        toast.error('No se pudo crear la montaña', {
          position: 'top-right',
          description: error.message,
        });
      },
    });
  },
  ({ errors }) => {
    console.error('validation failed', errors);
  },
);

watchDebounced(
  () => location.value,
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
            <!-- <picture class="border rounded-xl overflow-hidden flex w-44 h-40">
              <img
                src="https://images.pexels.com/photos/35356461/pexels-photo-35356461.jpeg"
                alt=""
                class="w-full object-cover"
              />
            </picture> -->
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
                <!-- <BaseInput
                  label="ubicacion"
                  helper-text="Ingrese la ubicación de la montaña"
                  v-model="location"
                  v-bind="locationAttrs"
                  :error="errors.location"
                  required
                /> -->
              </div>
            </div>
          </div>
          <BaseDivider />
          <div class="flex flex-col w-full gap-y-4">
            <span class="uppercase text-xs font-bold"> Ubicacion y mapa </span>
            <div class="flex flex-col w-full gap-y-4">
              <BaseInput
                label="Ubicación"
                placeholder="Referencia o direccione exacta del acceso"
                helper-text="Ingrese la ubicación de la montaña"
                v-model="location"
                v-bind="locationAttrs"
                :error="errors.location"
                required
              />
              <MapPicker v-model:latitude="latitude" v-model:longitude="longitude" />

              <!-- <p class="text-xs text-muted-foreground">
                {{ latitude?.toFixed(6) }}, {{ longitude?.toFixed(6) }}
              </p> -->
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
      <div v-for="(item, index) in data" :key="index" class="w-full hover:bg-background rounded-lg">
        <div class="py-3 px-4 flex items-center justify-between">
          <div class="flex flex-col gap-y-1">
            <h6 class="font-bold text-sm">{{ item.name }}</h6>
            <div class="flex flex-row items-center gap-x-2">
              <BaseBadge
                class="bg-primary/10 text-primary text-[0.68rem] font-bold"
                :label="`${item.altitudeMeters} mts`"
              />
              <p class="text-xs text-muted-foreground">{{ item.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-x-2.5">
            <BaseBadge
              :class="[
                'text-[0.68rem] font-semibold',
                {
                  'bg-success/10 text-success': item.status,
                  'bg-destructive/10 text-destructive': !item.status,
                },
              ]"
              :label="item.status ? 'Activo' : 'Inactivo'"
            />
            <BaseButton class="text-[0.8rem] border bg-white" variant="secondary" label="Editar" />
          </div>
        </div>
        <BaseDivider v-if="index !== (data?.length ?? 0) - 1" />
      </div>
    </div>
  </section>
</template>
