import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

export interface Season {
  id: number;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  mountains: Mountain[];
}

export interface Mountain {
  id: number;
  sortOrder: number;
  startDate: Date;
  endDate: Date;
  price: number;
  seasonMountainId: number;
  name: string;
}

export interface SeasonWithMountainsResponse {
  id: number;
  companyId: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  seasonMountains: SeasonMountainResponse[];
}

export interface SeasonMountainResponse {
  id: number;
  sortOrder: number;
  startDate: Date;
  endDate: Date;
  price: number;
  mountain: Mountain;
}

export interface MountainResponse {
  id: number;
  name: string;
}

const LIST = `
  query {
      seasonsWithMountains {
          id
          companyId
          name
          year
          startDate
          endDate
          isCurrent
          seasonMountains {
              id
              sortOrder
              startDate
              endDate
              price
              mountain {
                  id
                  name
              }
          }
      }
  }

`;

export const seasonKeys = {
  all: ['seasons_with_mountains'] as const,
};

export const listSeasonsWithMountains = async () => {
  const { seasonsWithMountains } = await gql<{
    seasonsWithMountains: SeasonWithMountainsResponse[];
  }>(LIST);

  const newSeasonsWithMountains = seasonsWithMountains.map((seasonsWithMountain) => {
    const { seasonMountains, ...rest } = seasonsWithMountain;
    if (seasonMountains.length !== 0) {
      const mountains = seasonMountains.map((seasonMountain) => {
        const { mountain, id, ...rest } = seasonMountain;
        return { ...rest, seasonMountainId: id, id: mountain.id, name: mountain.name };
      });
      return { ...rest, mountains };
    }
    return { ...rest, mountains: [] };
  });

  console.log({ newSeasonsWithMountains });

  return newSeasonsWithMountains;
};

export const useGetSeasonsWithMountains = () => {
  return useQuery({
    queryKey: seasonKeys.all,
    queryFn: listSeasonsWithMountains,
  });
};
