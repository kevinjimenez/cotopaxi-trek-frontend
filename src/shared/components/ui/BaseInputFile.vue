<script setup lang="ts">
import { ref } from 'vue';
import { ImageIcon, X } from '@lucide/vue';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/shadcn/ui/attachment';

const fileInput = ref<HTMLInputElement>();
const model = defineModel<File>();
const previewUrl = ref<string>();

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selected = input.files?.[0];
  if (!selected) return;

  model.value = selected;
  previewUrl.value = URL.createObjectURL(selected);
};

const removeFile = () => {
  model.value = undefined;
  previewUrl.value = undefined;
  if (fileInput.value) fileInput.value.value = '';
};
</script>

<template>
  <input ref="fileInput" type="file" accept="image/png" class="hidden" @change="onFileSelected" />

  <Attachment :state="model ? 'done' : 'idle'" orientation="vertical" class="w-32">
    <AttachmentMedia :variant="previewUrl ? 'image' : 'icon'">
      <img v-if="previewUrl" :src="previewUrl" :alt="model?.name" />
      <ImageIcon v-else />
    </AttachmentMedia>

    <AttachmentContent v-if="model">
      <AttachmentTitle>{{ model.name }}</AttachmentTitle>
      <AttachmentDescription>{{ (model.size / 1024).toFixed(1) }} KB</AttachmentDescription>
    </AttachmentContent>

    <AttachmentActions v-if="model">
      <AttachmentAction aria-label="Quitar imagen" @click="removeFile">
        <X />
      </AttachmentAction>
    </AttachmentActions>

    <AttachmentTrigger as-child>
      <button type="button" aria-label="Elegir imagen" @click="fileInput?.click()" />
    </AttachmentTrigger>
  </Attachment>
</template>
