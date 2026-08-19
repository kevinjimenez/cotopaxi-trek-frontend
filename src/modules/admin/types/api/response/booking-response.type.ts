import type { SeasonMountainResponse } from "./season-mountain-response.type";

export interface BookingResponse {
  id: string;
  userId?: string;
  seasonMountainId?: number;
  createdBy?: string;
  status: boolean;
  bookedAt: Date;
  seasonMountain: SeasonMountainResponse;
}
