import { ref, watch, type Ref } from "vue";
import type { DraggableEvent } from "vue-draggable-plus";
import type { SeasonMountainFormSchema } from "../schemas/season-mountain-form.schema";
import type { MountainResponse } from "../types/api/response/mountain-response.type";
import type { useSeasonForm } from "./use-season-form";

export const useSeasonMountains = (
  mountains: Ref<MountainResponse[] | undefined>,
  mountainsFieldArray: ReturnType<typeof useSeasonForm>["mountainsFieldArray"],
) => {
  const cloneMountains = ref<MountainResponse[]>([]);

  const mountainName = (mountainId: number) =>
    mountains.value?.find((m) => Number(m.id) === mountainId)?.name ?? "";

  const addMountain = (id: number) => {
    const mountain = cloneMountains.value.find((m) => m.id === id);
    if (!mountain) return;
    mountainsFieldArray.push({
      mountainId: Number(mountain.id),
      startDate: undefined as unknown as Date,
      price: undefined as unknown as number,
    });
    cloneMountains.value = cloneMountains.value.filter((m) => m.id !== id);
  };

  const removeMountain = (index: number) => {
    const mountainId = mountainsFieldArray.fields.value[index]?.value.mountainId;
    const mountain = mountains.value?.find((m) => Number(m.id) === mountainId);
    if (mountain) cloneMountains.value = [...cloneMountains.value, mountain];
    mountainsFieldArray.remove(index);
  };

  const reorderMountain = (event: DraggableEvent<SeasonMountainFormSchema>) => {
    const { oldIndex, newIndex } = event;
    if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
    mountainsFieldArray.move(oldIndex, newIndex);
  };

  watch(
    mountains,
    (newMountains, oldMountains) => {
      console.log({ newMountains, oldMountains });
      if (newMountains) cloneMountains.value = [...newMountains];
    },
    { immediate: true },
  );

  watch(
    cloneMountains,
    (newCloneMountains, oldCloneMountains) => {
      console.log({ newCloneMountains, oldCloneMountains });
      // if (newMountains) cloneMountains.value = [...newMountains];
    },
    // { immediate: true },
  );

  return {
    cloneMountains,

    mountainName,
    addMountain,
    removeMountain,
    reorderMountain,
  };
};
