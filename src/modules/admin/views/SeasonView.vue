<script setup lang="ts">
import BaseAccordion from "@/shared/components/ui/BaseAccordion.vue";
import { ref } from "vue";
import NotData from "../components/NotData.vue";
import CreateSeasonModal from "../components/season/CreateSeasonModal.vue";
import HeaderSeasonView from "../components/season/HeaderSeasonView.vue";
import RowSeason from "../components/season/RowSeason.vue";
import { useGetSeasons } from "../queries/get-seasons.query";

const { data: seasons } = useGetSeasons();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <HeaderSeasonView @open="openModal" />
    <CreateSeasonModal :open="open" @close="open = false" />
    <div class="flex flex-col mt-5">
      <NotData
        v-if="seasons?.length === 0"
        title="Esta empresa aún no tiene temporadas"
        description="Una temporada define el rango de fechas en el que se agendan los ascensos y en el que se
          inscriben los usuarios."
        btn-label="Agregar temporada"
        @click="openModal"
      />
      <BaseAccordion class="mt-5" v-else>
        <RowSeason v-for="season in seasons" :key="season.id" :season="season" />
      </BaseAccordion>
    </div>
  </section>
</template>
