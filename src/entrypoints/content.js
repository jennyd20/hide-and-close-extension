import { runHideAndClose } from '@/hide-and-close.js';

export default defineContentScript({
  matches: [
    '*://*.facebook.com/*',
    // Additional targets later:
    // ''*://*.nextdoor.com/*',
    // ''*://*.offerup.com/*',
  ],
  registration: 'runtime', // Allows on-demand injection via background script
  async main() {
    console.log(
      'HideAndClose content script running on:',
      window.location.href,
    );
    await runHideAndClose();
  },
});
