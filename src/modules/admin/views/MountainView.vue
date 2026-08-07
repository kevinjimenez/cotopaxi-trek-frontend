<script setup lang="ts">
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseDivider from '@/shared/components/ui/BaseDivider.vue';
import { Plus } from '@lucide/vue';
import { useGetMountains } from '../actions/mountain.action';
import { ref } from 'vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseTextarea from '@/shared/components/ui/BaseTextarea.vue';
import BaseToggle from '@/shared/components/ui/BaseToggle.vue';

const { data } = useGetMountains();

const open = ref(false);
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
        @click="open = true"
      />
      <BaseModal title="Nueva montaña" :open="open" @close="open = false">
        <div class="flex flex-col w-full gap-y-5">
          <div class="flex flex-row w-full gap-x-4">
            <picture class="border rounded-xl overflow-hidden flex w-44 h-40">
              <img
                src="https://images.pexels.com/photos/35356461/pexels-photo-35356461.jpeg"
                alt=""
                class="w-full object-cover"
              />
            </picture>
            <div class="flex flex-col w-full justify-center flex-1 gap-y-4">
              <BaseInput label="nombre" />
              <div class="flex gap-x-4">
                <BaseInput label="altitud" placeholder="ej. 5.897 mts" />
                <BaseInput label="ubicacion" />
              </div>
            </div>
          </div>
          <BaseDivider />
          <div class="flex flex-col w-full gap-y-4">
            <span class="uppercase text-xs font-bold"> Ubicacion y mapa </span>
            <div class="flex flex-col w-full gap-y-4">
              <BaseInput
                label="direccion"
                placeholder="Referencia o direccione exacta del acceso"
              />
              <picture class="border rounded-xl overflow-hidden flex h-40">
                <img
                  src="https://images.pexels.com/photos/4611591/pexels-photo-4611591.jpeg"
                  alt=""
                  class="w-full object-cover"
                />
              </picture>
            </div>
          </div>
          <BaseDivider />
          <div class="flex flex-col w-full gap-y-4">
            <span class="uppercase text-xs font-bold"> Descripcion </span>
            <div class="flex w-full gap-x-4 items-center justify-center">
              <BaseTextarea label="general" />
              <BaseTextarea
                label="tecnica"
                description="Dificultad, equipo y detalles de la ascensión"
              />
            </div>
          </div>
          <BaseDivider />
          <div class="flex w-full">
            <div class="flex flex-col justify-center flex-1">
              <h6 class="text-sm font-semibold">Montaña activa</h6>
              <span class="text-xs text-muted-foreground">Visible en el catálogo de la app.</span>
            </div>
            <BaseToggle />
          </div>
          <div class="flex w-full gap-x-2">
            <BaseButton label="Cancelar" class="flex-1 border bg-white" variant="secondary" />
            <BaseButton label="Guardar" class="flex-1" />
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
              class="bg-success/10 text-success text-[0.68rem] font-semibold"
              label="Activa"
            />
            <BaseButton class="text-[0.8rem] border bg-white" variant="secondary" label="Editar" />
          </div>
        </div>
        <BaseDivider v-if="index !== (data?.length ?? 0) - 1" />
      </div>
    </div>
  </section>
</template>
