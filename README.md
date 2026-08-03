# cotopaxi-trek-frontend

Esta plantilla te ayuda a empezar a desarrollar con Vue 3 en Vite.

## Librerías de UI utilizadas

- [Tailwind CSS v4](https://tailwindcss.com/) — utilidades CSS.
- [shadcn-vue](https://www.shadcn-vue.com/) — componentes base (Button, etc.), generados dentro del proyecto en `src/components/ui`.
- [Reka UI](https://reka-ui.com/) — primitivos headless (accesibilidad, foco, teclado) sobre los que se construye shadcn-vue.
- [Lucide](https://lucide.dev/) (`@lucide/vue`) — librería de íconos.
- [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — utilidades de animación para Tailwind.

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
