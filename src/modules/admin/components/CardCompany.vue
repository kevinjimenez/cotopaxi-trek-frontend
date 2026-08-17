<script setup lang="ts">
import InstagramIcon from "@/shared/components/icons/InstagramIcon.vue";
import WhatsAppIcon from "@/shared/components/icons/WhatsAppIcon.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import type { CompanyResponse } from "../types/api/response/company-response.type";
import BaseImage from "@/shared/components/ui/BaseImage.vue";

interface Props {
  company: CompanyResponse;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col p-4 bg-white rounded-lg border gap-y-2">
    <div class="flex items-center gap-x-2">
      <BaseImage :image="company.slug" />
      <h6 class="text-base font-semibold">{{ company.name }}</h6>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-x-1">
        <WhatsAppIcon class="size-3" />
        <span class="text-xs text-muted-foreground">{{ company.whatsapp }}</span>
      </div>
      <div class="flex items-center gap-x-1">
        <InstagramIcon class="size-3" />
        <span class="text-xs text-muted-foreground">@{{ company?.instagram || company.slug }}</span>
      </div>
    </div>
    <BaseButton label="Editar" variant="secondary" class="bg-white border" size="sm" />
  </div>
</template>
