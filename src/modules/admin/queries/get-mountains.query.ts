import { gql } from "@/shared/services/graphql";
import { useQuery } from "@tanstack/vue-query";
import type { MountainResponse } from "../types/api/response/mountain-response.type";
import { mountainKeys } from "./keys/mountain.query-key";

const GET_MOUNTAINS_QUERY = `
query {
  mountains {
    id
    name
    location
    altitudeMeters
    status
    }
}`;

export const getMountains = async () => {
  const { mountains } = await gql<{ mountains: MountainResponse[] }>(GET_MOUNTAINS_QUERY);

  return mountains;
};

export const useGetMountains = () => {
  return useQuery({
    queryKey: mountainKeys.all,
    queryFn: getMountains,
  });
};
