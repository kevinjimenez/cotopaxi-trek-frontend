<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import { Plus } from "@lucide/vue";

interface Props {
  title: string;
  btnLabel: string;
  description?: string;
}

defineProps<Props>();

defineEmits<{
  click: [];
}>();
</script>
<template>
  <div
    class="flex flex-col items-center justify-center w-full p-20 gap-y-3 border border-dashed rounded-lg bg-primary/5"
  >
    <img src="../../../assets/no-data.svg" alt="" width="80" />
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <span v-if="description" class="text-sm w-108 text-center text-muted-foreground">
      {{ description }}
    </span>
    <BaseButton :label="btnLabel" :prefix-icon="Plus" icon-class="size-3" @click="$emit('click')" />
  </div>
</template>
