import { executeTarget, getTarget, getUrl } from './hide-and-close.js';

// This listener fires when the extension toolbar icon is clicked
chrome.action.onClicked.addListener((tab) => {
  console.log('HideAndClose extension clicked on tab:', tab.id);
  executeTarget(getTarget(getUrl()));
});

console.log('Script loaded!');
