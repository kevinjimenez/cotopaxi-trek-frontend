export interface MountainRequest {
  companyId: string;
  name: string;
  altitudeMeters: number;
  location: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  generalDescription?: string;
  technicalDescription?: string;
  status?: boolean;
  imageUrl?: string;
}
