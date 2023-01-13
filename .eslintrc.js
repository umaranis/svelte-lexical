module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "prettier" // Make sure to put it last, so it gets the chance to override other configs (https://github.com/prettier/eslint-config-prettier).
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser', // add the TypeScript parser
  plugins: [
    'import',
    'svelte3',
    '@typescript-eslint', // add the TypeScript plugin
  ],
  // Stop ESLint from looking for a configuration file in parent folders
  root: true,
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
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
      {'ts-ignore': 'allow-with-description'},
    ],
    '@typescript-eslint/no-unused-vars': ['error', {args: 'none'}],
  },
  settings: {
    //'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
    // OR
    'svelte3/typescript': true, // load TypeScript as peer dependency
    // ...
  }
};
