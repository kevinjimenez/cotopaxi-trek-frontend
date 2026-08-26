export interface JwtPayload {
  sub: string;
  role: "customer" | "admin" | "superadmin";
  companyId: string | null;
  iat: number;
  exp: number;
}
