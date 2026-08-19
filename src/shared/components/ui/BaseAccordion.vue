<script setup lang="ts">
import { Accordion } from "@/shadcn/ui/accordion";
import { cn } from "@/shadcn/utils";
import type { HTMLAttributes } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <Accordion
    type="single"
    collapsible
    :class="cn('w-full border rounded-lg bg-white', props.class)"
  >
    <slot />
  </Accordion>
</template>
