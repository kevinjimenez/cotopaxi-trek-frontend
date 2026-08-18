<script setup lang="ts">
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseDatePicker from "@/shared/components/ui/BaseDatePicker.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import { GripHorizontal, X } from "@lucide/vue";
import { useField } from "vee-validate";
import { computed } from "vue";

interface Props {
  index: number;
  name: string;
  startDateMin?: Date;
  startDateMax?: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{ remove: [] }>();

const {
  value: price,
  errorMessage: priceError,
  handleBlur: priceBlur,
} = useField<number>(() => `mountains[${props.index}].price`);

const {
  value: startDate,
  errorMessage: startDateError,
  handleBlur: startDateBlur,
} = useField<Date>(() => `mountains[${props.index}].startDate`);

const priceInput = computed({
  get: () => price.value?.toString() ?? "",
  set: (value: string) => {
    price.value = parsePrice(value);
  },
});

const parsePrice = (value?: string): number => {
  if (!value) return undefined as unknown as number;
  return Number(value.replace(/\./g, "").replace(",", "."));
};
</script>

<template>
  <div
    class="flex w-full border mb-2 rounded-sm p-2.5 items-center bg-background cursor-move gap-x-2 relative"
  >
    <BaseButton
      :prefix-icon="X"
      variant="ghost"
      size="icon-xs"
      class="absolute top-0 right-0 hover:bg-transparent hover:text-inherit text-muted-foreground"
      @click="emit('remove')"
    />
    <GripHorizontal class="text-muted-foreground" />
    <div class="flex gap-x-2 items-center w-full">
      <BaseBadge class="size-5 bg-primary/10 text-primary" :label="index + 1" />
      <div class="flex flex-col w-full">
        <span class="text-[0.79rem] font-semibold">{{ name }}</span>
        <div class="flex gap-x-2">
          <BaseInput
            prefix="$"
            required
            :mask="{ number: { locale: 'es-EC', fraction: 2 } }"
            v-model="priceInput"
            @blur="priceBlur"
            :error="priceError"
          />
          <BaseDatePicker
            required
            format="D MMM"
            placeholder="Fecha, ej. 25 jul"
            :min-date="startDateMin"
            :max-date="startDateMax"
            v-model="startDate"
            @blur="startDateBlur"
            :error="startDateError"
          />
        </div>
      </div>
    </div>
  </div>
</template>
