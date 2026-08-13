import type { Mountain } from '../../mountain.type';

export interface BookingResponse {
  id: string;
  status: boolean;
  bookedAt: Date;
  seasonMountain: BookingSeasonMountainResponse;
}

export interface BookingSeasonMountainResponse {
  id: number;
  sortOrder: number;
  price: number;
  startDate: Date;
  endDate?: Date;
  mountain: Mountain;
}
