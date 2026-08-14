# cotopaxi-trek-frontend

Esta plantilla te ayuda a empezar a desarrollar con Vue 3 en Vite.

## Librerías de UI utilizadas

- [Tailwind CSS v4](https://tailwindcss.com/) — utilidades CSS.
- [shadcn-vue](https://www.shadcn-vue.com/) — componentes base (Button, etc.), generados dentro del proyecto en `src/shadcn`.
- [Reka UI](https://reka-ui.com/) — primitivos headless (accesibilidad, foco, teclado) sobre los que se construye shadcn-vue.
- [Lucide](https://lucide.dev/) (`@lucide/vue`) — librería de íconos.
- [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — utilidades de animación para Tailwind.

**Avatares:** se usa [DiceBear](https://www.dicebear.com/) como placeholder, ej. `https://api.dicebear.com/10.x/avataaars-neutral/svg?seed=<valor>` (el `seed` determina el avatar generado).

## Librerías de datos

- [Axios](https://axios-http.com/) — cliente HTTP para consumir la API del backend.
- [TanStack Query](https://tanstack.com/query) (`@tanstack/vue-query`) — manejo de estado del servidor: cache, refetch, loading/error states sobre las llamadas a la API.
- [Pinia](https://pinia.vuejs.org/) — estado global del lado del cliente.
- [VueUse](https://vueuse.org/) (`@vueuse/core`) — composables utilitarios; lo usan varios primitivos de `src/shadcn` internamente (`useVModel`, etc.).

## Formularios y validación

- [vee-validate](https://vee-validate.logaretm.com/) — manejo de formularios: estado de campos, errores, `handleSubmit`, arrays de campos (`useFieldArray`).
- [Zod](https://zod.dev/) + [`@vee-validate/zod`](https://vee-validate.logaretm.com/v4/integrations/zod-schema-validation/) — esquemas de validación (`z.object`, `z.coerce`) que se conectan al formulario vía `toTypedSchema`.

### Convenciones de formularios en este proyecto

**Un schema Zod por formulario, en `src/modules/admin/schemas/*.schema.ts`:**

```ts
export const seasonFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  year: z.coerce.number().int(),
  startDate: z.coerce.date(),
});

export type SeasonFormSchema = z.infer<typeof seasonFormSchema>;
```

`z.infer<typeof schema>` genera el tipo TS del formulario a partir del schema — no se escribe una `interface` aparte a mano, así siempre están sincronizados.

**Por qué `z.coerce`:** los inputs HTML siempre entregan `string`, aunque el campo represente un número o una fecha. `z.coerce.number()`/`z.coerce.date()` convierten el valor antes de validar (`Number(valor)` / `new Date(valor)`), en vez de rechazarlo por no ser del tipo exacto. Se usa en cualquier campo numérico o de fecha del formulario.

**`useForm` + `toTypedSchema` + `defineField`:**

```ts
const { handleSubmit, defineField, errors, resetForm } = useForm<SeasonFormSchema>({
  validationSchema: toTypedSchema(seasonFormSchema),
  initialValues: { name: '', year: '' as unknown as number /* ... */ },
});

const [name, nameAttrs] = defineField('name');
```

`defineField('campo')` devuelve `[ref, attrs]`: el `ref` va en `v-model` y `attrs` (que trae `onBlur` y el tracking de "tocado" de vee-validate) va en `v-bind`. Los errores de cada campo se leen directo del objeto `errors` (`errors.name`, sin `.value` en el template).

**Truco `'' as unknown as number` / `undefined as unknown as Date` en `initialValues`:** un campo requerido por el schema (ej. `year: z.coerce.number()`) no puede arrancar en `undefined` sin romper el tipo. Este cast deja el campo vacío en pantalla (buena UX: no aparece un `0` ni una fecha por defecto) sin pelearse con TypeScript, sabiendo que Zod lo va a validar igual al enviar.

**Puente `string` ↔ `number` en inputs numéricos:** los componentes `Base*` (ej. `BaseInput`) solo hablan `string` en su `v-model` (son inputs de HTML). Cuando el campo del schema es `number`, se usa un `computed({ get, set })` como intermediario:

```ts
const priceInput = computed({
  get: () => price.value?.toString() ?? '',
  set: (value) => { price.value = Number(value); },
});
```

y el `v-model` del input apunta al `computed`, no al `ref` del `defineField` directamente. Mismo patrón para `Date` ↔ `DateValue` en `BaseDatePicker.vue` (ver `src/shared/components/ui/BaseDatePicker.vue`).

**Arrays de campos con `useFieldArray`:** para listas dinámicas dentro de un formulario (ej. las montañas de una temporada), en vez de un `ref()` suelto desconectado del form:

```ts
const { fields, push, remove, move } = useFieldArray<SeasonMountainFormSchema>('mountains');
```

`fields` es de solo lectura (no se le puede hacer `v-model` directo, ej. a una lista de drag-and-drop) — para reordenar se usa `move(oldIndex, newIndex)`, no reasignar el array. A diferencia de `defineField`, `useFieldArray` no da un `attrs` con tracking de "tocado" por fila — si hace falta (para no mostrar errores de validación antes de que el usuario toque un campo recién agregado), hay que armarlo a mano (ver `touchedMountainRows` en `SeasonView.vue`).

## Fechas

- [dayjs](https://day.js.org/) — formateo/manipulación de fechas en la UI (`formatDate`, `fromNow`, etc.), con locale `es` cargado en `src/shared/utils/date.utils.ts`.
- [`@internationalized/date`](https://react-spectrum.adobe.com/internationalized/date/index.html) — tipo `DateValue`/`CalendarDate` que usa el calendario de Reka UI internamente; `BaseDatePicker.vue` puentea entre este tipo y `Date` nativo de JS.

## Otras utilidades

- [maska](https://beholdr.github.io/maska/) (`v-maska`) — máscaras de input (teléfono con prefijo fijo, formato numérico con separador de miles/decimales).
- [vue-sonner](https://vue-sonner.robertsoriano.com/) — notificaciones toast (éxito/error tras crear registros).
- [vue-draggable-plus](https://vue-draggable-plus.pages.dev/) — drag and drop para reordenar listas (ej. orden de ascenso de montañas en una temporada).
- [Leaflet](https://leafletjs.com/) + [`@vue-leaflet/vue-leaflet`](https://github.com/vue-leaflet/vue-leaflet) — mapa interactivo para elegir ubicación (`MapPicker.vue`), con geocoding vía Nominatim.

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

**Reemplazar el ícono de un primitivo sin editarlo:** varios primitivos de `src/shadcn` (ej. `AccordionTrigger`) exponen un slot con nombre `icon` con un ícono por defecto. Para cambiarlo, se sobreescribe el slot desde el consumidor en vez de tocar el archivo del primitivo:

```vue
<AccordionTrigger class="[&[data-state=open]>svg]:rotate-90">
  <template #icon>
    <ChevronRight class="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
  </template>
  ...
</AccordionTrigger>
```

Dos cosas a tener en cuenta:
- El ícono por defecto (`ChevronDown`) gira 180° al abrir (`[&[data-state=open]>svg]:rotate-180`, definido en el `class` base del primitivo). Si tu ícono de reemplazo espera otra rotación (ej. `ChevronRight` → `v` con solo 90°), hay que pasar esa misma clase con el ángulo nuevo por `class` en el consumidor — `cn()`/tailwind-merge la resuelve porque comparten el mismo prefijo de variante (`[&[data-state=open]>svg]:`), así que la del consumidor gana sobre la del primitivo.
- El ícono que pongas en el slot sigue siendo hijo directo del trigger (por eso el selector `>svg` de arriba lo sigue alcanzando), así que no hace falta duplicar `transition-transform`/`size-4` salvo que quieras un tamaño distinto.

**El patrón `as-child` (Reka UI):** varios primitivos (`DialogTrigger`, `VisuallyHidden`, etc.) por defecto renderizan su propio elemento envolviendo lo que le pongas adentro. Ejemplo sin `as-child`:

```vue
<DialogTrigger>
  <BaseButton label="Nueva montaña" />
</DialogTrigger>
```

Esto genera `<button><button>...</button></button>` en el DOM — HTML inválido (botón dentro de botón). Con `as-child`:

```vue
<DialogTrigger as-child>
  <BaseButton label="Nueva montaña" />
</DialogTrigger>
```

`DialogTrigger` deja de crear su propio elemento y en su lugar le fusiona su comportamiento (listeners de click, atributos ARIA como `aria-haspopup`/`aria-expanded`) directo al único hijo (`BaseButton`). Resultado: un solo `<button>` en el DOM, con el comportamiento del trigger encima. Regla general: **`as-child` = "aplica tus estilos/comportamiento al hijo, no agregues un elemento nuevo"**.

Requisito para que funcione: el hijo debe ser un componente de **un solo nodo raíz** que reenvíe attrs/listeners al DOM (Vue lo hace automático en componentes single-root, como ya pasa con `BaseButton`) — si el hijo tiene varios nodos raíz o no reenvía attrs, `as-child` no tiene a quién fusionarle el comportamiento y falla.

**Subcomponentes de `Dialog` (`src/shadcn/ui/dialog`) — cuándo usar cada uno:**

- **`DialogTrigger`** — el elemento que abre el modal. Úsalo cuando quieres que Reka UI maneje el estado de apertura internamente (con `as-child` envolviendo tu botón), en vez de controlar un `ref<boolean>` a mano como hace `BaseModal.vue` actualmente.
- **`DialogHeader`** — `<div>` de layout (`flex flex-col gap-2`, centrado en mobile / izquierda en desktop) para agrupar `DialogTitle` + `DialogDescription` como bloque.
- **`DialogFooter`** — mismo concepto pero para los botones de acción abajo (`Cancelar`/`Guardar`): los apila en columna invertida en mobile y los alinea a la derecha en fila en desktop. Tiene una prop `showCloseButton` que, si la activas, agrega automático un botón "Close" (usa `DialogClose` por dentro) sin que tengas que escribirlo.
- **`DialogClose`** — cualquier elemento que cierra el modal al hacer click, sin manejar el estado manualmente (no hace falta `@click="open = false"`). Se usa con `as-child` fusionado a tu propio botón, igual que `DialogTrigger`.
- **`DialogOverlay`** — el fondo oscuro semi-transparente detrás del modal. Normalmente **no se usa directo**: `DialogContent` ya lo incluye internamente. Solo se toca si armas una variante custom del contenido desde cero.
- **`DialogScrollContent`** — alternativa a `DialogContent` para modales con contenido **largo** que necesita scroll propio (`overflow-y-auto` + `my-8` para no cortarse contra los bordes en pantallas chicas); además ya trae la X de cerrar integrada en la esquina. Úsalo en vez de `DialogContent` para formularios largos.

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
