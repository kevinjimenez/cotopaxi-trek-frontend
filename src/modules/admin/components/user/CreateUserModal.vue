<script setup lang="ts">
import Progress from "@/shadcn/ui/progress/Progress.vue";
import BaseBadge from "@/shared/components/ui/BaseBadge.vue";
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseModal from "@/shared/components/ui/BaseModal.vue";
import BaseTabs from "@/shared/components/ui/BaseTabs.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import { useToast } from "@/shared/composables/use-toast";
import { formatDate } from "@/shared/utils/date.utils";
import { CircleCheck, Plus, X } from "@lucide/vue";
import { watch } from "vue";
import { useMountain } from "../../composables/use-mountain";
import { useUserForm } from "../../composables/use-user-form";
import { useCreateUser } from "../../mutations/create-user.mutation";
import { useGetSeason } from "../../queries/get-season.query";

interface Props {
  open: boolean;
}

const { success, error } = useToast();
const { data: season } = useGetSeason({ status: true });
const { mutate: createUser, isPending } = useCreateUser();
const { cloneMountains, newMountains, addMountain, removeMountain } = useMountain(season);
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
      console.log(season.value?.mountains);
      cloneMountains.value = season.value?.mountains ? [...season.value.mountains] : [];
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
        <div class="flex flex-col w-full gap-y-2">
          <div class="flex gap-x-2">
            <BaseInput
              label="nombre"
              helperText="Ingrese el nombre del cliente"
              required
              v-model="name"
              v-bind="nameAttrs"
              :error="errors.name"
            />
            <BaseInput
              label="apellido"
              helperText="Ingrese el apellido del cliente"
              required
              v-model="lastname"
              v-bind="lastnameAttrs"
              :error="errors.lastname"
            />
          </div>
          <div class="flex gap-x-2">
            <BaseInput
              label="correo"
              helperText="Ingrese el correo del cliente"
              v-model="email"
              v-bind="emailAttrs"
              :error="errors.email"
              type="email"
            />
            <BaseInput
              label="telefono"
              helperText="Ingrese el telefono del cliente"
              required
              v-model="phone"
              v-bind="phoneAttrs"
              :error="errors.phone"
              mask="+593 ### ### ###"
            />
          </div>
          <div class="flex flex-col gap-y-4">
            <span class="uppercase text-xs text-muted-foreground font-semibold"
              >Cuenta de acceso</span
            >
            <div class="flex gap-x-2">
              <BaseInput
                label="username"
                helperText="Ingrese el username del cliente"
                required
                v-model="username"
                v-bind="usernameAttrs"
                :error="errors.username"
              />
              <BaseInput
                label="password"
                type="password"
                helperText="Ingrese el password del cliente"
                required
                v-model="password"
                v-bind="passwordAttrs"
                :error="errors.password"
              />
            </div>
          </div>
          <div class="flex w-full">
            <div class="flex flex-col justify-center flex-1">
              <h6 class="text-sm font-semibold">Temporada activa</h6>
              <span class="text-xs text-muted-foreground">Visible y disponible para reservas.</span>
            </div>
            <BaseToggle v-model="status" v-bind="statusAttrs" />
          </div>
        </div>
      </template>
      <template #season-mountains>
        <div class="flex flex-col w-full gap-y-5 p-4">
          <div class="flex flex-col gap-y-3">
            <div class="flex flex-col">
              <div class="flex gap-x-4 items-center">
                <h6 class="text-base font-semibold">
                  {{ season?.name }}
                </h6>
                <BaseBadge
                  label="Inscrito"
                  class="bg-success/10 text-success text-[0.6rem] font-bold"
                />
              </div>
              <span class="text-muted-foreground text-xs">
                {{ newMountains.length }} de {{ season?.mountains.length }} montañas contratadas
              </span>
            </div>
            <Progress
              :model-value="(newMountains.length * 100) / (season?.mountains.length ?? 1)"
              class="w-full"
            />
          </div>

          <!-- tomar -->
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground font-semibold uppercase"
              >Montañas disponible esta temporada</span
            >
            <div v-if="newMountains.length === season?.mountains.length">
              <BaseBadge
                :prefix-icon="CircleCheck"
                class="p-3 bg-success/10 text-success text-[0.68rem] font-semibold rounded-md"
                label="Ya se inscribió en todas las montañas disponibles en esta temporada."
              />
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <div
                v-for="mountain in cloneMountains"
                :key="mountain.id"
                class="flex p-2 border border-primary border-dashed rounded-xl items-center justify-center gap-x-3 cursor-pointer"
                @click="addMountain(mountain.id)"
              >
                <div class="flex gap-x-2 items-center">
                  <Plus class="size-3 text-primary" />
                  <span class="text-xs font-semibold text-primary">
                    {{ mountain.name }} - {{ formatDate(mountain.startDate) }}
                  </span>
                </div>
                <BaseBadge
                  label="Cierra en 3 días"
                  class="bg-success/10 text-success text-[0.6rem] font-bold"
                />
              </div>
            </div>
          </div>

          <!-- montañas -->
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground font-semibold uppercase"
              >{{ newMountains.length }} montañas seleccionadas</span
            >
            <div
              v-for="mountain in newMountains.sort((a, b) => a.sortOrder - b.sortOrder)"
              :key="mountain.id"
              class="flex w-full border mb-2 rounded-sm p-2.5 items-center justify-between bg-background relative"
            >
              <div class="flex gap-x-2 items-center">
                <BaseBadge class="size-5 bg-primary/10 text-primary" :label="mountain.sortOrder" />
                <span class="text-[0.79rem] font-semibold">{{ mountain.name }}</span>
                <span class="text-xs font-semibold">{{ formatDate(mountain.startDate) }}</span>
              </div>
              <BaseButton
                :prefix-icon="X"
                variant="ghost"
                size="icon-sm"
                class="absolute top-1 right-0 hover:bg-transparent hover:text-inherit text-muted-foreground"
                @click="removeMountain(mountain.id)"
              />
            </div>
          </div>
        </div>
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
