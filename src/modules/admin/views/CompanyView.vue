<script setup lang="ts">
import { ref } from "vue";
import CardCompany from "../components/CardCompany.vue";
import CreateCompanyModal from "../components/CreateCompanyModal.vue";
import HeaderCompanyView from "../components/HeaderCompanyView.vue";
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
    <div class="grid grid-cols-4 gap-4 mt-5">
      <CardCompany v-for="company in companies" :company="company" :key="company.id" />
    </div>
  </section>
</template>
