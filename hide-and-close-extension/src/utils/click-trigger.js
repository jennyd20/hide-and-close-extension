export async function triggerClickAndWait(el, selector) {
  try {
    el.click();
    console.log("Button clicked, waiting for target");
    return await waitForElement(selector);
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Helper function that returns a Promise which resolves when an element appears.
 * @param {string} selector - The CSS selector to watch for.
 * @param {number} timeout - Maximum time to wait in milliseconds (default 5000ms).
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Check if the element already exists immediately
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect(); // Stop observing to save memory
        clearTimeout(timeoutId);
        resolve(element);
      }
    });

    // Start observing the whole document body for added child nodes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Prevent infinite waiting by setting a timeout rejection
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(
          `Timeout: Element "${selector}" did not appear within ${timeout}ms`,
        ),
      );
    }, timeout);
  });
}
