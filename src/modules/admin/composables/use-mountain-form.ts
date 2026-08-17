import { useForm } from "vee-validate";
import { mountainFormSchema, type MountainFormSchema } from "../schemas/mountain-form.schema";
import { toTypedSchema } from "@vee-validate/zod";

export const useMountainForm = () => {
  const { handleSubmit, defineField, errors, resetForm } = useForm<MountainFormSchema>({
    validationSchema: toTypedSchema(mountainFormSchema),
    initialValues: {
      companyId: "00000000-0000-0000-0000-000000000001",
      name: "",
      altitudeMeters: "" as unknown as number,
      location: "",
      reference: "",
      generalDescription: "",
      technicalDescription: "",
      status: true,
    },
  });

  const [name, nameAttrs] = defineField("name");
  const [altitudeMeters, altitudeMetersAttrs] = defineField("altitudeMeters");
  const [location, locationAttrs] = defineField("location");
  const [reference, referenceAttrs] = defineField("reference");
  const [general, generalAttrs] = defineField("generalDescription");
  const [technical, technicalAttrs] = defineField("technicalDescription");
  const [status, statusAttrs] = defineField("status");

  return {
    name,
    altitudeMeters,
    location,
    reference,
    general,
    technical,
    status,
    nameAttrs,
    altitudeMetersAttrs,
    locationAttrs,
    referenceAttrs,
    generalAttrs,
    technicalAttrs,
    statusAttrs,

    handleSubmit,
    errors,
    resetForm,
  };
};
