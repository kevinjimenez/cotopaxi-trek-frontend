import { gql } from '@/shared/services/graphql';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { SeasonRequest } from '../types/api/request/season-request.type';
import type { SeasonResponse } from '../types/api/response/season-response.type';

const CREATE_SEASONUSER_MUTATION = `
  mutation CreateSeason($input: CreateSeasonInput!) {
    createSeason(createSeasonInput: $input) {
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

`;

const createSeason = async (input: SeasonRequest) => {
  const { createSeason } = await gql<{ createSeason: SeasonResponse }>(CREATE_SEASONUSER_MUTATION, {
    input,
  });
  return createSeason;
};

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeason,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seasons'] });
    },
  });
};
