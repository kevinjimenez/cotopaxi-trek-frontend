import { gql } from '@/shared/services/graphql';
import { useQuery } from '@tanstack/vue-query';
import type { UserResponse } from '../types/api/response/user-response.type';
import { userKeys } from './keys/user.query-key';

const GET_USERS_QUERY = `
  query {
      usersWithSeasons {
          id
          name
          lastname
          username
          phone
          status
          userSeasons {
              id
              status
              season {
                  id
                  name
                  year
                  isCurrent
                  seasonMountains {
                      id
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
          bookings {
              id
              status
              bookedAt
              seasonMountain {
                  id
                  sortOrder
                  price
                  startDate
                  endDate
                  season {
                      id
                      name
                      year
                      isCurrent
                  }
                  mountain {
                      id
                      name
                  }
              }
          }
      }
  }
`;

export const getUsers = async () => {
  const { usersWithSeasons } = await gql<{ usersWithSeasons: UserResponse[] }>(GET_USERS_QUERY);

  return usersWithSeasons;
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });
};
