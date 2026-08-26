<script setup lang="ts">
import { ref } from "vue";
import CardCompany from "../components/company/CardCompany.vue";
import CreateCompanyModal from "../components/company/CreateCompanyModal.vue";
import HeaderCompanyView from "../components/company/HeaderCompanyView.vue";
import NotData from "../components/NotData.vue";
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
      <NotData
        v-if="companies?.length === 0"
        title="Todavía no hay empresas"
        description="Crea la primera empresa para empezar. Cada empresa tiene su propio catálogo de montañas,
          temporadas y usuarios."
        btn-label="Crear primera empresa"
        @click="openModal"
      />
      <div v-else class="grid grid-cols-4 gap-4 mt-5">
        <CardCompany v-for="company in companies" :company="company" :key="company.id" />
      </div>
    </div>
  </section>
</template>
