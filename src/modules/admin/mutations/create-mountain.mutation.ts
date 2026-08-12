import { gql } from '@/shared/services/graphql';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { mountainKeys } from '../queries/keys/mountain.query-key';
import type { MountainRequest } from '../types/api/request/mountain-request.type';
import type { MountainResponse } from '../types/api/response/mountain-response.type';

const CREATE_MOUNTAIN_MUTATION = `
  mutation CreateMountain($input: CreateMountainInput!) {
    createMountain(createMountainInput: $input) {
      id
      name
      location
      altitudeMeters
      status
    }
  }
`;

const createMountain = async (input: MountainRequest) => {
  const { createMountain } = await gql<{ createMountain: MountainResponse }>(
    CREATE_MOUNTAIN_MUTATION,
    {
      input,
    },
  );
  return createMountain;
};

export const useCreateMountain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMountain,
    onSuccess: async (newMountain) => {
      queryClient.setQueryData<MountainResponse[]>(mountainKeys.all, (old) =>
        old ? [...old, newMountain] : [newMountain],
      );
      // queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};
