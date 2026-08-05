import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

interface Company {
  id: string;
  name: string;
  whatsapp: string;
  instagram: string | null;
  status: boolean;
  logoUrl: string | null;
  slug: string;
  primaryColor: string | null;
}

const LIST = `
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

export const companyKeys = {
  all: ['companies'] as const,
};

export const listCompanies = async () => {
  const { companies } = await gql<{ companies: Company[] }>(LIST);

  return companies;
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: listCompanies,
  });
};
