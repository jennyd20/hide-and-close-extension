export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.id) {
      return;
    }

    // Inject our content script on action click
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['/content-scripts/content.js'],
    });
  });
});
