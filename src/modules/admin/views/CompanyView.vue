<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { BookUser, Plus, Shield } from '@lucide/vue';

// const { data } = useGetMountains();
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Empresas</h4>
        <p class="text-sm text-muted-foreground">Cuentas de empresas que usan la plataforma</p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nueva empresa"
        :prefix-icon="Plus"
        icon-class="size-2.5"
      />
    </section>
    <div class="grid grid-cols-3 gap-3">
      <div class="flex flex-col p-4 bg-white rounded-lg border gap-y-2">
        <div class="flex items-center gap-x-2">
          <picture class="size-14 border bg-primary/20 rounded-lg overflow-hidden">
            <img src="https://api.dicebear.com/10.x/avataaars-neutral/svg?seed=12" width="100%" />
          </picture>
          <h6 class="text-base font-semibold">Company</h6>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-x-1">
            <BookUser class="text-muted-foreground" :size="12" />
            <span class="text-xs text-muted-foreground">0998047440</span>
          </div>
          <div class="flex items-center gap-x-1">
            <Shield class="text-muted-foreground" :size="12" />
            <span class="text-xs text-muted-foreground">@company</span>
          </div>
        </div>
        <BaseButton label="Editar" variant="secondary" class="bg-white border" size="sm" />
      </div>
    </div>

    <!-- <div class="border w-full rounded-lg flex flex-col mt-5 bg-white">
      <div v-for="(item, index) in data" :key="index" class="w-full hover:bg-background rounded-lg">
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
    </div> -->
  </section>
</template>
