import type { SeasonResponse } from "./season-response.type";

export interface UserSeasonResponse {
  id: number;
  userId?: string;
  seasonId?: number;
  enrolled: boolean;
  season: SeasonResponse;
}
