import { triggerClickAndWait } from './index.js';

export function hideItem(moreLabel, menuLabel, hideLabel, i = document) {
  console.log('START - hideItem');
  // @J These are under the following node:
  //data-interactable="|click||input||keydown||keyup||change|"
  // @J is this too broad? Lots of those exist
  console.log({ moreLabel }, { menuLabel }, { hideLabel });

  try {
    console.log('Getting the more options button');
    // Click the button for additional options
    const moreOptions = i.querySelector(
      '[role="button"][aria-label="' + moreLabel + '"]',
    );
    console.log({ moreOptions });
    console.log('Clicking moreOptions');
    const moreMenu = triggerClickAndWait(
      moreOptions,
      '[role="menu"][aria-label="' + menuLabel + '"]',
    );
    //clickElement(moreOptions);

    // Find the new menu
    // console.log('Getting the moreMenu');
    // const moreMenu = document.querySelector(
    //     '[role="menu"][aria-label="' + menuLabel + '"]'
    // );
    // console.log({ moreMenu });

    // Get items in the new menu
    console.log('Getting the menu options');
    const menuOptions = moreMenu.querySelectorAll('[role="menuitem"]');
    console.log({ menuOptions });

    // Find the correct hide button
    console.log('Finding the hide button');
    const hideOption = [...menuOptions].find((el) =>
      el.textContent.trim().startsWith(hideLabel),
    );
    console.log({ hideOption });

    // Activate
    console.log('Clicking the hide button');
    //clickElement(hideOption);
    hideOption.click();
    console.log('END - hideItem (success)');
    return true;
  } catch (e) {
    // Something failed
    console.error(e);
    console.log('END - hideItem (failure)');
    return false;
  }
}

export async function scrollToBottom() {
  console.log('START - scrollToBottom');
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
  console.log('Reached the bottom!');
  console.log('END - scrollToBottom');
}
