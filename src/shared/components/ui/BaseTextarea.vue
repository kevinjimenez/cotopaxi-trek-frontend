<script setup lang="ts">
import { Textarea } from "@/shadcn/ui/textarea";
import { cn } from "@/shadcn/utils";
import type { HTMLAttributes } from "vue";

interface Props {
  label?: string;
  description?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  class?: HTMLAttributes["class"];
}

defineOptions({ inheritAttrs: false });

const props = defineProps<Props>();
const model = defineModel<string>();
</script>
<template>
  <div :class="cn('grid w-full items-center', props.class)">
    <div class="flex flex-col">
      <label v-if="label" class="uppercase font-bold text-xs mb-0.5 text-muted-foreground">
        {{ label }} <span v-if="required" class="text-destructive"> * </span>
      </label>
      <span v-if="description" class="text-muted-foreground text-xs">{{ description }}</span>
    </div>
    <Textarea v-model="model" :placeholder="placeholder" v-bind="$attrs" />
    <p
      v-if="helperText && !error"
      class="text-[0.7rem] font-medium mt-0.5 text-muted-foreground/80"
    >
      {{ helperText }}
    </p>
    <span v-if="error" class="text-[0.7rem] font-medium text-destructive mt-0.5">{{ error }}</span>
  </div>
</template>
