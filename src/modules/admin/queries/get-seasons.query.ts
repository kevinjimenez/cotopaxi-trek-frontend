import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import type { SeasonResponse } from "../types/api/response/season-response.type";
import { seasonKeys } from "./keys/season.query-key";
import type { Season } from "../types/season.type";

const GET_SEASONS_QUERY = `
  query ($params: QueryParamsDto) {
      seasonsWithMountains(params: $params) {
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

export const getSeasons = async (status?: boolean): Promise<Season[]> => {
  const { seasonsWithMountains } = await gql<{
    seasonsWithMountains: SeasonResponse[];
  }>(GET_SEASONS_QUERY, { params: { status } });

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

export const useGetSeasons = (status?: Ref<boolean | undefined>) => {
  return useQuery({
    queryKey: [...seasonKeys.all({ status: status?.value })],
    queryFn: () => getSeasons(status?.value),
  });
};
