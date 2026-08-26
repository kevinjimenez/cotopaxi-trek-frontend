import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ADMIN_COOKIE_KEYS } from "../constants/cookie.constants";
import { STORE_KEY } from "../constants/store.constants";
import { getCookie, removeCookie, setCookie } from "../utils/cookie.utils";
import { decodeToken, isTokenExpired } from "../utils/jwt.utils";

export const useAuthStore = defineStore(STORE_KEY.AUTH, () => {
  const cookieAccessToken = getCookie(ADMIN_COOKIE_KEYS.ACCESS_TOKEN) ?? null;
  const accessToken = ref<string | null>(cookieAccessToken);

  const payload = computed(() => (accessToken.value ? decodeToken(accessToken.value) : null));

  const isAuthenticated = computed(() => !!payload.value && !isTokenExpired(payload.value));

  const role = computed(() => payload.value?.role ?? null);
  const companyId = computed(() => payload.value?.companyId ?? null);
  const userId = computed(() => payload.value?.sub ?? null);

  const setAccessToken = (token: string) => {
    accessToken.value = token;
    setCookie(ADMIN_COOKIE_KEYS.ACCESS_TOKEN, token);
  };

  const clearAccessToken = () => {
    accessToken.value = null;
    removeCookie(ADMIN_COOKIE_KEYS.ACCESS_TOKEN);
  };

  return {
    accessToken,
    payload,
    isAuthenticated,
    role,
    companyId,
    userId,
    setAccessToken,
    clearAccessToken,
  };
});
