import { runHideAndClose } from '@/hide-and-close.js';

export default defineContentScript({
  matches: ['https://www.facebook.com/*'],
  registration: 'runtime', // Allows on-demand injection via background script
  async main() {
    console.log(
      'HideAndClose content script running on:',
      window.location.href,
    );
    await runHideAndClose();
  },
});
