import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/jwt.type";

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (payload: JwtPayload): boolean => {
  return payload.exp * 1000 <= Date.now();
};
