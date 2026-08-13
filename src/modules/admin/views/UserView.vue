<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { Progress } from '@/shadcn/ui/progress';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseTabs from '@/shared/components/ui/BaseTabs.vue';
import BaseToggle from '@/shared/components/ui/BaseToggle.vue';
import { formatDate, isAfterNow } from '@/shared/utils/date.utils';
import { ChevronRight, CircleCheck, Plus, X } from '@lucide/vue';
import { ref, watch, type Ref } from 'vue';
import { useGetSeason } from '../queries/get-season.query';
import { useGetUsers } from '../queries/get-users.query';
import type { UserResponse } from '../types/api/response/user-response.type';
import type { Mountain } from '../types/mountain.type';
import { useForm } from 'vee-validate';
import { userFormSchema, type UserFormSchema } from '../schemas/user-form.schema';
import { toTypedSchema } from '@vee-validate/zod';
import { useCreateUser } from '../mutations/create-user.mutation';
import { toast } from 'vue-sonner';

const statu = ref(true);
const { data } = useGetUsers();
const { data: season } = useGetSeason(statu);
const { mutate: createUser, isPending } = useCreateUser();
const { handleSubmit, defineField, errors, resetForm } = useForm<UserFormSchema>({
  validationSchema: toTypedSchema(userFormSchema),
  initialValues: {
    companyId: '00000000-0000-0000-0000-000000000001',
    seasonId: undefined,
    name: '',
    lastname: '',
    email: '',
    phone: '',
    role: 'customer',
    username: '',
    password: '',
    status: true,
    bookings: [],
  },
});
const open = ref(false);
const tabs = [
  { tab: 'personal', name: 'Datos personales', default: true },
  { tab: 'season-mountains', name: 'Temporadas y montañas', default: false },
];

const [name, nameAttrs] = defineField('name');
const [lastname, lastnameAttrs] = defineField('lastname');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [status, statusAttrs] = defineField('status');

const cloneMountains = ref<Mountain[]>([]);
const newMountains = ref<Mountain[]>([]);

const moveMountain = (id: number, from: Ref<Mountain[]>, to: Ref<Mountain[]>) => {
  const mountain = from.value.find((m) => m.id === id);
  if (!mountain) return;
  to.value = [...to.value, mountain];
  from.value = from.value.filter((m) => m.id !== id);
};

const addMountain = (id: number) => moveMountain(id, cloneMountains, newMountains);
const removeMountain = (id: number) => moveMountain(id, newMountains, cloneMountains);

const activeSeason = (item: UserResponse) => item.userSeasons.find((e) => e.status);

const onSave = () => {
  onSubmit();
};

const onSubmit = handleSubmit(
  async (value) => {
    if (!season.value) return;
    const userToCreate = {
      ...value,
      seasonId: season.value.id,
      bookings: newMountains.value.map((mountain) => ({
        seasonMountainId: mountain.seasonMountainId,
      })),
    };
    createUser(userToCreate, {
      onSuccess: () => {
        resetForm();
        newMountains.value = [];
        toast.success('Usuario creado', {
          position: 'top-right',
          description: `${userToCreate.name} ya está disponible en la plataforma.`,
        });
        open.value = false;
      },
      onError: (error) => {
        toast.error('No se pudo crear el usuario', {
          position: 'top-right',
          description: error.message,
        });
      },
    });
  },
  ({ errors }) => {
    console.error('validation failed', errors);
  },
);

