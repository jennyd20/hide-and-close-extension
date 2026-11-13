/* Author: Jenny Ross
Initial bookmarklet attempt to include a separate context for removing sold
items from the FB saved page. Requires scrolling to the bottom to get all
dynamically loaded content.

This attempt was ABANDONED in favor of writing a browser extension
*/

/*** REMOVE THIS AND BOTTOM BLOCK COMMENT TO CREATE BOOKMARKLET ***/
/* 
const bookmarklet = `
javascript:(
*/

function startHiding() {
  console.log("Starting");
  const currentUrl = window.location.href;
  console.lsdfog({ currentUrl });

  // Check for various platforms
  const fbMarketplaceItemUrl = "https://www.facebook.com/marketplace/item/";
  const fbSavedItemsUrl = "https://www.facebook.com/saved";

  if (currentUrl.startsWith(fbMarketplaceItemUrl)) {
    fbIndividualItemHide();
  } else if (currentUrl.startsWith(fbSavedItemsUrl)) {
    fbSavedItemsHideAll();
  } else {
    throw new Error("Access denied: Not a supported page");
  }
}

/**********************************************
 * IF LOOKING AT AN INDIVIDUAL FACEBOOK ITEM, *
 * HIDE IT AND THEN RETURN TO MARKETPLACE     *
 **********************************************/
function fbIndividualItemHide() {
  console.log("START - fbIndividualItemHide");
  const moreLabel = "More Item Options";
  const menuLabel = "Additional options for this Marketplace listing";
  const hideLabel = "Hide listing";

  const success = hideItem(moreLabel, menuLabel, hideLabel);
  console.losdfg({ success });

  // Close the tab or go back to the prior page
  if (success) {
    console.log("Attempting to close tab or return to prior page...");
    if (history.length > 1) {
      history.back();
    } else {
      window.close();
    }
  }
  console.log("END - fbIndividualItemHide");
}

/******************************************************************
 ** IF AT THE FACEBOOK "SAVED ITEMS" PAGE, BULK REMOVE SOLD ITEMS *
 ******************************************************************/
function fbSavedItemsHideAll() {
  console.log("START - fbSavedItemsHideAll");
  const savedItemsClass = "x1yztbdb";
  const moreLabel = "More options for saved item";
  const menuLabel = "More options";
  const hideLabel = "Unsave";

  // Go specifically to the "Products" subpage of saved items
  window.location.href =
    "https://www.facebook.com/saved/?dashboard_section=PRODUCTS";

  // Load all saved items (lazy loading)
  scrollToBottom();

  // Check item status and hide items that have been sold.
  const items = document.querySelectorAll('[class="' + savedItemsClass + '"]');
  for (const i of items) {
    console.log("Checking item: ", i);
    const spans = i.querySelectorAll("span");
    const sold = [...spans].find(
      (el) =>
        el.textContent.startsWith("Product • $") &&
        el.textContent.endsWith(" • Sold"),
    );
    console.log({ sold });
    if (sold) {
      hideItem(moreLabel, menuLabel, hideLabel, i);
    }
  }
  console.log("END - fbSavedItemsHideAll");
}

/*** HELPER FUNCTIONS ***/
function hideItem(moreLabel, menuLabel, hideLabel, i = document) {
  console.log("START - hideItem");
  // @J These are under the following node:
  //data-interactable="|click||input||keydown||keyup||change|"
  // too broad? Lots of those exist
  console.log({ moreLabel }, { menuLabel }, { hideLabel });

  try {
    // Click the button for additional options
    const moreOptions = i.querySelector(
      '[role="button"][aria-label="' + moreLabel + '"]',
    );
    console.log({ moreOptions });
    clickElement(moreOptions);

    // Find the new menu
    const moreMenu = document.querySelector(
      '[role="menu"][aria-label="' + menuLabel + '"]',
    );
    console.log({ moreMenu });

    // Get items in the new menu
    const menuOptions = moreMenu.querySelectorAll('[role="menuitem"]');
    console.log({ menuOptions });

    // Find the correct hide button
    const hideOption = [...menuOptions].find((el) =>
      el.textContent.trim().startsWith(hideLabel),
    );
    console.log({ hideOption });

    // Activate
    clickElement(hideOption);
    console.log("END - hideItem (success)");
    return true;
  } catch (e) {
    // Something failed
    console.error(e);
    console.log("END - hideItem (failure)");
    return false;
  }
}

async function scrollToBottom() {
  console.log("START - scrollToBottom");
  let lastHeight = document.body.scrollHeight;

  while (true) {
    // Scroll to the current bottom
    window.scrollTo(0, document.body.scrollHeight);

    // Wait for new dynamic content to load (adjust timeout if needed)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if the height changed
    let newHeight = document.body.scrollHeight;
    if (newHeight === lastHeight) {
      break; // Stop if no new content loaded
    }
    lastHeight = newHeight;
  }
  console.log("Reached the bottom!");
  console.log("END - scrollToBottom");
}

// Try to click the element - if it doesn't work the first time, try again.
async function clickElement(el) {
  console.log("START - clickElement");
  console.log({ el });
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  console.log("sleep(200)");
  await sleep(200);
  try {
    console.log("First click attempt...");
    el.click();
  } catch {
    await sleep(500);
    console.log("Second click attempt...");
    el.click();
  }

  console.log("Clicked, sleep(200)");
  await sleep(200);
  console.log("END - clickElement");
}

// Idea: Ensure all dom content was loaded before attempting to hide
// Untested draft code
function initApp() {
  console.log("DOM fully loaded. Starting app...");
  startHiding();
}

// Automatically runs as soon as the browser HTML is ready
document.addEventListener("DOMContentLoaded", initApp);

console.log("Script loaded!");

/*** REMOVE BLOCK COMMENT TO CREATE BOOKMARKLET ***/
/*
)();
`

// Convert all line breaks to newlines, compress whitespace, clean up the edges.
// Make the code a single link to paste into a bookmark.

// @Jenny The first .replace is probably redundant with the 2nd .replace
// statement
function bookmarkletFormat() {
    return bookmarklet.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

console.log(bookmarkletFormat())
*/
