import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import autoImports from './.wxt/eslint-auto-imports.mjs';

export default defineConfig([
  autoImports,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    rules: {
      quotes: ['warn', 'single', { avoidEscape: true }],
      curly: ['error', 'all'],
    },
  },
]);
