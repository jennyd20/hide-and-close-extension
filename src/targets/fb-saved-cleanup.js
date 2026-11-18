/*
TODO(@Jenny)

Also, window.location.href navigation won't work in a service worker — needs chrome.tabs.update. 

One remaining architectural concern: chrome.tabs.update() changes the tab's URL, causing a full page reload. The await scrollToBottom() and document.querySelectorAll(...) on the lines after will run in the service worker context, where document is undefined. This logic needs to live in a content script injected into the navigated page — not the service worker. This is a deeper architectural issue to solve when this feature is fully implemented.
*/

import { hideItem, scrollToBottom } from '../utils/utils.js';

/******************************************************************
 ** IF AT THE FACEBOOK "SAVED ITEMS" PAGE, BULK REMOVE SOLD ITEMS *
 ******************************************************************/
export async function fbSavedItemsHideAll() {
  console.log('START - fbSavedItemsHideAll');

  // Hardcoded CSS class for saved items. This is brittle and may break if Facebook changes their markup.
  const savedItemsClass = 'x1yztbdb';
  const moreLabel = 'More options for saved item';
  const menuLabel = 'More options';
  const hideLabel = 'Unsave';

  // Go specifically to the "Products" subpage of saved items
  await chrome.tabs.update({
    url: 'https://www.facebook.com/saved/?dashboard_section=PRODUCTS',
  });

  // Load all saved items (lazy loading)
  await scrollToBottom();

  // Check item status and hide items that have been sold.
  const items = document.querySelectorAll('[class="' + savedItemsClass + '"]');
  for (const i of items) {
    console.log('Checking item: ', i);
    const spans = i.querySelectorAll('span');
    const sold = [...spans].find(
      (el) =>
        el.textContent.startsWith('Product • $') &&
        el.textContent.endsWith(' • Sold'),
    );
    console.log({ sold });
    if (sold) {
      await hideItem(moreLabel, menuLabel, hideLabel, i);
    }
  }
  console.log('END - fbSavedItemsHideAll');
}
