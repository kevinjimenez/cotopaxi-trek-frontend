import type { MountainResponse } from "./mountain-response.type";

export interface SeasonMountainResponse {
  id: number;
  seasonId?: number;
  mountainId?: number;
  sortOrder: number;
  startDate: Date;
  endDate?: Date;
  price: number;
  mountain: MountainResponse;
}
