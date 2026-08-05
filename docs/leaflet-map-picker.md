# Guía: mapa con Leaflet + OpenStreetMap para capturar `latitude`/`longitude`

Objetivo: al crear/editar una montaña, mostrar un mapa donde el usuario hace click
(o arrastra un marker) y obtenemos `latitude`/`longitude` para mandarlos a la
mutation `createMountain` del backend (campos `Float` opcionales, ver
`CreateMountainInput` en el backend).

No requiere API key ni billing — usa los tiles públicos de OpenStreetMap.

## 1. Instalación

```sh
bun add leaflet @vue-leaflet/vue-leaflet
bun add -D @types/leaflet
```

- `leaflet` — la librería del mapa.
- `@vue-leaflet/vue-leaflet` — wrapper de componentes Vue 3 (`LMap`, `LTileLayer`, `LMarker`).
- `@types/leaflet` — tipos para TS (Leaflet no trae los suyos).

## 2. CSS de Leaflet

Leaflet necesita su hoja de estilos propia (controla el layout de los tiles, zoom
controls, etc.) — sin ella el mapa se ve roto/desalineado. Impórtala una sola vez
en `src/main.ts`:

```ts
// src/main.ts
import 'leaflet/dist/leaflet.css';
```

## 3. Fix del ícono del marker (issue conocido de Leaflet + bundlers)

Leaflet resuelve las imágenes de su marker por defecto con rutas relativas que
Vite no sabe procesar — el marker sale invisible/roto si no se arregla. Crea un
archivo de setup:

```ts
// src/shared/lib/leaflet-icon-fix.ts
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

E impórtalo también en `main.ts`, antes de montar la app:

```ts
// src/main.ts
import './shared/lib/leaflet-icon-fix';
```

## 4. Componente `MapPicker.vue`

Mapa interactivo: click para poner/mover el marker, emite las coords via
`v-model`. Centro inicial en Quito/Cotopaxi para que arranque cerca de la zona
de trabajo.

```vue
<!-- src/shared/components/ui/MapPicker.vue -->
<script setup lang="ts">
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { ref, watch } from 'vue';

interface Props {
  latitude?: number | null;
  longitude?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  latitude: null,
  longitude: null,
});

const emit = defineEmits<{
  'update:latitude': [value: number];
  'update:longitude': [value: number];
}>();

const DEFAULT_CENTER: [number, number] = [-0.68582, -78.438128]; // Cotopaxi

const marker = ref<[number, number]>(
  props.latitude && props.longitude ? [props.latitude, props.longitude] : DEFAULT_CENTER,
);

watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (lat && lng) marker.value = [lat, lng];
  },
);

const onMapClick = (event: LeafletMouseEvent) => {
  const { lat, lng } = event.latlng;
  marker.value = [lat, lng];
  emit('update:latitude', lat);
  emit('update:longitude', lng);
};
</script>

<template>
  <div class="h-72 w-full overflow-hidden rounded-lg border">
    <LMap :zoom="marker === DEFAULT_CENTER ? 8 : 13" :center="marker" @click="onMapClick">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LMarker :lat-lng="marker" />
    </LMap>
  </div>
</template>
```

**Por qué `v-model` doble (`latitude`/`longitude` por separado)**: son dos campos
independientes en el formulario/DTO del backend, así que se emiten como dos
eventos `update:*` en vez de forzar un objeto `{ lat, lng }` que luego habría
que desestructurar igual.

## 5. Uso en el formulario de "Nueva montaña"

```vue
<script setup lang="ts">
import { ref } from 'vue';
import MapPicker from '@/shared/components/ui/MapPicker.vue';

const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);
</script>

<template>
  <MapPicker v-model:latitude="latitude" v-model:longitude="longitude" />

  <p class="text-xs text-muted-foreground">
    {{ latitude?.toFixed(6) }}, {{ longitude?.toFixed(6) }}
  </p>
</template>
```

## 6. Mutation `createMountain` (GraphQL + vue-query)

Todavía no hay ningún `useMutation` en el proyecto — sigue el mismo patrón de
`gql()` que ya usan las queries (`mountain.action.ts`), pero con `useMutation`
en vez de `useQuery`, e invalida el cache de `mountains` al terminar para que
la lista se refresque sola.

```ts
// src/modules/admin/actions/mountain.action.ts (agregar al final)
import { useMutation, useQueryClient } from '@tanstack/vue-query';

interface CreateMountainInput {
  companyId: string;
  name: string;
  altitudeMeters: number;
  location: string;
  latitude?: number;
  longitude?: number;
}

const CREATE = `
  mutation CreateMountain($input: CreateMountainInput!) {
    createMountain(createMountainInput: $input) {
      id
      name
      latitude
      longitude
    }
  }
`;

export const createMountain = async (input: CreateMountainInput) => {
  const { createMountain } = await gql<{ createMountain: Mountain }>(CREATE, { input });

  return createMountain;
};

export const useCreateMountain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMountain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mountainKeys.all });
    },
  });
};
```

## 7. Guardado end-to-end

```vue
<script setup lang="ts">
import { ref } from 'vue';
import MapPicker from '@/shared/components/ui/MapPicker.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { useCreateMountain } from '../actions/mountain.action';

const name = ref('');
const altitudeMeters = ref<number | null>(null);
const location = ref('');
const latitude = ref<number | null>(null);
const longitude = ref<number | null>(null);

const { mutate: save, isPending } = useCreateMountain();

const onSubmit = () => {
  save({
    companyId: '<company-id>', // del contexto de sesión, no hardcodeado en real
    name: name.value,
    altitudeMeters: altitudeMeters.value!,
    location: location.value,
    latitude: latitude.value ?? undefined,
    longitude: longitude.value ?? undefined,
  });
};
</script>

<template>
  <form class="flex flex-col gap-y-3" @submit.prevent="onSubmit">
    <input v-model="name" placeholder="Nombre" />
    <input v-model.number="altitudeMeters" type="number" placeholder="Altitud (m)" />
    <input v-model="location" placeholder="Ubicación (texto)" />

    <MapPicker v-model:latitude="latitude" v-model:longitude="longitude" />

    <BaseButton type="submit" label="Guardar" :loading="isPending" />
  </form>
</template>
```

## 8. Opcional: autocompletar `location` (texto) desde el click en el mapa

Nominatim (el geocoder de OpenStreetMap, gratis, sin API key) permite
reverse-geocoding: dado lat/lng, te devuelve una dirección legible para
prellenar el campo `location`.

```ts
// src/shared/services/nominatim.service.ts
export const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'es' },
  });
  const data = await response.json();

  return data.display_name as string;
};
```

Úsalo en el `onMapClick` de `MapPicker.vue` (o en el componente padre, emitiendo
un evento adicional) para rellenar `location.value` automáticamente. Ojo:
Nominatim pide **máximo 1 request/segundo** y que pongas un `User-Agent`/
`Referer` identificable si vas a producción — para uso en desarrollo/bajo
volumen no debería haber problema.

## Checklist

- [ ] `bun add leaflet @vue-leaflet/vue-leaflet` + `bun add -D @types/leaflet`
- [ ] Import de `leaflet/dist/leaflet.css` en `main.ts`
- [ ] Fix de íconos (`leaflet-icon-fix.ts`) importado en `main.ts`
- [ ] `MapPicker.vue` con `v-model:latitude`/`v-model:longitude`
- [ ] `useCreateMountain` (mutation) en `mountain.action.ts`
- [ ] Formulario que junta name/altitude/location + MapPicker y llama `save()`
- [ ] (Opcional) reverse geocoding con Nominatim para autocompletar `location`
