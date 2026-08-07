<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
interface Props {
  tabs: readonly {
    tab: string;
    name: string;
    default: boolean;
  }[];
  // default: string;
}

const props = defineProps<Props>();
</script>

<template>
  <Tabs :default-value="props.tabs.find((i) => i.default)?.tab">
    <TabsList>
      <TabsTrigger v-for="(item, index) in props.tabs" :key="index" :value="item.tab">
        {{ item.name }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="(item, index) in props.tabs" :key="index" :value="item.tab">
      <slot :name="item.tab" />
    </TabsContent>
  </Tabs>
</template>
