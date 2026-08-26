# Guía: proteger rutas por autenticación y rol

Objetivo: que `/admin/company` solo la vea `superadmin` (ni `admin` ni
usuarios sin loguear), mientras que `/admin/season`, `/admin/mountain` y
`/admin/user` las vean ambos roles autenticados.

> Esto es protección de **UI/UX**, no de seguridad real. La seguridad real
> va en el backend (guards en los resolvers de GraphQL) — ver la sección
> "Nota de seguridad" al final. Sin eso, cualquiera puede llamar la
> mutation/query directo aunque el frontend bloquee la ruta.

Hay dos formas de aplicar el guard en Vue Router 4: **individual** por
ruta (`beforeEnter`) o **global** (`beforeEach`). Abajo están las dos.

## 0. Base común: `role` en el store

Ambos enfoques usan lo que ya existe en `src/shared/stores/auth.store.ts`:
`authStore.isAuthenticated` y `authStore.role` (derivado del JWT vía
`jwt.utils.ts`).

## 1. Enfoque individual (`beforeEnter`)

Cada ruta define su propia función de guard. No hace falta `meta.roles` ni
`meta.requiresAuth` — la lógica vive directo en cada entrada de ruta.

`src/modules/admin/routes/index.ts`:

```ts
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/shared/stores/auth.store";
import AdminLayout from "../layouts/AdminLayout.vue";

export const adminRoutes: RouteRecordRaw = {
  path: "/admin",
  name: "admin",
  redirect: { name: "user" },
  component: AdminLayout,
  children: [
    {
      path: "company",
      name: "company",
      component: () => import("@/modules/admin/views/CompanyView.vue"),
      meta: { title: "Empresa" },
      beforeEnter: () => {
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) return { name: "login" };
        if (authStore.role !== "superadmin") return { name: "user" };
      },
    },
    {
      path: "season",
      name: "season",
      component: () => import("@/modules/admin/views/SeasonView.vue"),
      meta: { title: "Temporadas" },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
    {
      path: "mountain",
      name: "mountain",
      component: () => import("@/modules/admin/views/MountainView.vue"),
      meta: { title: "Montañas" },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
    {
      path: "user",
      name: "user",
      component: () => import("@/modules/admin/views/UserView.vue"),
      meta: { title: "Usuarios" },
      beforeEnter: () => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) return { name: "login" };
      },
    },
  ],
};
```

En Vue Router 4 el guard no usa el callback `next()` de la v3: `return`
sin nada (`undefined`) deja pasar, `return { name: "..." }` redirige ahí.

**Ventaja**: se entiende leyendo una sola ruta, sin saltar a otro archivo.
**Desventaja**: el chequeo de `isAuthenticated` se repite en 4 rutas — si
mañana cambia la lógica (ej. agregar un log), hay que tocar las 4.

## 2. Enfoque global (`beforeEach`)

Un solo guard registrado una vez, que lee `meta` de cada ruta para saber
qué exigir. Requiere volver a `meta.requiresAuth` / `meta.roles`.

`src/modules/admin/routes/index.ts` (rutas más simples, todo vía meta):

```ts
{
  path: "company",
  name: "company",
  component: () => import("@/modules/admin/views/CompanyView.vue"),
  meta: { title: "Empresa", requiresAuth: true, roles: ["superadmin"] },
},
{
  path: "season",
  name: "season",
  component: () => import("@/modules/admin/views/SeasonView.vue"),
  meta: { title: "Temporadas", requiresAuth: true },
},
// mountain y user: igual que season, requiresAuth: true, sin roles
```

Tipar `meta` para que TS no se queje de `roles`/`requiresAuth` (arriba de
`src/router/index.ts`):

```ts
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[];
  }
}
```

El guard global, en el mismo archivo, después de crear el `router`:

```ts
import { useAuthStore } from "@/shared/stores/auth.store";

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.role ?? "")) {
    return { name: "user" }; // o una vista 403
  }
});
```

**Ventaja**: una sola función, un solo lugar para cambiar la lógica; las
rutas quedan como datos declarativos (`meta`), sin código repetido.
**Desventaja**: para entender qué hace una ruta hay que mirar dos
archivos (la ruta + el guard global).

## 3. Ocultar el link en el nav (aplica a ambos enfoques)

El guard evita entrar por URL directa, pero el botón "Empresas" seguiría
visible para `admin` si no se oculta. En
`src/modules/admin/layouts/AdminLayout.vue`:

```ts
import { useAuthStore } from "@/shared/stores/auth.store";
const authStore = useAuthStore();
```

```vue
<BaseButton
  v-if="authStore.role === 'superadmin'"
  :class="navLinkClass('company')"
  label="Empresas"
  variant="link"
  @click="() => goTo('company')"
/>
```

## Nota de seguridad (backend)

El resolver `src/companies/resolvers/companies.resolver.ts` hoy no tiene
ningún guard — ni `GqlAuthGuard` ni chequeo de rol. Cualquiera puede
llamar `createCompany`/`companies` directo contra el endpoint GraphQL,
sin pasar por el frontend. Ya existe la infraestructura para esto
(`RoleProtected` decorator + `UserRoleGuard`, usados como comentario en
`src/users/resolvers/users.resolver.ts`) pero falta aplicarla:

```ts
import { UseGuards } from '@nestjs/common';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { RoleType } from 'src/databases/generated/prisma/client';

@RoleProtected(RoleType.superadmin)
@UseGuards(GqlAuthGuard, UserRoleGuard)
@Mutation(() => Company)
createCompany(...) { ... }
```

Sin esto, la protección de rutas de este documento es solo cosmética.