// watch(season, (value) => console.log({ season: value?.mountains }));
watch(
  season,
  (newMountains) => {
    if (newMountains?.mountains) cloneMountains.value = [...newMountains.mountains];
  },
  {
    immediate: true,
  },
);
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
        @click="open = true"
      />
      <BaseModal
        title="Nueva usuario"
        :open="open"
        @close="open = false"
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
                  <span class="text-xs text-muted-foreground"
                    >Visible y disponible para reservas.</span
                  >
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
                    <BaseBadge
                      class="size-5 bg-primary/10 text-primary"
                      :label="mountain.sortOrder"
                    />
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
            @click="open = false"
          />
          <BaseButton label="Guardar" class="flex-1" @click="onSave" :loading="isPending" />
        </div>
      </BaseModal>
    </section>

    <Accordion type="single" collapsible class="w-full border rounded-lg mt-5 bg-white">
      <AccordionItem v-for="item in data" :key="item.id" :value="`item-${item.id}`">
        <AccordionTrigger
          class="hover:no-underline items-center justify-center p-3 flex flex-row-reverse [&[data-state=open]>svg]:rotate-90 hover:bg-background"
        >
          <template #icon>
            <ChevronRight class="text-muted-foreground size-4 transition-transform duration-200" />
          </template>
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-y-1 w-full">
              <h6 class="font-bold text-sm">{{ item.name }}</h6>
              <div class="flex flex-row items-center gap-x-2">
                <p class="text-xs text-muted-foreground">
                  {{ item.phone }}
                </p>
                <div class="size-1 bg-muted-foreground rounded-full" />
                <p class="text-xs text-muted-foreground">@{{ item.username }}</p>
                <div class="size-1 bg-muted-foreground rounded-full" />
                <p class="text-xs text-muted-foreground">
                  {{
                    item.userSeasons.find((userSeason) => {
                      return userSeason.status;
                    })?.season.seasonMountains.length ?? 0
                  }}
                  Montañas
                </p>
              </div>

              <div class="flex flex-row gap-x-2 flex-wrap">
                <BaseBadge
                  v-for="(i, idx) in item.userSeasons"
                  :key="idx"
                  :class="[
                    'text-[0.68rem] font-bold',
                    i.status ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                  ]"
                  :label="i.season.name"
                />
              </div>
            </div>

            <div class="flex items-center gap-x-2.5">
              <BaseBadge
                :class="[
                  'text-[0.68rem] font-bold',
                  {
                    'bg-success/10 text-success': item.status,
                    'bg-destructive/10 text-destructive': !item.status,
                  },
                ]"
                :label="item.status ? 'Activa' : 'Inactivo'"
              />
              <BaseButton
                class="text-[0.8rem] border bg-white"
                variant="secondary"
                label="Editar"
                @click.stop
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <template
            v-if="!activeSeason(item) || activeSeason(item)?.season.seasonMountains.length === 0"
          >
            <div class="w-full flex pl-12 pt-2">
              <span class="text-muted-foreground/65 text-xs italic"
                >No está inscrit@ en la temporada activa.</span
              >
            </div>
          </template>

          <template v-else>
            <div class="pl-16 pr-4 pt-2">
              <span class="text-[0.79rem] font-semibold">{{
                activeSeason(item)?.season.name
              }}</span>
              <div
                v-for="(userSeason, i) in activeSeason(item)?.season.seasonMountains"
                :key="i"
                class="flex w-full border my-2 rounded-sm p-2.5 items-center justify-between bg-background"
              >
                <div class="flex gap-x-2 items-center">
                  <BaseBadge
                    class="size-5 bg-primary/10 text-primary"
                    :label="userSeason.sortOrder"
                  />
                  <span class="text-[0.79rem] font-semibold">{{ userSeason.mountain.name }}</span>
                  <span class="text-xs text-muted-foreground">{{
                    formatDate(userSeason.startDate, 'D MMM')
                  }}</span>
                </div>
                <div class="flex gap-x-2">
                  <BaseBadge
                    :class="[
                      'font-semibold text-[0.6rem]',
                      isAfterNow(userSeason.startDate)
                        ? 'bg-gray-500/10 text-gray-500'
                        : 'bg-primary/10 text-primary',
                    ]"
                    :label="isAfterNow(userSeason.startDate) ? 'Realizado' : 'Próxima'"
                  />
                  <BaseBadge
                    class="bg-success/10 text-success font-semibold text-[0.6rem]"
                    label="Pagado"
                  />
                </div>
              </div>
            </div>
          </template>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</template>
