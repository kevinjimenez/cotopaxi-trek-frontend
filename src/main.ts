import "leaflet/dist/leaflet.css";
import "vue-sonner/style.css";
import "./assets/main.css";
import "./shared/lib/leaflet-icon-fix.ts";

import { createPinia } from "pinia";
import { createApp } from "vue";

import { VueQueryPlugin } from "@tanstack/vue-query";
import "dayjs/locale/es";
import App from "./App.vue";
import "./config/env";
import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto por defecto, overrideable por query
        retry: 3,
      },
    },
  },
});

app.mount("#app");
