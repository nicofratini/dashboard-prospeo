// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    rules: {
      'no-console': 'off', // allow console.log in TypeScript files
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
