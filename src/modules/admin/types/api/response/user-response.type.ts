import type { BookingResponse } from "./booking-response.type";
import type { UserSeasonResponse } from "./user-season-response.type";

export interface UserResponse {
  id: string;
  companyId?: string;
  name: string;
  lastname: string;
  username?: string;
  email?: string;
  phone?: string;
  role: "customer" | "admin" | "superadmin";
  status: boolean;
  userSeasons: UserSeasonResponse[];
  bookings: BookingResponse[];
}
