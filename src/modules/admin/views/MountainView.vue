<script setup lang="ts">
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDivider from "@/shared/components/ui/BaseDivider.vue";
import { ref } from "vue";
import CreateMountainModal from "../components/CreateMountainModal.vue";
import HeaderMountainView from "../components/HeaderMountainView.vue";
import { useGetMountains } from "../queries/get-mountains.query";

const { data: mountains } = useGetMountains();

const open = ref(false);

const openModal = () => {
  open.value = true;
};
</script>

<template>
  <section class="px-10 py-8">
    <HeaderMountainView @open-modal="openModal" />
    <CreateMountainModal :open="open" @close="open = false" />

    <div class="border w-full rounded-lg flex flex-col mt-5 bg-white">
      <div
        v-for="(mountain, index) in mountains"
        :key="mountain.id"
        class="w-full hover:bg-background rounded-lg"
      >
        <div class="py-3 px-4 flex items-center justify-between">
          <div class="flex flex-col gap-y-1">
            <h6 class="font-bold text-sm">{{ mountain.name }}</h6>
            <div class="flex flex-row items-center gap-x-2">
              <BaseBadge
                class="bg-primary/10 text-primary text-[0.68rem] font-bold"
                :label="`${mountain.altitudeMeters} mts`"
              />
              <p class="text-xs text-muted-foreground">{{ mountain.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-x-2.5">
            <BaseBadge
              :class="[
                'text-[0.68rem] font-semibold',
                {
                  'bg-success/10 text-success': mountain.status,
                  'bg-destructive/10 text-destructive': !mountain.status,
                },
              ]"
              :label="mountain.status ? 'Activo' : 'Inactivo'"
            />
            <BaseButton class="text-[0.8rem] border bg-white" variant="secondary" label="Editar" />
          </div>
        </div>
        <BaseDivider v-if="index !== (mountains?.length ?? 0) - 1" />
      </div>
    </div>
  </section>
</template>
