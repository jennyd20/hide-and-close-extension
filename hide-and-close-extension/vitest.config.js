import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      // Exclude test, main, and barrel files
      exclude: ['src/**/*.test.js', 'src/**/index.js', 'src/main.js'],
    },
  },
});
