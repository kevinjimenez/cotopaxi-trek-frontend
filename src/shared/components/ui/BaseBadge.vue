<script setup lang="ts">
import { Badge } from '@/shadcn/ui/badge';
import type { ButtonVariants } from '@/shadcn/ui/button';
import { cn } from '@/shadcn/utils';
import type { LucideIcon } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';
interface Props {
  label: string | number;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  variant?: ButtonVariants['variant'];
  class?: HTMLAttributes['class'];
  iconClass?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <Badge :class="cn('flex flex-row gap-x-1 items-center', props.class)">
    <component :is="prefixIcon" v-if="prefixIcon" :class="iconClass" />
    {{ label }}
    <component :is="suffixIcon" v-if="suffixIcon" :class="iconClass" />
  </Badge>
</template>
