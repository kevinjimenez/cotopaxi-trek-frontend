import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type { Ref } from "vue";
import { userFormSchema, type UserFormSchema } from "../schemas/user-form.schema";
import type { UserRequest } from "../types/api/request/user-request.type";
import type { Mountain } from "../types/mountain.type";
import type { Season } from "../types/season.type";

export const useUserForm = (season: Ref<Season | undefined>, newMountains: Ref<Mountain[]>) => {
  const { handleSubmit, defineField, errors, resetForm } = useForm<UserFormSchema>({
    validationSchema: toTypedSchema(userFormSchema),
    initialValues: {
      companyId: "00000000-0000-0000-0000-000000000001",
      seasonId: undefined,
      name: "",
      lastname: "",
      email: "",
      phone: "",
      role: "customer",
      username: "",
      password: "",
      status: true,
      bookings: [],
    },
  });

  const [name, nameAttrs] = defineField("name");
  const [lastname, lastnameAttrs] = defineField("lastname");
  const [email, emailAttrs] = defineField("email");
  const [phone, phoneAttrs] = defineField("phone");
  const [username, usernameAttrs] = defineField("username");
  const [password, passwordAttrs] = defineField("password");
  const [status, statusAttrs] = defineField("status");

  const buildPayload = (value: UserFormSchema): UserRequest | undefined => {
    if (!season.value) return;

    return {
      ...value,
      seasonId: season.value.id,
      bookings: newMountains.value.map((mountain) => ({
        seasonMountainId: mountain.seasonMountainId,
      })),
    };
  };

  return {
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

    handleSubmit,
    errors,
    buildPayload,
    resetForm,
  };
};
