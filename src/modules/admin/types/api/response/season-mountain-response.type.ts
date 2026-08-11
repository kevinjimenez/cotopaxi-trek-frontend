import type { Mountain } from '../../mountain.type';

export interface SeasonMountainResponse {
  id: number;
  sortOrder: number;
  startDate: Date;
  endDate: Date;
  price: number;
  mountain: Mountain;
}
