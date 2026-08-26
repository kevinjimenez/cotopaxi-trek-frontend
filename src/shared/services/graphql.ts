import { apiService } from "./api.service";

interface GqlResponse<T> {
  data: T | null;
  errors?: { message: string }[];
}

export const gql = async <T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> => {
  const { data: body } = await apiService.post<GqlResponse<T>>("/graphql", {
    query,
    variables,
  });

  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join(" | "));

  return body.data as T;
};
