<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseTabs from "@/shared/components/ui/BaseTabs.vue";
import { useToast } from "@/shared/composables/use-toast";
import { ref, watch } from "vue";
import { useUserForm } from "../../composables/use-user-form";
import { useCreateUser } from "../../mutations/create-user.mutation";
import { useGetSeason } from "../../queries/get-season.query";
import type { Mountain } from "../../types/mountain.type.ts";
import TabEnroll from "./TabEnroll.vue";
import TabPersonal from "./TabPersonal.vue";

interface Props {
  open: boolean;
}

const { success, error } = useToast();
const { data: season } = useGetSeason({ status: true });
const { mutate: createUser, isPending } = useCreateUser();
const newMountains = ref<Mountain[]>([]);
const {
  name,
  lastname,
  email,
  phone,
  username,
  password,
  status,
  nameAttrs,
  lastnameAttrs,
  emailAttrs,
  phoneAttrs,
  usernameAttrs,
  passwordAttrs,
  statusAttrs,

  errors,
  buildPayload,
  resetForm,
  handleSubmit,
} = useUserForm(season, newMountains);

const tabs = [
  { tab: "personal", name: "Datos personales", default: true },
  { tab: "season-mountains", name: "Temporadas y montañas", default: false },
];

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const onSave = () => {
  onSubmit();
};

const onSubmit = handleSubmit(
  async (values) => {
    const userToCreate = buildPayload(values);
    if (!userToCreate) return;

    createUser(userToCreate, {
      onSuccess: () => {
        resetForm();
        newMountains.value = [];

        success("Usuario creado", "`${userToCreate.name} ya está disponible en la plataforma.`");
        emit("close");
      },
      onError: (err) => {
        error("No se pudo crear el usuario", err.message);
      },
    });
  },
  ({ errors }) => {
    console.error("validation failed", errors);
  },
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm();
      newMountains.value = [];
    }
  },
);
</script>

<template>
  <BaseModal
    title="Nueva usuario"
    :open="open"
    @close="emit('close')"
    class-container="max-w-[40rem]"
  >
    <BaseTabs :tabs="tabs">
      <template #personal>
        <TabPersonal
          v-model:name="name"
          v-model:lastname="lastname"
          v-model:email="email"
          v-model:phone="phone"
          v-model:username="username"
          v-model:password="password"
          v-model:status="status"
          :nameAttrs="nameAttrs"
          :lastnameAttrs="lastnameAttrs"
          :emailAttrs="emailAttrs"
          :phoneAttrs="phoneAttrs"
          :usernameAttrs="usernameAttrs"
          :passwordAttrs="passwordAttrs"
          :statusAttrs="statusAttrs"
          :errors="errors"
        />
      </template>
      <template #season-mountains>
        <TabEnroll v-model:new-mountains="newMountains" :season="season" :open="open" />
      </template>
    </BaseTabs>

    <div class="flex w-full gap-x-2">
      <BaseButton
        label="Cancelar"
        class="flex-1 border bg-white"
        variant="secondary"
        @click="emit('close')"
      />
      <BaseButton label="Guardar" class="flex-1" @click="onSave" :loading="isPending" />
    </div>
  </BaseModal>
</template>
