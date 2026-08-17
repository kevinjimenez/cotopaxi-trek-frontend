import { useForm } from "vee-validate";
import { mountainFormSchema, type MountainFormSchema } from "../schemas/mountain-form.schema";
import { toTypedSchema } from "@vee-validate/zod";
import { watchDebounced } from "@vueuse/core";
import { forwardGeocode } from "@/shared/services/nominatim.service";
import { computed, ref } from "vue";
import type { MountainRequest } from "../types/api/request/mountain-request.type";

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

  const lat = ref<number | null>(null);
  const lng = ref<number | null>(null);

  const altitudeMetersInput = computed({
    get: () => altitudeMeters.value?.toString() ?? "",
    set: (value: string) => {
      altitudeMeters.value = Number(value);
    },
  });

  const buildPayload = (value: MountainFormSchema): MountainRequest => ({
    ...value,
    latitude: lat.value !== null ? Number(lat.value.toFixed(6)) : undefined,
    longitude: lng.value !== null ? Number(lng.value.toFixed(6)) : undefined,
  });

  watchDebounced(
    () => reference.value,
    async (value) => {
      if (!value) return;
      const result = await forwardGeocode(value);
      if (result) {
        lat.value = result.lat;
        lng.value = result.lng;
      }
    },
    { debounce: 800 },
  );

  return {
    name,
    // altitudeMeters,
    altitudeMetersInput,
    location,
    reference,
    general,
    technical,
    status,
    lat,
    lng,
    nameAttrs,
    altitudeMetersAttrs,
    locationAttrs,
    referenceAttrs,
    generalAttrs,
    technicalAttrs,
    statusAttrs,

    buildPayload,
    handleSubmit,
    errors,
    resetForm,
  };
};
