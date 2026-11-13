import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});

/////////////////////////////////////////
// export default defineConfig({
//   test: {
//     browser: {
//       enabled: true,
//       name: "chromium",
//       provider: "playwright",
//     },
//   },
// });

//////////////////////////////////////////
// Generated at some point for vitest.workspace.js
// import { defineWorkspace } from 'vitest/config';

// export default defineWorkspace([
//   // Fast, headless DOM environment for unit/logic tests
//   {
//     extends: 'vitest.config.ts', // Inherits your base configs (plugins, aliases, etc.)
//     test: {
//       name: 'unit-jsdom',
//       environment: 'jsdom',
//       include: ['src/**/*.spec.ts', 'src/**/*.jsdom.test.ts'],
//     },
//   },

//   // Real browser environment for visual layout, scrolling, and interaction tests
//   {
//     extends: 'vitest.config.ts',
//     test: {
//       name: 'browser',
//       include: ['src/**/*.browser.test.tsx', 'src/**/*.browser.test.ts'],
//       browser: {
//         enabled: true,
//         name: 'chromium', // Options: 'chromium', 'firefox', 'webkit'
//         provider: 'playwright',
//         // headless: true, // Set to false during debugging to watch the browser pop up
//       },
//     },
//   },
// ]);
