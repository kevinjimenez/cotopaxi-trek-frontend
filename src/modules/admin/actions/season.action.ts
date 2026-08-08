import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

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
  query ($status: Boolean) {
      seasonsWithMountains(status: $status) {
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

const ONE = `
  query {
      currentSeason {
          id
          name
          isCurrent
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
  current: ['seasons_with_mountains', 'current'] as const,
};

export const getSeasonCurrent = async () => {
  const { currentSeason } = await gql<{
    currentSeason: SeasonWithMountainsResponse;
  }>(ONE);

  const { seasonMountains, ...rest } = currentSeason;

  if (seasonMountains.length !== 0) {
    const mountains = seasonMountains.map((seasonMountain) => {
      const { mountain, id, ...rest } = seasonMountain;
      return { ...rest, seasonMountainId: id, id: mountain.id, name: mountain.name };
    });
    return { ...rest, mountains };
  }

  return { ...rest, mountains: [] };

  // const newSeasonsWithMountains = seasonsWithMountains.map((seasonsWithMountain) => {
  //   const { seasonMountains, ...rest } = seasonsWithMountain;
  //   if (seasonMountains.length !== 0) {
  //     const mountains = seasonMountains.map((seasonMountain) => {
  //       const { mountain, id, ...rest } = seasonMountain;
  //       return { ...rest, seasonMountainId: id, id: mountain.id, name: mountain.name };
  //     });
  //     return { ...rest, mountains };
  //   }
  //   return { ...rest, mountains: [] };
  // });

  // return newSeasonsWithMountains;
};

export const useGetSeasonCurrent = () => {
  return useQuery({
    queryKey: [...seasonKeys.current],
    queryFn: () => getSeasonCurrent(),
  });
};

export const listSeasonsWithMountains = async (status?: boolean) => {
  const { seasonsWithMountains } = await gql<{
    seasonsWithMountains: SeasonWithMountainsResponse[];
  }>(LIST, { status });

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

  return newSeasonsWithMountains;
};

export const useGetSeasonsWithMountains = (status?: Ref<boolean | undefined>) => {
  return useQuery({
    queryKey: [...seasonKeys.all, status],
    queryFn: () => listSeasonsWithMountains(status?.value),
  });
};
