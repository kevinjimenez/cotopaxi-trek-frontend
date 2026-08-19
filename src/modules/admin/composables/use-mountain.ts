import { ref, watch, type Ref } from "vue";
import type { Mountain } from "../types/mountain.type";
import type { Season } from "../types/season.type";

export const useMountain = (
  season: Ref<Season | undefined>,
  newMountains: Ref<Mountain[]> = ref<Mountain[]>([]),
) => {
  const cloneMountains = ref<Mountain[]>([]);

  const moveMountain = (id: number, from: Ref<Mountain[]>, to: Ref<Mountain[]>) => {
    const mountain = from.value.find((m) => m.id === id);
    if (!mountain) return;
    to.value = [...to.value, mountain];
    from.value = from.value.filter((m) => m.id !== id);
  };

  const addMountain = (id: number) => moveMountain(id, cloneMountains, newMountains);
  const removeMountain = (id: number) => moveMountain(id, newMountains, cloneMountains);

  watch(
    season,
    (newMountains) => {
      if (newMountains?.mountains) cloneMountains.value = [...newMountains.mountains];
    },
    {
      immediate: true,
    },
  );

  return {
    cloneMountains,
    newMountains,

    addMountain,
    removeMountain,
  };
};
