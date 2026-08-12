<script setup lang="ts">
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { ref, watch } from 'vue';

const latitude = defineModel<number | null>('latitude', { default: null });
const longitude = defineModel<number | null>('longitude', { default: null });

const DEFAULT_CENTER: [number, number] = [-0.1807, -78.4678]; // Quito

const marker = ref<[number, number]>(
  latitude.value && longitude.value ? [latitude.value, longitude.value] : DEFAULT_CENTER,
);

watch(
  () => [latitude.value, longitude.value],
  ([lat, lng]) => {
    if (lat && lng) marker.value = [lat, lng];
  },
);

const onMapClick = (event: LeafletMouseEvent) => {
  const { lat, lng } = event.latlng;
  marker.value = [lat, lng];
  latitude.value = lat;
  longitude.value = lng;
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
