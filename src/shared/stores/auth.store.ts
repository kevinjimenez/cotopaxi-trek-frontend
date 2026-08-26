import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ACCESS_TOKEN_COOKIE, getCookie, removeCookie, setCookie } from "../utils/cookie.utils";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string | null>(getCookie(ACCESS_TOKEN_COOKIE) ?? null);

  const isAuthenticated = computed(() => !!accessToken.value);

  const setAccessToken = (token: string) => {
    accessToken.value = token;
    setCookie(ACCESS_TOKEN_COOKIE, token);
  };

  const clearAccessToken = () => {
    accessToken.value = null;
    removeCookie(ACCESS_TOKEN_COOKIE);
  };

  return { accessToken, isAuthenticated, setAccessToken, clearAccessToken };
});
