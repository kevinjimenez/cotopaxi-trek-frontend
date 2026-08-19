import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { SeasonResponse } from "../types/api/response/season-response.type";
import type { Season } from "../types/season.type";
import { seasonKeys } from "./keys/season.query-key";

interface Params {
  id?: number;
  status?: boolean;
}

const GET_SEASON_QUERY = `
  query ($params: SeasonParamsDto) {
      season(params: $params) {
          id
          name
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
                  # altitudeMeters
              }
          }
      }
  }
  `;

export const getSeason = async (params: Params): Promise<Season> => {
  const { season } = await gql<{
    season: SeasonResponse;
  }>(GET_SEASON_QUERY, { params });

  const { seasonMountains, ...rest } = season;

  if (seasonMountains.length !== 0) {
    const mountains = seasonMountains.map((seasonMountain) => {
      const { mountain, id, ...rest } = seasonMountain;
      return { ...rest, seasonMountainId: id, id: mountain.id, name: mountain.name };
    });
    return { ...rest, mountains };
  }

  return { ...rest, mountains: [] };
};

export const useGetSeason = (params: Params = {}) => {
  return useQuery({
    queryKey: [...seasonKeys.one({ status: params.status })],
    queryFn: () => getSeason({ status: params.status }),
  });
};
