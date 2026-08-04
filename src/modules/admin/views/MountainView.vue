<script setup lang="ts">
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseDivider from '@/shared/components/ui/BaseDivider.vue';
import { Plus } from '@lucide/vue';
import { useGetMountains } from '../actions/mountain.action';

const { data } = useGetMountains();
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Montañas</h4>
        <p class="text-sm text-muted-foreground">
          Catalago de Company, independiente de las temporadas
        </p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nueva montaña"
        :prefix-icon="Plus"
        icon-class="size-2.5"
      />
    </section>

    <div class="border w-full rounded-lg flex flex-col mt-5">
      <div v-for="(item, index) in data" :key="index" class="w-full">
        <div class="py-3 px-4 flex items-center justify-between">
          <div class="flex flex-col gap-y-1">
            <h6 class="font-bold text-sm">{{ item.name }}</h6>
            <div class="flex flex-row items-center gap-x-2">
              <BaseBadge
                class="bg-primary/10 text-primary text-[0.68rem] font-bold"
                :label="`${item.altitudeMeters} mts`"
              />
              <p class="text-xs text-muted-foreground">{{ item.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-x-2.5">
            <BaseBadge
              class="bg-success/10 text-success text-[0.68rem] font-semibold"
              label="Activa"
            />
            <BaseButton
              class="text-[0.8rem] border bg-background"
              variant="secondary"
              label="Editar"
            />
          </div>
        </div>
        <BaseDivider v-if="index !== (data?.length ?? 0) - 1" />
      </div>
    </div>
  </section>
</template>
