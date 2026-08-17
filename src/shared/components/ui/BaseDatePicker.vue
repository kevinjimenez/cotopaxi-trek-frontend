<script setup lang="ts">
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { cn } from "@/shadcn/utils";
import type { DateValue } from "@internationalized/date";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

import { CalendarIcon } from "@lucide/vue";
import dayjs from "dayjs";
import { computed, type HTMLAttributes } from "vue";

interface Props {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  class?: HTMLAttributes["class"];
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: "dd/mm/yyyy",
  format: "DD/MM/YY",
});

const modelValue = defineModel<Date>();

const defaultPlaceholder = today(getLocalTimeZone());

const toCalendarDate = (value?: Date) => {
  if (!value) return undefined;
  return new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
};

const date = computed<DateValue | undefined>({
  get: () => toCalendarDate(modelValue.value),
  set: (value) => {
    modelValue.value = value?.toDate(getLocalTimeZone());
  },
});

const minValue = computed(() => toCalendarDate(props.minDate));
const maxValue = computed(() => toCalendarDate(props.maxDate));
</script>

<template>
  <div :class="cn('w-full flex flex-col gap-y-1.5', props.class)">
    <label
      v-if="label"
      :class="[
        'uppercase font-bold text-xs',
        {
          'text-destructive': error,
        },
      ]"
      >{{ label }} <span v-if="required" class="text-destructive"> * </span></label
    >
    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          variant="secondary"
          :class="
            cn(
              'justify-between text-left font-normal border bg-white',
              !date && 'text-muted-foreground',
              {
                'border-destructive': error,
              },
            )
          "
        >
          {{ date ? dayjs(date.toDate(getLocalTimeZone())).format(props.format) : placeholder }}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          v-model="date"
          :default-placeholder="defaultPlaceholder"
          :min-value="minValue"
          :max-value="maxValue"
          layout="month-and-year"
          initial-focus
          @update:model-value="close"
        />
      </PopoverContent>
    </Popover>
    <p
      v-if="helperText && !error"
      class="text-[0.7rem] font-medium mt-0.5 text-muted-foreground/80"
    >
      {{ helperText }}
    </p>
    <span v-if="error" class="text-[0.7rem] font-medium text-destructive mt-0.5">{{ error }}</span>
  </div>
</template>
