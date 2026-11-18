import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Hide and Close',
    description:
      'Hide a marketplace item directly or remove all sold items from a page',
    permissions: ['activeTab', 'scripting'],
    action: {
      default_title: 'Hide and Close',
    },
  },
});
