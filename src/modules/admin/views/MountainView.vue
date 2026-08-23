<script setup lang="ts">
import { Plus } from "@lucide/vue";
import { ref } from "vue";
import CreateMountainModal from "../components/mountain/CreateMountainModal.vue";
import HeaderMountainView from "../components/mountain/HeaderMountainView.vue";
import RowMountain from "../components/mountain/RowMountain.vue";
import { useGetMountains } from "../queries/get-mountains.query";
import BaseButton from "@/shared/components/ui/BaseButton.vue";

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
      <div
        v-if="mountains?.length === 0"
        class="flex flex-col items-center justify-center w-full p-20 gap-y-3 border border-dashed rounded-lg bg-primary/5"
      >
        <img src="../../../assets/no-data.svg" alt="" width="80" />
        <h2 class="text-lg font-semibold">El catálogo está vacío</h2>
        <span class="text-sm w-108 text-center text-muted-foreground">
          Agrega las montañas que ofrece la empresa. Después podrás agendarlas en cada temporada con
          su fecha y precio.
        </span>
        <BaseButton label="Agregar montaña" :prefix-icon="Plus" icon-class="size-3" />
      </div>

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
