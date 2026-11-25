export default defineBackground(() => {
  // Works in both MV3 (browser.action) and MV2 (browser.browserAction)
  const actionApi = browser.action ?? browser.browserAction;

  actionApi?.onClicked.addListener(async (tab) => {
    if (tab.id == null) {
      return;
    }

    // Inject our content script on action click
    return browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['/content-scripts/content.js'],
    });
  });

  // Handle messages from content scripts
  browser.runtime.onMessage.addListener((message, sender) => {
    console.log('Background message received:', message);
    const tabId = sender.tab?.id;

    if (message.type === 'NAVIGATE_TAB' && tabId != null) {
      return browser.tabs.update(tabId, {
        url: message.url,
      });
    }

    if (message?.type === 'CLOSE_CURRENT_TAB' &&  && tabId != null) {
      return browser.tabs.remove(tabId);
    }
  });
});
