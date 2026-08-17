import type { Mountain } from "./mountain.type";

export interface Season {
  id: number;
  companyId: string;
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  mountains: Mountain[];
}
