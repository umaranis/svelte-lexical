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
  plugins: ['import', 'svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-return-assign': 'off',
        'import/no-mutable-exports': 'off',
        'import/first': 'off',
        'import/prefer-default-export': 'off',
      },
    },
  ],
  rules: {
  },
};
