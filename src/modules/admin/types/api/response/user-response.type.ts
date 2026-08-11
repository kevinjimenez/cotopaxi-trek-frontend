import type { SeasonResponse } from './season-response.type';

export interface UserResponse {
  id: string;
  name: string;
  lastname: string;
  username: string;
  phone: string;
  userSeasons: UserSeason[];
}

export interface UserSeason {
  id: number;
  status: boolean;
  season: SeasonResponse;
}
