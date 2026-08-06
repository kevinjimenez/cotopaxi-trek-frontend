<script setup lang="ts">
import { Textarea } from '@/shadcn/ui/textarea';
import { cn } from '@/shadcn/utils';
import type { HTMLAttributes } from 'vue';

interface Props {
  label?: string;
  description?: string;
  placeholder?: string;
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>
<template>
  <div :class="cn('grid w-full items-center gap-y-2', props.class)">
    <div class="flex flex-col">
      <label v-if="label" class="uppercase font-bold text-xs mb-0.5">{{ label }}</label>
      <span v-if="description" class="text-muted-foreground text-xs">{{ description }}</span>
    </div>
    <Textarea :placeholder="placeholder" />
  </div>
</template>
