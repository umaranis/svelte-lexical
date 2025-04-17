import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import {includeIgnoreFile} from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import {fileURLToPath} from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-nocheck': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error', {args: 'none'}],
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'error',
      'no-debugger': 'error',
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },

    rules: {
      'no-return-assign': 'off',
      'import/no-mutable-exports': 'off',
      'import/first': 'off',
      'import/prefer-default-export': 'off',
      quotes: 'off',
    },
  },
);
