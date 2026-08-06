<script setup lang="ts">
import { Dialog, DialogDescription, DialogScrollContent, DialogTitle } from '@/shadcn/ui/dialog';
import { cn } from '@/shadcn/utils';
import { VisuallyHidden } from 'reka-ui';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  classContainer?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [void];
}>();

const onOpenChange = (isOpen: boolean) => {
  if (!isOpen) emit('close');
};
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogScrollContent
      :class="cn('max-w-3xl', classContainer)"
      :aria-describedby="description ? undefined : undefined"
    >
      <DialogTitle v-if="title">{{ title }}</DialogTitle>
      <VisuallyHidden v-else as-child>
        <DialogTitle>Modal</DialogTitle>
      </VisuallyHidden>
      <DialogDescription v-if="description">{{ description }}</DialogDescription>
      <slot />
    </DialogScrollContent>
  </Dialog>
</template>
