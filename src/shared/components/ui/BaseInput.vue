<script setup lang="ts">
import { Input } from '@/shadcn/ui/input';
import { cn } from '@/shadcn/utils';
import type { HTMLAttributes } from 'vue';

interface Props {
  label?: string;
  placeholder?: string;
  type?: 'email';
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="cn('grid w-full items-center gap-y-2', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs">{{ label }}</label>
    <Input :type="type" :placeholder="placeholder" />
  </div>
</template>
