<template>
  <main class="w-full min-h-screen flex flex-col md:flex-row">
    <section class="flex w-full md:w-1/2 bg-background items-center justify-center">
      <div
        class="flex flex-col border rounded-md border-border shadow-sm w-2/3 py-8 px-7 gap-y-4 bg-white"
      >
        <h3 class="text-primary text-2xl font-bold">Iniciar sesión</h3>
        <section class="flex flex-col gap-y-4 items-center justify-center">
          <BaseInput
            required
            custom-class-input="h-10"
            label="Usuario"
            placeholder="Ingrese tu usuario"
            custom-class-label="capitalize text-foreground font-medium"
            :prefix-icon="User"
            v-model="username"
            v-bind="usernameAttrs"
            :error="errors.username"
          />

          <BaseInput
            required
            type="password"
            custom-class-input="h-10"
            label="Contraseña"
            placeholder="Ingrese tu contraseña"
            custom-class-label="capitalize text-foreground font-medium"
            :prefix-icon="Lock"
            v-model="password"
            v-bind="passwordAttrs"
            :error="errors.password"
          />

          <BaseButton
            label="Iniciar sesión"
            class="w-full"
            size="lg"
            @click="onEnter"
            :loading="isPending"
          />

          <span class="text-xs text-muted-foreground"
            >Acceso restringido a personal autorizado.</span
          >
        </section>
      </div>
    </section>
    <section class="w-full md:w-1/2 bg-primary/10 flex items-center justify-center">
      <picture class="rounded-xl overflow-hidden flex w-108 h-104">
        <img
          class="w-full object-cover"
          src="https://images.pexels.com/photos/914128/pexels-photo-914128.jpeg?_gl=1*1bdmr28*_ga*NTQ0MzY0MTMuMTc4NTk5MTg5NQ..*_ga_8JE65Q40S6*czE3ODY4ODI5NzMkbzMkZzEkdDE3ODY4ODMwMDkkajI0JGwwJGgw"
          alt=""
        />
      </picture>
    </section>
  </main>
</template>

<script setup lang="ts">
import BaseButton from "@/shared/components/ui/BaseButton.vue";
import BaseInput from "@/shared/components/ui/BaseInput.vue";
import { useToast } from "@/shared/composables/use-toast";
import { Lock, User } from "@lucide/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLogin } from "../mutations/login.mutation";
import { loginFormSchema, type LoginFormSchema } from "../schemas/login-form.schema";

const router = useRouter();
const { mutate: login, isPending, data } = useLogin();
const { success, error } = useToast();

const { handleSubmit, defineField, errors, resetForm } = useForm<LoginFormSchema>({
  validationSchema: toTypedSchema(loginFormSchema),
  initialValues: {
    username: "",
    password: "",
  },
});

const onEnter = () => {
  onSubmit();
};

onMounted(() => {
  resetForm();
});

const [username, usernameAttrs] = defineField("username");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(
  async (value) => {
    console.log({ value });

    login(
      {
        username: value.username,
        password: value.password,
      },
      {
        onSuccess: () => {
          resetForm();
          success("Success", `ingreso ok`);
          console.log({ data: data.value });
          router.push({ name: "user" });
        },
        onError: (err) => {
          error("No se pudo ingresar", err.message);
        },
      },
    );
  },
  ({ errors }) => {
    console.error("validation failed", errors);
  },
);
</script>
