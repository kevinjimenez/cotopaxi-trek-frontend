<script setup lang="ts">
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import BaseToggle from "@/shared/components/ui/BaseToggle.vue";
import type { BaseFieldProps, FormErrors, GenericObject } from "vee-validate";
import type { UserFormSchema } from "../../schemas/user-form.schema";

interface Props {
  nameAttrs: BaseFieldProps & GenericObject;
  lastnameAttrs: BaseFieldProps & GenericObject;
  emailAttrs: BaseFieldProps & GenericObject;
  phoneAttrs: BaseFieldProps & GenericObject;
  usernameAttrs: BaseFieldProps & GenericObject;
  passwordAttrs: BaseFieldProps & GenericObject;
  statusAttrs: BaseFieldProps & GenericObject;
  errors: FormErrors<UserFormSchema>;
}

defineProps<Props>();

const name = defineModel<string>("name");
const lastname = defineModel<string>("lastname");
const email = defineModel<string>("email");
const phone = defineModel<string>("phone");
const username = defineModel<string>("username");
const password = defineModel<string>("password");
const status = defineModel<boolean>("status");
</script>

<template>
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
      <span class="uppercase text-xs text-muted-foreground font-semibold">Cuenta de acceso</span>
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
