import {svelteTesting} from '@testing-library/svelte/vite';
import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: ['chrome88', 'edge88', 'firefox78', 'safari14'],
    cssTarget: ['chrome88', 'edge88', 'firefox78', 'safari14.1'],
  },

  test: {
    workspace: [
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],

        test: {
          name: 'client',
          environment: 'jsdom',
          clearMocks: true,
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
      {
        extends: './vite.config.ts',

        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
});
