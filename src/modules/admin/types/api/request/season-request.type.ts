export interface SeasonRequest {
  companyId: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent?: boolean;
  mountains?: SeasonMountainRequest[];
}

export interface SeasonMountainRequest {
  mountainId?: number;
  sortOrder: number;
  startDate: Date;
  endDate?: Date;
  price: number;
}
