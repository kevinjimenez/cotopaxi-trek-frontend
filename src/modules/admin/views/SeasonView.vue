<script setup lang="ts">
import BaseAccordion from "@/shared/components/ui/BaseAccordion.vue";
import { ref } from "vue";
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

    <BaseAccordion class="mt-5">
      <RowSeason v-for="season in seasons" :key="season.id" :season="season" />
    </BaseAccordion>
  </section>
</template>
