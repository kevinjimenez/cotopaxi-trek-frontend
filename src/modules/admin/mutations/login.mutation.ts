import { gql } from "@/shared/services/graphql";
import { useMutation } from "@tanstack/vue-query";
import type { LoginRequest } from "../types/api/request/login-request.type";
import type { LoginResponse } from "../types/api/response/login-response.type";

const LOGIN_MUTATION = `
  mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
    user {
      id
      name
      lastname
      username
      role
    }
  }
}
`;

const login = async (loginInput: LoginRequest) => {
  const { login } = await gql<{ login: LoginResponse }>(LOGIN_MUTATION, {
    loginInput,
  });
  return login;
};

export const useLogin = () => {
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      console.log({ res });
      // queryClient.setQueryData<UserResponse[]>(userKeys.all, (old) =>
      //   old ? [...old, newUser] : [newUser],
      // );
      // await queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
