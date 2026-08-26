<script setup lang="ts">
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseProgress from "@/shared/components/ui/BaseProgress.vue";
import { formatDate } from "@/shared/utils/date.utils";
import { CircleCheck, Plus } from "@lucide/vue";
import { computed, toRef, watch } from "vue";
import { useMountain } from "../../composables/use-mountain";
import type { Mountain } from "../../types/mountain.type";
import type { Season } from "../../types/season.type";
import RowUserMountain from "./RowUserMountain.vue";

interface Props {
  season: Season | undefined;
  open: boolean;
}

const props = defineProps<Props>();
const newMountains = defineModel<Mountain[]>("newMountains", { default: () => [] });

const { cloneMountains, addMountain, removeMountain } = useMountain(
  toRef(() => props.season),
  newMountains,
);

const progress = computed(() => {
  return (newMountains.value.length * 100) / (props.season?.mountains.length ?? 1);
});

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      cloneMountains.value = props.season?.mountains ? [...props.season.mountains] : [];
    }
  },
);
</script>

<template>
  <div class="flex flex-col w-full gap-y-5 p-4">
    <div v-if="!season">
      <span class="text-sm text-muted-foreground">La temporada esta inactiva</span>
    </div>

    <template v-else>
      <div class="flex flex-col gap-y-3">
        <div class="flex flex-col">
          <div class="flex gap-x-4 items-center">
            <h6 class="text-base font-semibold">
              {{ season?.name }}
            </h6>
            <BaseBadge
              label="Inscrito"
              class="bg-success/10 text-success text-[0.6rem] font-bold"
            />
          </div>
          <span class="text-muted-foreground text-xs">
            {{ newMountains.length }} de {{ season?.mountains.length }} montañas contratadas
          </span>
        </div>
        <BaseProgress :value="progress" />
      </div>

      <!-- tomar -->
      <div class="flex flex-col">
        <span class="text-xs text-muted-foreground font-semibold uppercase"
          >Montañas disponible esta temporada</span
        >
        <div v-if="cloneMountains.length === 0">
          <span class="text-sm text-muted-foreground"
            >La temporada esta sin moantañas asignadas</span
          >
        </div>

        <template v-else>
          <div v-if="newMountains.length === season?.mountains.length">
            <BaseBadge
              :prefix-icon="CircleCheck"
              class="p-3 bg-success/10 text-success text-[0.68rem] font-semibold rounded-md"
              label="Ya se inscribió en todas las montañas disponibles en esta temporada."
            />
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <div
              v-for="mountain in cloneMountains"
              :key="mountain.id"
              class="flex p-2 border border-primary border-dashed rounded-xl items-center justify-center gap-x-3 cursor-pointer"
              @click="addMountain(mountain.id)"
            >
              <div class="flex gap-x-2 items-center">
                <Plus class="size-3 text-primary" />
                <span class="text-xs font-semibold text-primary">
                  {{ mountain.name }} - {{ formatDate(mountain.startDate) }}
                </span>
              </div>
              <BaseBadge
                label="Cierra en 3 días"
                class="bg-success/10 text-success text-[0.6rem] font-bold"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- montañas -->
      <div class="flex flex-col">
        <span class="text-xs text-muted-foreground font-semibold uppercase"
          >{{ newMountains.length }} montañas seleccionadas</span
        >
        <RowUserMountain
          v-for="mountain in newMountains.sort((a, b) => a.sortOrder - b.sortOrder)"
          :key="mountain.id"
          :mountain="mountain"
          @remove="() => removeMountain(mountain.id)"
        />
      </div>
    </template>
  </div>
</template>
