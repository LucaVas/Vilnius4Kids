import './assets/style.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD-DXYdf6sQGFv2ctn2GTK5K92Ld3W-_Ws',
    autobindAllEvents: true,
  },
});

app.mount('#app');
