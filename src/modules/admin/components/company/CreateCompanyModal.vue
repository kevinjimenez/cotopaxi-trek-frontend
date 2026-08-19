<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseInputFile from "@/shared/components/ui/BaseInputFile.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { ref, watch } from "vue";
import { useCompanyForm } from "../../composables/use-company-form";
import { useCreateCompany } from "../../mutations/create-company.mutation";
import { useToast } from "@/shared/composables/use-toast";

interface Props {
  open: boolean;
}

const { success, error } = useToast();
const { mutate: createCompany, isPending } = useCreateCompany();
const {
  name,
  slug,
  status,
  instagram,
  whatsapp,
  instagramAttrs,
  nameAttrs,
  slugAttrs,
  statusAttrs,
  whatsappAttrs,
  errors,
  buildPayload,
  handleSubmit,
  resetForm,
} = useCompanyForm();

const logoFile = ref<File>();

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const onSubmit = handleSubmit(
  async (values) => {
    const companyToCreate = buildPayload(values);
    createCompany(companyToCreate, {
      onSuccess: () => {
        resetForm();
        success("Empresa creada", `${companyToCreate.name} ya está disponible en la plataforma.`);
        emit("close");
      },
      onError: (err) => {
        error("No se pudo crear la empresa", err.message);
      },
    });
  },
  ({ errors }) => {
    console.error("validation failed", errors);
  },
);

const onSave = () => {
  onSubmit();
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);
</script>

<template>
  <BaseModal
    title="Nueva empresa"
    :open="open"
    @close="emit('close')"
    class-container="max-w-[35rem]"
  >
    <div class="flex flex-col w-full gap-y-5">
      <div class="flex flex-row w-full gap-x-4 items-center">
        <BaseInputFile v-model="logoFile" />
        <div class="flex flex-col w-full gap-y-2">
          <BaseInput
            label="nombre de la empresa"
            helper-text="Ingrese el nombre de la empresa"
            v-model="name"
            v-bind="nameAttrs"
            :error="errors.name"
            required
          />
          <BaseInput
            required
            v-model="slug"
            v-bind="slugAttrs"
            label="slug"
            :error="errors.slug"
            helper-text="Ingrese el nombre de la slug"
          />
        </div>
      </div>

      <div class="flex w-full gap-x-4">
        <BaseInput
          required
          v-model="whatsapp"
          v-bind="whatsappAttrs"
          label="whatsapp"
          mask="+593 ### ### ###"
          :error="errors.whatsapp"
          helper-text="Ingrese el numero de whatsapp"
        />
        <BaseInput
          v-model="instagram"
          v-bind="instagramAttrs"
          label="instagram"
          helper-text="Ingrese el instagram"
        />
      </div>

      <div class="flex w-full">
        <div class="flex flex-col justify-center flex-1">
          <h6 class="text-sm font-semibold">Empresa activa</h6>
          <span class="text-xs text-muted-foreground">Oculta, sin acceso a la plataforma</span>
        </div>
        <BaseToggle v-model="status" v-bind="statusAttrs" />
      </div>
      <div class="flex w-full gap-x-2">
        <BaseButton
          label="Cancelar"
          class="flex-1 border bg-white"
          variant="secondary"
          @click="emit('close')"
        />
        <BaseButton label="Guardar" class="flex-1" :loading="isPending" @click="onSave" />
      </div>
    </div>
  </BaseModal>
</template>
