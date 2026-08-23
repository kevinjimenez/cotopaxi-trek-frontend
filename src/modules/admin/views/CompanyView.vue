<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import { Plus } from "@lucide/vue";
import { ref } from "vue";
import CardCompany from "../components/company/CardCompany.vue";
import CreateCompanyModal from "../components/company/CreateCompanyModal.vue";
import HeaderCompanyView from "../components/company/HeaderCompanyView.vue";
import { useGetCompanies } from "../queries/get-companies.query";

const { data: companies } = useGetCompanies();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <HeaderCompanyView @open="openModal" />
    <CreateCompanyModal :open="open" @close="open = false" />
    <div class="flex flex-col mt-5">
      <div
        v-if="companies?.length === 0"
        class="flex flex-col items-center justify-center w-full p-20 gap-y-3 border border-dashed rounded-lg bg-primary/5"
      >
        <img src="../../../assets/no-data.svg" alt="" width="80" />
        <h2 class="text-lg font-semibold">Todavía no hay empresas</h2>
        <span class="text-sm w-108 text-center text-muted-foreground">
          Crea la primera empresa para empezar. Cada empresa tiene su propio catálogo de montañas,
          temporadas y usuarios.
        </span>
        <BaseButton label="Crear primera empresa" :prefix-icon="Plus" icon-class="size-3" />
      </div>
      <div v-else class="grid grid-cols-4 gap-4 mt-5">
        <CardCompany v-for="company in companies" :company="company" :key="company.id" />
      </div>
    </div>
  </section>
</template>
