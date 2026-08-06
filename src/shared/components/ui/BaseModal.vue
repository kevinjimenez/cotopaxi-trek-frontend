<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shadcn/ui/dialog';
import { VisuallyHidden } from 'reka-ui';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
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
    <DialogContent
      class="p-6 w-full max-w-md"
      :aria-describedby="description ? undefined : undefined"
    >
      <DialogTitle v-if="title">{{ title }}</DialogTitle>
      <VisuallyHidden v-else as-child>
        <DialogTitle>Modal</DialogTitle>
      </VisuallyHidden>
      <DialogDescription v-if="description">{{ description }}</DialogDescription>
      <slot />
    </DialogContent>
  </Dialog>
</template>
