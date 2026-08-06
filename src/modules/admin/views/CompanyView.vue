<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import { BookUser, Plus, Shield } from '@lucide/vue';
import { useGetCompanies } from '../actions/company.action';
import { ref } from 'vue';

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
        <div class="flex flex-col w-full gap-y-5 bg-red-200">
          <span> modal company </span>
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
            <BookUser class="text-muted-foreground" :size="12" />
            <span class="text-xs text-muted-foreground">{{ item.whatsapp }}</span>
          </div>
          <div class="flex items-center gap-x-1">
            <Shield class="text-muted-foreground" :size="12" />
            <span class="text-xs text-muted-foreground">@{{ item.slug }}</span>
          </div>
        </div>
        <BaseButton label="Editar" variant="secondary" class="bg-white border" size="sm" />
      </div>
    </div>
  </section>
</template>
