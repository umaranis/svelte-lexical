// @ts-check
import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'svelte-lexical',
      social: {
        github: 'https://github.com/umaranis/svelte-lexical',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {label: 'Getting Started', slug: 'guides/getting-started'},
            {
              label: 'Customizing the editor',
              slug: 'guides/customizing-editor',
            },
            {
              label: 'Add plugins',
              slug: 'guides/add-plugin',
            },
            {
              label: 'Get editor object reference',
              slug: 'guides/get-reference-to-editor',
            },
            {
              label: 'Read Mode / Edit Mode',
              slug: 'guides/read-mode-edit-mode',
            },
            {
              label: 'Clear Editor Content',
              slug: 'guides/clear-editor-content',
            },
            {
              label: 'Customizing the theme',
              slug: 'guides/custom-theme',
            },
            {
              label: 'Import / Export',
              items: [
                {
                  label: 'JSON',
                  slug: 'guides/import-export/json',
                },
                {
                  label: 'HTML',
                  slug: 'guides/import-export/html',
                },
                {
                  label: 'Markdown',
                  slug: 'guides/import-export/markdown',
                },
              ],
            },
            {
              label: 'Plugins',
              items: [
                {
                  label: 'List of Plugins',
                  slug: 'guides/plugins/plugins-list',
                },
                {
                  label: 'Markdown Shortcuts',
                  slug: 'guides/plugins/markdown-shortcuts',
                },
                {
                  label: 'Column Layout',
                  slug: 'guides/plugins/column-layout',
                },
              ],
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {directory: 'reference'},
        },
      ],
    }),
  ],
});
