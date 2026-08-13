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
  season: BookingSeasonResponse;
  mountain: Mountain;
}

export interface BookingSeasonResponse {
  id: number;
  name: string;
  year: number;
  isCurrent: boolean;
}
