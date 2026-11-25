export async function backOrClose() {
  console.log('Attempting to go back or close tab...');

  if (history.length > 1) {
    console.log(`History entries: ${history.length}. Going back.`);
    history.back();
    return;
  }

  console.log('No prior history. Closing tab.');
  try {
    await browser.runtime.sendMessage({
      type: 'CLOSE_CURRENT_TAB',
    });
  } catch (error) {
    console.warn('Failed to close tab:', error);
  }
}
