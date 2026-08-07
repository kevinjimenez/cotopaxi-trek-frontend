import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

export interface Mountain {
  id: string;
  name: string;
  location: string;
  altitudeMeters: string;
}

const LIST = `
  query {
      mountains {
          id
          name
          location
          altitudeMeters
          status
      }
  }
`;

export const mountainKeys = {
  all: ['mountains'] as const,
};

export const listMountains = async () => {
  const { mountains } = await gql<{ mountains: Mountain[] }>(LIST);

  return mountains;
};

export const useGetMountains = () => {
  return useQuery({
    queryKey: mountainKeys.all,
    queryFn: listMountains,
  });
};
