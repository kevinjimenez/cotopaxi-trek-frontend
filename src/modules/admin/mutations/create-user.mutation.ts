import { gql } from '@/shared/services/graphql';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { userKeys } from '../queries/keys/user.query-key';
import type { UserRequest } from '../types/api/request/user-request.type';
import type { UserResponse } from '../types/api/response/user-response.type';

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
      name
      lastname
      username
      phone
      userSeasons {
        id
        status
        season {
          id
          name
        }
      }
    }
  }
`;

const createUser = async (input: UserRequest) => {
  const { createUser } = await gql<{ createUser: UserResponse }>(CREATE_USER_MUTATION, {
    input,
  });
  return createUser;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (newUser) => {
      queryClient.setQueryData<UserResponse[]>(userKeys.all, (old) =>
        old ? [...old, newUser] : [newUser],
      );
    },
  });
};
