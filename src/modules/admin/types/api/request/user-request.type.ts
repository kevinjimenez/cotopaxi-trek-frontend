import type { BookingRequest } from "./booking-request.type";

export interface UserRequest {
  companyId: string;
  seasonId: number;
  name: string;
  lastname: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: "customer" | "admin" | "superadmin";
  status?: boolean;
  password: string;
  bookings: BookingRequest[];
}
