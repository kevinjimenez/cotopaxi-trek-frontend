import { useFieldArray, useForm } from "vee-validate";
import { seasonFormSchema, type SeasonFormSchema } from "../schemas/season-form.schema";
import { toTypedSchema } from "@vee-validate/zod";
import type { SeasonMountainFormSchema } from "../schemas/season-mountain-form.schema";

export const useSeasonForm = () => {
  const { handleSubmit, defineField, errors, resetForm } = useForm<SeasonFormSchema>({
    validationSchema: toTypedSchema(seasonFormSchema),
    initialValues: {
      companyId: "00000000-0000-0000-0000-000000000001",
      name: "",
      year: "" as unknown as number,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
      isCurrent: true,
      mountains: [],
    },
  });

  const [name, nameAttrs] = defineField("name");
  const [startDate, startDateAttrs] = defineField("startDate");
  const [endDate, endDateAttrs] = defineField("endDate");
  const [isCurrent, isCurrentAttrs] = defineField("isCurrent");

  const mountainsFieldArray = useFieldArray<SeasonMountainFormSchema>("mountains");
  return {
    name,
    startDate,
    endDate,
    isCurrent,
    nameAttrs,
    startDateAttrs,
    endDateAttrs,
    isCurrentAttrs,
    mountainsFieldArray,

    errors,
    resetForm,
    handleSubmit,
  };
};
