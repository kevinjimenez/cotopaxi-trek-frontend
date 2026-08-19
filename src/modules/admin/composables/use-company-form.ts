import { toTypedSchema } from "@vee-validate/zod";
import { companyFormSchema, type CompanyFormSchema } from "../schemas/company-form.schema";
import { useForm } from "vee-validate";
import type { CompanyRequest } from "../types/api/request/company-request.type";

export const useCompanyForm = () => {
  const { handleSubmit, defineField, errors, resetForm } = useForm<CompanyFormSchema>({
    validationSchema: toTypedSchema(companyFormSchema),
    initialValues: {
      name: "",
      slug: "",
      whatsapp: "",
      instagram: "",
      logoUrl: "",
      primaryColor: "",
      status: true,
    },
  });

  const [name, nameAttrs] = defineField("name");
  const [slug, slugAttrs] = defineField("slug");
  const [whatsapp, whatsappAttrs] = defineField("whatsapp");
  const [instagram, instagramAttrs] = defineField("instagram");
  const [status, statusAttrs] = defineField("status");

  const buildPayload = (value: CompanyFormSchema): CompanyRequest => ({
    ...value,
    whatsapp: `${value.whatsapp.replace(/\s/g, "")}`,
  });

  return {
    name,
    slug,
    whatsapp,
    instagram,
    status,
    nameAttrs,
    slugAttrs,
    whatsappAttrs,
    instagramAttrs,
    statusAttrs,

    errors,
    buildPayload,
    resetForm,
    handleSubmit,
  };
};
