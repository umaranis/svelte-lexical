/** @type { import("eslint").Linter.Config } */
module.exports = {
  // Stop ESLint from looking for a configuration file in parent folders
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    "prettier" // Make sure to put it last, so it gets the chance to override other configs (https://github.com/prettier/eslint-config-prettier).
  ],
  parser: '@typescript-eslint/parser', // add the TypeScript parser
  plugins: ['@typescript-eslint'], // add the TypeScript plugin
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        'no-return-assign': 'off',
        'import/no-mutable-exports': 'off',
        'import/first': 'off',
        'import/prefer-default-export': 'off',
        'quotes': 'off'
      },
    },
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-nocheck': 'allow-with-description',
        'ts-ignore': 'allow-with-description'
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-console': 'error',
    'no-debugger': 'error',
  }
};
