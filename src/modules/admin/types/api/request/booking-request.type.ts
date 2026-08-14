export interface BookingRequest {
  userId?: string;
  seasonMountainId: number;
  createdBy?: string;
  status?: boolean;
  bookedAt?: Date;
}
