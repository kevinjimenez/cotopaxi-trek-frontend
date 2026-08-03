import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

export interface SeasonWithMountains {
  id: number;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  seasonMountains: SeasonMountain[];
}

export interface SeasonMountain {
  sortOrder: number;
  startDate: Date;
  endDate: Date;
  price: number;
  mountain: Mountain;
}

export interface Mountain {
  id: number;
  name: string;
}

const LIST = `
  query {
      seasonsWithMountains {
          id
          name
          year
          startDate
          endDate
          isCurrent
          # company {
          #     name
          # }
          seasonMountains {
              sortOrder
              startDate
              endDate
              price
              mountain {
                  id
                  name
                  # altitudeMeters
              }
          }
      }
  }

`;

export const seasonKeys = {
  all: ['seasons_with_mountains'] as const,
};

export const listSeasonsWithMountains = () =>
  gql<{ seasonsWithMountains: SeasonWithMountains[] }>(LIST).then((d) => d.seasonsWithMountains);

export const useGetSeasonsWithMountains = () => {
  return useQuery({
    queryKey: seasonKeys.all,
    queryFn: listSeasonsWithMountains,
  });
};
