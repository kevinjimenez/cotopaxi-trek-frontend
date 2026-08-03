<script setup lang="ts">
import { Button, type ButtonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  class?: HTMLAttributes['class'];
}

const props = defineProps<Props>();
</script>

<template>
  <Button :variant="variant" :size="size" :disable="disabled || loading" :class="cn(props.class)">
    <Loader2Icon v-if="loading" class="animate-spin" />

    <component :is="prefixIcon" v-else-if="prefixIcon" />

    {{ label }}

    <component :is="suffixIcon" v-if="suffixIcon && !loading" />
  </Button>
</template>
