import { env } from "@/config/env";
import Cookies from "js-cookie";
const COOKIE_PATH = "/";
const COOKIE_SITE = "Lax";

export const setCookie = (name: string, value: string, days = env.cookieExpiresDays) => {
  Cookies.set(name, value, {
    expires: days,
    sameSite: COOKIE_SITE,
    path: COOKIE_PATH,
    secure: env.nodeEnv !== "local",
  });
};

export const getCookie = (name: string): string | undefined => Cookies.get(name);

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: COOKIE_PATH });
};
