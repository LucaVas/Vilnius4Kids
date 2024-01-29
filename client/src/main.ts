import './assets/style.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import * as Sentry from '@sentry/vue';

const app = createApp(App);

Sentry.init({
  dsn: 'https://a0a95d40f868ce67be7611bedbbeface@o4506653934485504.ingest.sentry.io/4506653981605888',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

app.use(createPinia());
app.use(router);

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD-DXYdf6sQGFv2ctn2GTK5K92Ld3W-_Ws',
    autobindAllEvents: true,
  },
});

app.mount('#app');
