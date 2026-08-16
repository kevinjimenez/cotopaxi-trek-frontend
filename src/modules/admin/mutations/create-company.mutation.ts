import { gql } from "@/shared/services/graphql";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { companyKeys } from "../queries/keys/company.query-key";
import type { CompanyRequest } from "../types/api/request/company-request.type";
import type { CompanyResponse } from "../types/api/response/company-response.type";

const CREATE_COMPANY_MUTATION = `
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(createCompanyInput: $input) {
      id
      name
      slug
      whatsapp
      status
    }
  }
`;

const createCompany = async (input: CompanyRequest) => {
  const { createCompany } = await gql<{ createCompany: CompanyResponse }>(CREATE_COMPANY_MUTATION, {
    input,
  });
  return createCompany;
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: async (newCompany) => {
      console.log({ newCompany });
      // queryClient.setQueryData<CompanyResponse[]>(companyKeys.all, (old) =>
      //   old ? [...old, newCompany] : [newCompany],
      // );
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};
