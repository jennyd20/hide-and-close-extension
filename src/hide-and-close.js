import { getTargetHandler } from './utils/target-utils.js';

// Execute the extension on the current page, if a handler is defined for the current URL.
export async function runHideAndClose() {
  const currentUrl = window.location.href;
  const handler = getTargetHandler(currentUrl);
  if (handler) {
    return await handler();
  }
  console.warn(`No handler implemented for "${currentUrl}"`);
  return null;
}
