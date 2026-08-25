<script setup lang="ts">
import { ref } from "vue";
import CreateMountainModal from "../components/mountain/CreateMountainModal.vue";
import HeaderMountainView from "../components/mountain/HeaderMountainView.vue";
import RowMountain from "../components/mountain/RowMountain.vue";
import NotData from "../components/NotData.vue";
import { useGetMountains } from "../queries/get-mountains.query";

const { data: mountains } = useGetMountains();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <HeaderMountainView @open="openModal" />
    <CreateMountainModal :open="open" @close="open = false" />
    <div class="flex flex-col mt-5">
      <NotData
        v-if="mountains?.length === 0"
        title="El catálogo está vacío"
        description="Agrega las montañas que ofrece la empresa. Después podrás agendarlas en cada temporada con
          su fecha y precio."
        btn-label="Agregar montaña"
        @click="openModal"
      />

      <div class="border w-full rounded-lg flex flex-col mt-5 bg-white" v-else>
        <RowMountain
          v-for="(mountain, index) in mountains"
          :index="index"
          :total="mountains?.length ?? 0"
          :key="mountain.id"
          :mountain="mountain"
        />
      </div>
    </div>
  </section>
</template>
