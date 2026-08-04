import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';

export interface UserWithSeasons {
  id: string;
  name: string;
  lastname: string;
  username: string;
  phone: string;
  userSeasons: UserSeason[];
}

export interface UserSeason {
  status: boolean;
  season: Season;
}

export interface Season {
  id: number;
  name: string;
  year: number;
  isCurrent: boolean;
  seasonMountains: SeasonMountain[];
}

export interface SeasonMountain {
  sortOrder: number;
  price: number;
  startDate: Date;
  endDate: Date;
  mountain: Mountain;
}

export interface Mountain {
  id: number;
  name: string;
}

const LIST = `
  query {
      usersWithSeasons {
          id
          name
          lastname
          username
          phone
          userSeasons {
              status
              season {
                  id
                  name
                  year
                  isCurrent
                  seasonMountains {
                      sortOrder
                      price
                      startDate
                      endDate
                      mountain {
                          id
                          name
                      }
                  }
              }
          }
      }
  }

`;

export const userKeys = {
  all: ['users_with_seasons'] as const,
};

export const listUsersWithSeasons = async () => {
  const { usersWithSeasons } = await gql<{ usersWithSeasons: UserWithSeasons[] }>(LIST);

  return usersWithSeasons;
};

export const useGetUsersWithSeasons = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: listUsersWithSeasons,
  });
};
