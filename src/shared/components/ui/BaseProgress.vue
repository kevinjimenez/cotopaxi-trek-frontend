<script setup lang="ts">
import { Progress } from "@/shadcn/ui/progress";
import { cn } from "@/shadcn/utils";
import type { HtmlHTMLAttributes } from "vue";

interface Props {
  value: number | null | undefined;
  customClass?: HtmlHTMLAttributes["class"];
}

defineProps<Props>();
</script>

<template>
  <Progress :model-value="value" :class="cn('w-full', customClass)" />
</template>
