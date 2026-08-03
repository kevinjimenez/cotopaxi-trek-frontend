<script setup lang="ts">
import { Button, type ButtonVariants } from '@/shadcn/ui/button';
import { cn } from '@/shadcn/utils';
import { Loader2Icon, type LucideIcon } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';

interface Props {
  label?: string;
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  loading?: boolean;
  disabled?: boolean;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  iconClass?: HTMLAttributes['class'];
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
  <Button :variant="variant" :size="size" :disabled="disabled || loading" :class="cn(props.class)">
    <Loader2Icon v-if="loading" class="animate-spin" />

    <component :is="prefixIcon" v-else-if="prefixIcon" :class="iconClass" />

    {{ label }}

    <component :is="suffixIcon" v-if="suffixIcon && !loading" :class="iconClass" />
  </Button>
</template>
