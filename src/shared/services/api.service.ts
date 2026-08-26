import { env } from "@/config/env";
import axios from "axios";
import { ADMIN_COOKIE_KEYS } from "../constants/cookie.constants";
import { getCookie } from "../utils/cookie.utils";

const apiService = axios.create({
  baseURL: env.apiUrl,
});

apiService.interceptors.request.use((config) => {
  const accessToken = getCookie(ADMIN_COOKIE_KEYS.ACCESS_TOKEN);
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(`[${status}] ${message}`));
  },
);

export { apiService };
