<script setup lang="ts">
import { Plus } from "@lucide/vue";
import type { MountainResponse } from "../../types/api/response/mountain-response.type";

interface Props {
  mountain: MountainResponse;
}

defineProps<Props>();

defineEmits<{
  add: [];
}>();
</script>

<template>
  <div
    class="flex p-2 border border-primary border-dashed rounded-xl items-center justify-center gap-x-0.5 cursor-pointer"
    @click="$emit('add')"
  >
    <Plus class="size-3 text-primary" />
    <span class="text-xs font-semibold text-primary">
      {{ mountain.name }}
    </span>
  </div>
</template>
