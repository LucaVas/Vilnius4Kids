import './assets/style.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { googleMapsApiKey } from './config';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueGoogleMaps, {
  load: {
    key: googleMapsApiKey,
    autobindAllEvents: true,
  },
});

app.mount('#app');
