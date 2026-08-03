# cotopaxi-trek-frontend

Esta plantilla te ayuda a empezar a desarrollar con Vue 3 en Vite.

## Librerías de UI utilizadas

- [Tailwind CSS v4](https://tailwindcss.com/) — utilidades CSS.
- [shadcn-vue](https://www.shadcn-vue.com/) — componentes base (Button, etc.), generados dentro del proyecto en `src/shadcn`.
- [Reka UI](https://reka-ui.com/) — primitivos headless (accesibilidad, foco, teclado) sobre los que se construye shadcn-vue.
- [Lucide](https://lucide.dev/) (`@lucide/vue`) — librería de íconos.
- [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — utilidades de animación para Tailwind.

## Estructura de componentes: `src/shadcn` vs `src/shared`

```
src/
  shadcn/                    ← generado/gestionado por el CLI de shadcn-vue
    ui/                      ← primitivos individuales (registry:ui), ej. Button
      button/
        Button.vue
        index.ts
    components/              ← bloques/composiciones completas (registry:component) que el CLI pueda generar
    utils.ts                 ← cn() (clsx + tailwind-merge)
    lib/                     ← helpers (registry:lib) que algún componente del registry pueda generar
    composables/             ← composables (registry:hook) que algún componente del registry pueda generar (ej. useToast)
  shared/
    ui/
      BaseButton.vue         ← componentes propios del proyecto
```

Los alias `ui`, `components`, `utils`, `lib` y `composables` de `components.json` apuntan **todos** dentro de `src/shadcn/`. Cada uno corresponde a una categoría distinta de lo que el registry de shadcn-vue puede generar (primitivo, bloque, helper, composable), no a "lo que tú creas" — así cualquier `npx shadcn-vue add` futuro cae en el lugar correcto automáticamente, sin mezclarse con código propio.

**Por qué separarlos:** `src/shadcn` es territorio del CLI (`npx shadcn-vue add <componente>`). Si algún día se vuelve a correr ese comando para actualizar un componente, el CLI **sobrescribe el archivo completo** — cualquier cambio manual ahí se pierde. Por eso:

- **No se edita nada dentro de `src/shadcn` a mano.** Es el primitivo "en crudo" tal como lo genera shadcn-vue/Reka UI.
- Los componentes propios del proyecto (con reglas de negocio, props restringidas, íconos, estados de `loading`, etc.) van en `src/shared/ui/`, como wrappers que consumen los primitivos de `src/shadcn/ui` por dentro. Ejemplo: `BaseButton.vue` envuelve `shadcn/ui/button` agregando `label`, `loading`, `prefixIcon`/`suffixIcon`.

**Buena práctica al crear un wrapper (`Base*`):**
- Definir las props explícitas que se permiten (no usar `v-bind="$attrs"` abierto) — así el componente controla qué se puede configurar desde afuera en vez de exponer toda la API del primitivo.
- Reusar los tipos del primitivo (`ButtonVariants['variant']`, etc.) en vez de redefinir uniones de strings a mano, para que se mantengan sincronizados si el primitivo cambia.
- Declarar `class` como prop tipada (`HTMLAttributes['class']`) y mezclarla con `cn()` en vez de dejar que Tailwind pise clases por defecto sin resolver conflictos.

## Configuración recomendada del editor

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y deshabilitar Vetur).

### Snippets de Vue

Si usas [Zed](https://zed.dev/), instala la extensión [Vue snippets](https://zed.dev/extensions/vue-snippets) ([repo](https://github.com/rubjo/zed-vue-snippets)) para tener snippets de Vue 3 (Composition API, `<script setup>`, Vue Router, etc.). Algunos de los más útiles:

- `vbase` → SFC base con `<script setup>` + TypeScript
- `vdefineprops`, `vdefineemits`, `vdefinemodel` → macros de `<script setup>`
- `vref`, `vref-typed`, `vreactive`, `vcomputed` → estado reactivo
- `vonmounted`, `vonupdated`, `vonunmounted` → lifecycle hooks
- `vfor`, `vmodel`, `von`, `vslot-named` → directivas y slots de template
- `vrlink`, `vrlink-param` → Vue Router

## Configuración recomendada del navegador

- Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Soporte de tipos para imports de `.vue` en TS

TypeScript no puede manejar la información de tipos de los imports `.vue` por defecto, por eso reemplazamos el CLI `tsc` por `vue-tsc` para el type-checking. En el editor necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje de TypeScript entienda los tipos de `.vue`.

## Personalizar configuración

Ver [Vite Configuration Reference](https://vite.dev/config/).

## Configuración del proyecto

```sh
bun install
```

### Compilar y recargar en caliente para desarrollo

```sh
bun dev
```

### Verificar tipos, compilar y minificar para producción

```sh
bun run build
```

### Correr pruebas unitarias con [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

### Lint con [ESLint](https://eslint.org/)

```sh
bun lint
```
