<script setup lang="ts">
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { cn } from '@/shadcn/utils';
import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today } from '@internationalized/date';

import { CalendarIcon } from '@lucide/vue';
import dayjs from 'dayjs';
import { ref, type HTMLAttributes, type Ref } from 'vue';

interface Props {
  label?: string;
  placeholder?: string;
  format?: string;
  class?: HTMLAttributes['class'];
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'dd/mm/yyyy',
  format: 'DD/MM/YY',
});
// const props = defineProps<Props>();

const defaultPlaceholder = today(getLocalTimeZone());
const date = ref() as Ref<DateValue>;
</script>

<template>
  <div :class="cn('w-full flex flex-col gap-y-1.5', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs">{{ label }}</label>
    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          variant="secondary"
          :class="
            cn(
              'justify-between text-left font-normal border bg-white',
              !date && 'text-muted-foreground',
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
          layout="month-and-year"
          initial-focus
          @update:model-value="close"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
