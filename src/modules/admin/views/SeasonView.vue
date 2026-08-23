<script setup lang="ts">
import BaseAccordion from "@/shared/components/ui/BaseAccordion.vue";
import { ref } from "vue";
import CreateSeasonModal from "../components/season/CreateSeasonModal.vue";
import HeaderSeasonView from "../components/season/HeaderSeasonView.vue";
import RowSeason from "../components/season/RowSeason.vue";
import { useGetSeasons } from "../queries/get-seasons.query";
import { Plus } from "@lucide/vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";

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
      <div
        v-if="seasons?.length === 0"
        class="flex flex-col items-center justify-center w-full p-20 gap-y-3 border border-dashed rounded-lg bg-primary/5"
      >
        <img src="../../../assets/no-data.svg" alt="" width="80" />
        <h2 class="text-lg font-semibold">Esta empresa aún no tiene temporadas</h2>
        <span class="text-sm w-108 text-center text-muted-foreground">
          Una temporada define el rango de fechas en el que se agendan los ascensos y en el que se
          inscriben los usuarios.
        </span>
        <BaseButton label="Agregar temporada" :prefix-icon="Plus" icon-class="size-3" />
      </div>
      <BaseAccordion class="mt-5" v-else>
        <RowSeason v-for="season in seasons" :key="season.id" :season="season" />
      </BaseAccordion>
    </div>
  </section>
</template>
