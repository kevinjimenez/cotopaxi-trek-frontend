<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';

interface Tab {
  tab: string;
  name: string;
  default: boolean;
}

interface Props {
  tabs: readonly Tab[];
}

const props = defineProps<Props>();
const defaultTab = props.tabs.find((i) => i.default)?.tab;
</script>

<template>
  <Tabs :default-value="defaultTab">
    <TabsList class="bg-white">
      <TabsTrigger
        v-for="(item, index) in props.tabs"
        :key="index"
        :value="item.tab"
        class="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary data-[state=active]:text-black data-[state=inactive]:text-muted-foreground data-[state=active]:rounded-none"
      >
        {{ item.name }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="(item, index) in props.tabs" :key="index" :value="item.tab">
      <slot :name="item.tab" />
    </TabsContent>
  </Tabs>
</template>
