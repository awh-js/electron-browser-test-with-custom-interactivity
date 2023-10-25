const Path = require('path');
const { defineConfig } = require('vite');

const vuePlugin = require('@vitejs/plugin-vue');
const cssInjectedByJsPlugin = require('vite-plugin-css-injected-by-js').default;
/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: __dirname,
  server: {
    port: 8080,
  },
  open: false,
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  optimizeDeps: {
    exclude: ['oh-vue-icons/icons'],
  },
  build: {
    outDir: Path.join(process.cwd(), 'build', 'overlay'),
    emptyOutDir: true,
    lib: {
      entry: Path.join(__dirname, 'main.ts'),
      name: 'OverlayApplication',
      fileName: 'overlay-application',
    },
    rollupOptions: {
      // BUILD: make sure to externalize deps that shouldn't be bundled
      // into your library
      // external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vuePlugin(),
    cssInjectedByJsPlugin(),

    // workaround to add absolute paths for assets
    // when dynamically adding renderer script
    {
      name: 'asset-fixer',
      enforce: 'pre',
      apply: 'serve',
      transform: (code, id) => {
        return {
          code: code.replace(/\/(.*)\.(svg|jp?g|png|webp)/,
            'http://localhost:8080/$1.$2'),
          map: null,
        }
      },
    },

  ],
});

module.exports = config;
