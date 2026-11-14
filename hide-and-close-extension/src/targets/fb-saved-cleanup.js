import { hideItem, scrollToBottom } from '../utils/index.js';

/******************************************************************
 ** IF AT THE FACEBOOK "SAVED ITEMS" PAGE, BULK REMOVE SOLD ITEMS *
 ******************************************************************/
export function fbSavedItemsHideAll() {
  console.log('START - fbSavedItemsHideAll');
  const savedItemsClass = 'x1yztbdb';
  const moreLabel = 'More options for saved item';
  const menuLabel = 'More options';
  const hideLabel = 'Unsave';

  // Go specifically to the "Products" subpage of saved items
  window.location.href =
    'https://www.facebook.com/saved/?dashboard_section=PRODUCTS';

  // Load all saved items (lazy loading)
  scrollToBottom();

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
      hideItem(moreLabel, menuLabel, hideLabel, i);
    }
  }
  console.log('END - fbSavedItemsHideAll');
}
