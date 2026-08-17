<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
import { computed } from "vue";

const model = defineModel<boolean>({ default: true });

const toggleValue = computed({
  get: () => (model.value ? "active" : "inactive"),
  set: (value: string) => {
    model.value = value === "active";
  },
});
</script>

<template>
  <ToggleGroup v-model="toggleValue" type="single" :spacing="1" class="bg-muted rounded-lg p-1">
    <ToggleGroupItem
      value="active"
      class="rounded-lg data-[state=on]:bg-white data-[state=on]:text-success"
    >
      Activa
    </ToggleGroupItem>
    <ToggleGroupItem
      value="inactive"
      class="rounded-lg data-[state=on]:bg-white data-[state=on]:text-destructive"
    >
      Inactiva
    </ToggleGroupItem>
  </ToggleGroup>
</template>
