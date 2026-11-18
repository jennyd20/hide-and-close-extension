import { triggerClickAsync } from './dom-utils.js';

export async function hideItem(moreLabel, menuLabel, hideLabel, i = document) {
  console.log('START - hideItem');
  // TODO(@Jenny) These are under the following node:
  // data-interactable="|click||input||keydown||keyup||change|"
  // is this too broad? Lots of those exist
  console.log({ moreLabel }, { menuLabel }, { hideLabel });

  try {
    // Click the button for additional options
    const moreOptions = i.querySelector(
      '[role="button"][aria-label="' + moreLabel + '"]',
    );
    if (!moreOptions) {
      throw new Error(`Button "${moreLabel}" not found`);
    }

    const moreMenu = await triggerClickAsync(
      moreOptions,
      '[role="menu"][aria-label="' + menuLabel + '"]',
    );

    // Get items in the new menu
    const menuOptions = moreMenu.querySelectorAll('[role="menuitem"]');
    console.log(`Menu options: ${menuOptions}`);

    // Find the correct hide button
    const hideOption = [...menuOptions].find((el) =>
      el.textContent.trim().startsWith(hideLabel),
    );
    if (!hideOption) {
      throw new Error(`Hide option "${hideLabel}" not found in menu`);
    }

    console.log({ hideOption });
    hideOption.click();
    console.log('END - hideItem (success)');
    return true;
  } catch (e) {
    // Something failed
    console.error(e.message);
    console.log('END - hideItem (failure)');
    return false;
  }
}
