<script setup lang="ts">
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { Plus } from '@lucide/vue';
import { useGetUsersWithSeasons } from '../actions/user.action';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';

const { data } = useGetUsersWithSeasons();
</script>

<template>
  <section class="px-10 py-8">
    <section class="flex flex-row justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl font-bold">Usuarios</h4>
        <p class="text-sm text-muted-foreground">Company</p>
      </div>
      <BaseButton
        class="text-[0.8rem]"
        label="Nuevo usuario"
        :prefix-icon="Plus"
        icon-class="size-2.5"
      />
    </section>

    <Accordion type="single" collapsible class="w-full border rounded-lg">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`" class="p-4">
        <AccordionTrigger>{{ item.name }}?</AccordionTrigger>
        <AccordionContent> {{ item.id }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
