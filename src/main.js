/**
 * @Author Jenny Ross
 *
 * Entry point for the Hide and Close chrome extension. Execute the main logic
 * when extension is clicked.
 *
 * TODO(@Jenny): add keyboard shortcut capability
 **/

import { executeTarget, getTarget, getUrl } from './hide-and-close.js';

/** @param {chrome.tabs.Tab} tab */
async function handleExtensionActivation(tab) {
  console.log('HideAndClose extension clicked on tab:', tab.id);
  await executeTarget(getTarget(getUrl()));
}

// The listener fires when the extension toolbar icon is clicked
chrome.action.onClicked.addListener(handleExtensionActivation);

//console.log('Script loaded!');
