<script setup lang="ts">
import { formatDate } from "@/shared/utils/date.utils";
import type { Mountain } from "../../types/mountain.type";
import { X } from "@lucide/vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";

interface Props {
  mountain: Mountain;
}

defineProps<Props>();

defineEmits<{
  remove: [];
}>();
</script>

<template>
  <div
    :key="mountain.id"
    class="flex w-full border mb-2 rounded-sm p-2.5 items-center justify-between bg-background relative"
  >
    <div class="flex gap-x-2 items-center">
      <BaseBadge class="size-5 bg-primary/10 text-primary" :label="mountain.sortOrder" />
      <span class="text-[0.79rem] font-semibold">{{ mountain.name }}</span>
      <span class="text-xs font-semibold">{{ formatDate(mountain.startDate) }}</span>
    </div>
    <BaseButton
      :prefix-icon="X"
      variant="ghost"
      size="icon-sm"
      class="absolute top-1 right-0 hover:bg-transparent hover:text-inherit text-muted-foreground"
      @click="$emit('remove')"
    />
  </div>
</template>
