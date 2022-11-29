module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
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
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-return-assign': 'off',
        'import/no-mutable-exports': 'off',
        'import/first': 'off',
        'import/prefer-default-export': 'off',
        'object-curly-spacing': 'off',
        'quotes': 'off'
      },
    },
  ],
  rules: {
  },
  settings: {
    //'svelte3/typescript': () => require('typescript'), // pass the TypeScript package to the Svelte plugin
    // OR
    'svelte3/typescript': true, // load TypeScript as peer dependency
    // ...
  }
};
