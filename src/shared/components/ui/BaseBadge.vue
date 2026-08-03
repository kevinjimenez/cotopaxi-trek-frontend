<script setup lang="ts">
import { Badge } from '@/shadcn/ui/badge';
import type { ButtonVariants } from '@/shadcn/ui/button';
import { cn } from '@/shadcn/utils';
import type { HTMLAttributes } from 'vue';
interface Props {
  label: string;
  variant?: ButtonVariants['variant'];
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
  <Badge :class="cn(props.class)">{{ label }}</Badge>
</template>
