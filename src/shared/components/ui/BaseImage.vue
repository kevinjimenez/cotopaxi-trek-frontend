<script setup lang="ts">
import { cn } from "@/shadcn/utils";
import { ref, watch, type HtmlHTMLAttributes } from "vue";

interface Props {
  image?: string;
  customClassContainer?: HtmlHTMLAttributes["class"];
  customClassImg?: HtmlHTMLAttributes["class"];
}

const src = ref<string | undefined>();

const props = defineProps<Props>();

watch(
  () => props.image,
  (image) => {
    if (image) src.value = `https://api.dicebear.com/10.x/bottts-neutral/svg?seed=${image}`;
    else src.value = "https://api.dicebear.com/10.x/bottts-neutral/svg";
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <picture
    :class="
      cn('flex size-14 border bg-primary/20 rounded-lg overflow-hidden', customClassContainer)
    "
  >
    <img :src="src" :class="cn('w-full object-cover', customClassImg)" />
  </picture>
</template>
