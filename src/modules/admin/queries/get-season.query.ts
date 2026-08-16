import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import type { SeasonResponse } from "../types/api/response/season-response.type";
import { seasonKeys } from "./keys/season.query-key";

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

export const getSeason = async ({ status }: { id?: number; status?: boolean }) => {
  const { season } = await gql<{
    season: SeasonResponse;
  }>(GET_SEASON_QUERY, { params: { status } });

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

export const useGetSeason = (status?: Ref<boolean | undefined>) => {
  return useQuery({
    queryKey: [...seasonKeys.one({ status: status?.value })],
    queryFn: () => getSeason({ status: status?.value }),
  });
};
