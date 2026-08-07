<script setup lang="ts">
import InstagramIcon from '@/shared/components/icons/InstagramIcon.vue';
import WhatsAppIcon from '@/shared/components/icons/WhatsAppIcon.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseToggle from '@/shared/components/ui/BaseToggle.vue';
import { Plus } from '@lucide/vue';
import { ref } from 'vue';
import { useGetCompanies } from '../actions/company.action';

const { data } = useGetCompanies();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Empresas</h4>
        <p class="text-sm text-muted-foreground">Cuentas de empresas que usan la plataforma</p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nueva empresa"
        :prefix-icon="Plus"
        icon-class="size-2.5"
        @click="openModal()"
      />
      <BaseModal title="Nueva empresa" :open="open" @close="open = false">
        <div class="flex flex-col w-full gap-y-5">
          <div class="flex flex-row w-full gap-x-4 items-center justify-center">
            <picture class="border rounded-xl overflow-hidden flex size-20">
              <img
                src="https://images.pexels.com/photos/35356461/pexels-photo-35356461.jpeg"
                alt=""
                class="w-full object-cover"
              />
            </picture>
            <BaseInput label="nombre de la empresa" />
          </div>

          <div class="flex w-full gap-x-4">
            <BaseInput label="whatsapp" />
            <BaseInput label="instagram" />
          </div>

          <div class="flex w-full">
            <div class="flex flex-col justify-center flex-1">
              <h6 class="text-sm font-semibold">Empresa activa</h6>
              <span class="text-xs text-muted-foreground">Oculta, sin acceso a la plataforma</span>
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
    <div class="grid grid-cols-3 gap-3 mt-5">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="flex flex-col p-4 bg-white rounded-lg border gap-y-2"
      >
        <div class="flex items-center gap-x-2">
          <picture class="flex size-14 border bg-primary/20 rounded-lg overflow-hidden">
            <img
              :src="`https://api.dicebear.com/10.x/bottts-neutral/svg?seed=${item.slug}`"
              class="w-full object-cover"
            />
          </picture>
          <h6 class="text-base font-semibold">{{ item.name }}</h6>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-x-1">
            <WhatsAppIcon class="size-3" />
            <span class="text-xs text-muted-foreground">{{ item.whatsapp }}</span>
          </div>
          <div class="flex items-center gap-x-1">
            <InstagramIcon class="size-3" />
            <span class="text-xs text-muted-foreground">@{{ item.slug }}</span>
          </div>
        </div>
        <BaseButton label="Editar" variant="secondary" class="bg-white border" size="sm" />
      </div>
    </div>
  </section>
</template>
