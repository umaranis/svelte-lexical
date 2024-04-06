import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';

export default defineConfig(({mode}) => ({
  plugins: [sveltekit()],
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
  },
}));
