import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { MountainResponse } from "../types/api/response/mountain-response.type";
import { mountainKeys } from "./keys/mountain.query-key";

interface Params {
  status?: boolean;
}

const GET_MOUNTAINS_QUERY = `
query ($params: MountainParamsDto) {
  mountains(params: $params) {
    id
    name
    location
    altitudeMeters
    status
    }
}`;

export const getMountains = async (params: Params) => {
  const { mountains } = await gql<{ mountains: MountainResponse[] }>(GET_MOUNTAINS_QUERY, {
    params,
  });

  return mountains;
};

export const useGetMountains = (params: Params = {}) => {
  return useQuery({
    queryKey: mountainKeys.all,
    queryFn: () => getMountains(params),
  });
};
