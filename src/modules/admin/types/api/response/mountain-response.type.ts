export interface MountainResponse {
  id: string;
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
