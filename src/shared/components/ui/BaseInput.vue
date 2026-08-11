<script setup lang="ts">
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shadcn/ui/input-group';
import { cn } from '@/shadcn/utils';
import type { LucideIcon } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';

interface Props {
  label?: string;
  placeholder?: string;
  type?: 'email' | 'number';
  prefix?: string;
  prefixIcon?: LucideIcon;
  suffix?: string;
  suffixIcon?: LucideIcon;
  class?: HTMLAttributes['class'];
  error?: string;
  required?: boolean;
}

defineOptions({ inheritAttrs: false });

const props = defineProps<Props>();
const model = defineModel<string>();
</script>

<template>
  <!-- <div :class="cn('grid w-full items-center gap-y-2', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs">{{ label }}</label>
    <Input :type="type" :placeholder="placeholder" v-maska="'#,##0'" />
  </div> -->
  <div :class="cn('grid w-full items-center', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs mb-2">
      {{ label }} {{ required ? '*' : '' }}
    </label>
    <InputGroup>
      <InputGroupAddon v-if="prefixIcon || prefix">
        <component :is="prefixIcon" v-if="prefixIcon" class="size-4" />
        <InputGroupText v-else>{{ prefix }}</InputGroupText>
      </InputGroupAddon>

      <InputGroupInput :type="type" :placeholder="placeholder" v-model="model" v-bind="$attrs" />

      <InputGroupAddon v-if="suffixIcon || suffix" align="inline-end">
        <component :is="suffixIcon" v-if="suffixIcon" class="size-4" />
        <InputGroupText v-else>{{ suffix }}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <span v-if="error" class="capitalize text-[0.7rem] font-medium text-destructive mt-0.5">{{
      error
    }}</span>
  </div>
</template>
