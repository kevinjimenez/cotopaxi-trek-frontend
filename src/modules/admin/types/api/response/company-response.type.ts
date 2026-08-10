export interface CompanyResponse {
  id: string;
  name: string;
  whatsapp: string;
  instagram: string | null;
  status: boolean;
  logoUrl: string | null;
  slug: string;
  primaryColor: string | null;
}
