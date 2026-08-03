import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

interface Mountain {
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

export const listMountains = () => gql<{ mountains: Mountain[] }>(LIST).then((d) => d.mountains);

export const useGetMountains = () => {
  return useQuery({
    queryKey: mountainKeys.all,
    queryFn: listMountains,
  });
};
