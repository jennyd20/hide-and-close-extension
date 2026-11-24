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
    // Optional: Required when publishing or testing persistent features in Firefox
    browser_specific_settings: {
      gecko: {
        id: '14525577+jennyd20@users.noreply.github.com',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
});
