<script setup lang="ts">
import { Separator } from '@/shadcn/ui/separator';
import type { SeparatorProps } from 'reka-ui';
interface Props {
  orientation?: SeparatorProps['orientation'];
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
});
</script>

<template>
  <Separator :orientation="orientation" />
</template>
