export interface CompanyResponse {
  id: string;
  name: string;
  whatsapp: string;
  slug: string;
  instagram?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  status?: boolean | null;
}
