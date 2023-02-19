import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      yjs: path.resolve('./node_modules/yjs/src/index.js'),
    },
  },
});
