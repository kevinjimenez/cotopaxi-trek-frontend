import type { SeasonMountainResponse } from './season-mountain-response.type';

export interface SeasonResponse {
  id: number;
  companyId: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  seasonMountains: SeasonMountainResponse[];
}
