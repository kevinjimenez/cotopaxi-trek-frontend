<script setup lang="ts">
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/shadcn/ui/input-group';
import { cn } from '@/shadcn/utils';
import { Eye, EyeOff, type LucideIcon } from '@lucide/vue';
import type { HTMLAttributes } from 'vue';
import { computed, ref } from 'vue';
import { vMaska } from 'maska/vue';
import type { MaskInputOptions } from 'maska';

interface Props {
  label?: string;
  placeholder?: string;
  type?: 'email' | 'number' | 'password';
  prefix?: string;
  prefixIcon?: LucideIcon;
  suffix?: string;
  suffixIcon?: LucideIcon;
  class?: HTMLAttributes['class'];
  error?: string;
  required?: boolean;
  helperText?: string;
  mask?: string | MaskInputOptions;
}

defineOptions({ inheritAttrs: false });

const props = defineProps<Props>();
const model = defineModel<string>();

const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type !== 'password') return props.type;
  return showPassword.value ? 'text' : 'password';
});
</script>

<template>
  <!-- <div :class="cn('grid w-full items-center gap-y-2', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs">{{ label }}</label>
    <Input :type="type" :placeholder="placeholder" v-maska="'#,##0'" />
  </div> -->
  <div :class="cn('grid w-full items-center', props.class)">
    <label v-if="label" class="uppercase font-bold text-xs mb-2 text-muted-foreground">
      {{ label }} <span v-if="required" class="text-destructive"> * </span>
    </label>
    <InputGroup>
      <InputGroupAddon v-if="prefixIcon || prefix">
        <component :is="prefixIcon" v-if="prefixIcon" class="size-4" />
        <InputGroupText v-else>{{ prefix }}</InputGroupText>
      </InputGroupAddon>

      <InputGroupInput
        :type="inputType"
        :placeholder="placeholder"
        v-model="model"
        v-bind="$attrs"
        v-maska="mask"
      />

      <InputGroupAddon v-if="type === 'password' || suffixIcon || suffix" align="inline-end">
        <InputGroupButton
          v-if="type === 'password'"
          type="button"
          size="icon-xs"
          aria-label="Mostrar u ocultar contraseña"
          @click="showPassword = !showPassword"
        >
          <component :is="showPassword ? EyeOff : Eye" class="size-4" />
        </InputGroupButton>
        <component :is="suffixIcon" v-else-if="suffixIcon" class="size-4" />
        <InputGroupText v-else>{{ suffix }}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
    <p
      v-if="helperText && !error"
      class="text-[0.7rem] font-medium mt-0.5 text-muted-foreground/80"
    >
      {{ helperText }}
    </p>
    <span v-if="error" class="text-[0.7rem] font-medium text-destructive mt-0.5">{{ error }}</span>
  </div>
</template>
