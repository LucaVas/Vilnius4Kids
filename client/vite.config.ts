import { sentryVitePlugin } from '@sentry/vite-plugin';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), sentryVitePlugin({
    org: 'vilnius4kids',
    project: 'vilnius4kids_client',
  }), sentryVitePlugin({
    org: "vilnius4kids-rb",
    project: "vilnius4kids_client"
  }), sentryVitePlugin({
    org: "vilnius4kids-rb",
    project: "vilnius4kids_client"
  })],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  optimizeDeps: {
    include: ['@fawmi/vue-google-maps', 'fast-deep-equal'],
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['@server/utils/validation'],
    },
  },
});