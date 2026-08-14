import type { BookingResponse } from './booking-response.type';
import type { SeasonResponse } from './season-response.type';

export interface UserResponse {
  id: string;
  name: string;
  lastname: string;
  username: string;
  phone: string;
  status: boolean;
  userSeasons: UserSeason[];
  bookings: BookingResponse[];
}

export interface UserSeason {
  id: number;
  status: boolean;
  season: SeasonResponse;
}
