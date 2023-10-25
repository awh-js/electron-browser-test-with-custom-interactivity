import { fileURLToPath, URL } from 'url';
import Path from 'path';
import vuePlugin from '@vitejs/plugin-vue';

const { defineConfig } = require('vite');

const config = defineConfig({
  root: __dirname,
  server: {
    port: 8081,
  },
  optimizeDeps: {
    exclude: ['oh-vue-icons/icons'],
  },
  open: false,
  build: {
    outDir: Path.join(process.cwd(), 'build', 'browser'),
    emptyOutDir: true,
  },
  plugins: [vuePlugin()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('../', import.meta.url)) },
    ],
  },
});

// TODO: remove when not necessary
// Workaround for 504 vue error in development
if (process.env.NODE_ENV === 'development') {
  config.optimizeDeps.exclude.push('vue');
}

export default config;
