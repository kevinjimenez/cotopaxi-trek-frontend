import Cookies from "js-cookie";

export const ACCESS_TOKEN_COOKIE = "access_token";

export const setCookie = (name: string, value: string, days = 7) => {
  Cookies.set(name, value, { expires: days, sameSite: "Lax", path: "/" });
};

export const getCookie = (name: string): string | undefined => Cookies.get(name);

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};
