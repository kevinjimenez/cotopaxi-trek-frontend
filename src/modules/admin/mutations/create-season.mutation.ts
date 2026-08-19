import { gql } from "@/shared/services/graphql";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { SeasonRequest } from "../types/api/request/season-request.type";
import type { SeasonResponse } from "../types/api/response/season-response.type";
import { seasonKeys } from "../queries/keys/season.query-key";

const CREATE_SEASON_MUTATION = `
  mutation CreateSeason($input: CreateSeasonInput!) {
    createSeason(createSeasonInput: $input) {
      id
      companyId
      name
      year
      startDate
      endDate
      isCurrent
    }
  }

`;

const createSeason = async (input: SeasonRequest) => {
  const { createSeason } = await gql<{ createSeason: SeasonResponse }>(CREATE_SEASON_MUTATION, {
    input,
  });
  return createSeason;
};

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    onSuccess: async (newSeason) => {
      console.log({ newSeason });
      // await queryClient.invalidateQueries({ queryKey: ["seasons"] });
      await queryClient.invalidateQueries({ queryKey: seasonKeys.all() });
    },
  });
};
