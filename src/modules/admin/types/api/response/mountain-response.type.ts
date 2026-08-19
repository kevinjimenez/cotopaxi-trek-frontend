export interface MountainResponse {
  id: number;
  name: string;
  location: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
  generalDescription?: string;
  technicalDescription?: string;
  altitudeMeters: string;
  status: boolean;
  imageUrl?: string;
  // company?: Company;
  // seasonMountains?: SeasonMountain[];
}
