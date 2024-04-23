import sveltePreprocess from 'svelte-preprocess';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  kit: {
    vite: {
      ssr: {
        noExternal: ['prismjs', 'prism-svelte'],
      },
    },
  },
};
