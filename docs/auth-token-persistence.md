# Guía: persistir sesión (token + user) tras el login

Objetivo: que el `accessToken` y el `user` sobrevivan a un refresh de página,
sin sacrificar velocidad de carga ni mostrar datos desactualizados (rol,
status) por mucho tiempo si cambian en el backend.

Estrategia: **cache-then-revalidate**. El `user` se cachea en cookie para
pintar la UI al instante, y en paralelo se revalida contra el backend
(`me` query) para corregir cualquier dato desactualizado apenas responde.

> Ya existe en el proyecto: `cookie.utils.ts` (persistencia del token),
> `jwt.utils.ts` (decodificar el JWT para `role`/`companyId`/`sub`) y
> `auth.store.ts` con `accessToken`. Esta guía agrega el `user` completo
> encima de eso.

## 1. Cookie para el `user`

En `src/shared/utils/cookie.utils.ts`, agregar la key:

```ts
export const USER_COOKIE = "auth_user";
```

## 2. Ampliar `auth.store.ts`

Agregar estado `user`, inicializado parseando la cookie:

```ts
import type { UserResponse } from "@/modules/admin/types/api/response/user-response.type";
import { ACCESS_TOKEN_COOKIE, USER_COOKIE, getCookie, removeCookie, setCookie } from "../utils/cookie.utils";

// dentro de defineStore("auth", () => { ... })

const user = ref<UserResponse | null>(
  (() => {
    const raw = getCookie(USER_COOKIE);
    return raw ? JSON.parse(raw) : null;
  })(),
);

const setUser = (u: UserResponse) => {
  user.value = u;
  setCookie(USER_COOKIE, JSON.stringify(u));
};

const clearUser = () => {
  user.value = null;
  removeCookie(USER_COOKIE);
};
```

Llamar `clearUser()` también dentro de `clearAccessToken()`, para que el
logout limpie token y user juntos.

No olvidar agregar `user`, `setUser`, `clearUser` al `return { ... }` del
store.

## 3. `LoginResponse` con `user`

`src/modules/admin/types/api/response/login-response.type.ts`:

```ts
import type { UserResponse } from "./user-response.type";

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}
```

Y en el `LOGIN_MUTATION` de `login.mutation.ts`, pedir el `user` en el
selection set (`id`, `name`, `lastname`, `username`, `role`, `status`, etc.).

## 4. Guardar el `user` al loguear

`src/modules/admin/mutations/login.mutation.ts`:

```ts
export const useLogin = () => {
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      authStore.setAccessToken(res.accessToken);
      authStore.setUser(res.user);
    },
  });
};
```

## 5. Query `me` (revalidación)

Backend — `src/auth/auth.resolver.ts` hoy devuelve solo el `id` como
string, hay que hacer que devuelva el `User` completo:

```ts
@UseGuards(GqlAuthGuard)
@Query(() => User, { name: 'me' })
me(@CurrentUser('id') id: string) {
  return this.usersService.findById(id); // ajustar al método real del service
}
```

Frontend — nuevo archivo `src/modules/admin/queries/me.query.ts`:

```ts
import { gql } from "@/shared/services/graphql";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import type { UserResponse } from "../types/api/response/user-response.type";

const ME_QUERY = `
  query {
    me {
      id
      name
      lastname
      username
      role
      status
    }
  }
`;

const getMe = async () => {
  const { me } = await gql<{ me: UserResponse }>(ME_QUERY);
  return me;
};

export const useMe = () => {
  const authStore = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: computed(() => authStore.isAuthenticated),
    initialData: () => authStore.user ?? undefined,
    staleTime: 0, // siempre revalida al montar, aunque haya initialData
  });
};
```

`initialData` pinta la UI de inmediato con lo que ya había en la cookie
(cero espera). `staleTime: 0` hace que vue-query igual dispare la request
`me` en background para traer datos frescos.

## 6. Bootstrap en `App.vue`

```ts
import { watch } from "vue";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useMe } from "@/modules/admin/queries/me.query";

const authStore = useAuthStore();
const { data: me } = useMe();

watch(me, (freshUser) => {
  if (freshUser) authStore.setUser(freshUser); // pisa store + cookie con lo fresco
});
```

## Por qué esto y no otra cosa

- **Solo cookie (sin `me`)**: cero requests extra, pero si cambian el
  `role`/`status` de alguien en el backend, ese cambio no se refleja en su
  sesión hasta el próximo login manual.
- **Solo `me` query (sin cookie)**: siempre fresco, pero cada refresh
  muestra un loading state hasta que responde el backend.
- **Híbrido (esta guía)**: pinta instantáneo con la cookie y corrige solo
  si algo cambió, sin loading visible en el caso normal.
- El riesgo de la cookie desactualizada es **cosmético, no de seguridad**:
  `JwtStrategy.validate()` en el backend ya re-consulta el usuario en la
  BD y revisa `status` en cada request autenticado, así que un usuario
  desactivado no puede ejecutar mutations/queries reales aunque su cookie
  local todavía diga que está activo.

## Checklist de implementación

- [ ] `USER_COOKIE` en `cookie.utils.ts`
- [ ] `user`, `setUser`, `clearUser` en `auth.store.ts` (+ limpiar en logout)
- [ ] `LoginResponse.user` + `user { ... }` en `LOGIN_MUTATION`
- [ ] `onSuccess` de `useLogin` llama `authStore.setUser(res.user)`
- [ ] Backend: `me` resolver devuelve `User` completo, no solo el id
- [ ] `me.query.ts` con `initialData` + `staleTime: 0`
- [ ] Bootstrap en `App.vue` (o donde se monte el layout autenticado) que
      llama `useMe()` y sincroniza el resultado al store
