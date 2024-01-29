import './assets/style.css';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import * as Sentry from '@sentry/vue';

const app = createApp(App);

Sentry.init({
  app,
  dsn: 'https://a0a95d40f868ce67be7611bedbbeface@o4506653934485504.ingest.sentry.io/4506653981605888',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    Sentry.replayIntegration(),
  ],

  // (defaults to true) - Includes all Vue components' props with the events.
  attachProps: true,
  // (defaults to true) - Decides whether SDK should call Vue's original logError function as well.
  logErrors: true,
  // (defaults to false) - Track your app's components. Learn more about component tracking and all its options.
  trackComponents: false,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
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
