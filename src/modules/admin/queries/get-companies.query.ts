import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { CompanyResponse } from "../types/api/response/company-response.type";
import { companyKeys } from "./keys/company.query-key";

export const GET_COMPANIES_QUERY = `
  query {
      companies {
          id
          name
          whatsapp
          instagram
          status
          logoUrl
          slug
          primaryColor
      }
  }
`;

const getCompanies = async () => {
  const { companies } = await gql<{ companies: CompanyResponse[] }>(GET_COMPANIES_QUERY);

  return companies;
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: getCompanies,
  });
};
