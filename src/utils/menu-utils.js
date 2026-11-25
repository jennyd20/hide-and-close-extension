import { triggerClickAsync } from './dom-utils.js';

export async function hideItem(moreLabel, menuLabel, hideLabel, i = document) {
  console.log('START - hideItem');
  // TODO(@Jenny) These are under the following node:
  // data-interactable="|click||input||keydown||keyup||change|"
  // is this too broad? Lots of those exist
  console.log(`Inputs: "${moreLabel}", "${menuLabel}", "${hideLabel}"`);

  try {
    // Find the button for additional options
    const moreOptions = i.querySelector(getSelector('button', moreLabel));
    if (!moreOptions) {
      throw new Error(`Button "${moreLabel}" not found`);
    }

    // Click the more options menu
    const moreMenu = await triggerClickAsync(
      moreOptions,
      getSelector('menu', menuLabel),
    );

    // Get items in the new menu
    const menuOptions = moreMenu.querySelectorAll('[role="menuitem"]');
    console.log(`Menu options: ${getAllLabels(menuOptions)}`);

    // Find the correct hide button
    const hideOption = [...menuOptions].find((el) =>
      el.textContent.trim().startsWith(hideLabel),
    );
    if (!hideOption) {
      throw new Error(`Hide option "${hideLabel}" not found in menu`);
    }

    console.log(`Clicking hide option: ${getLabel(hideOption)}`);
    hideOption.click();
    console.log('END - hideItem (success)');
    return true;
  } catch (e) {
    // Something failed
    console.error(e.message);
  }
  console.log('END - hideItem (failure)');
  return false;
}

function getAllLabels(elementList) {
  return Array.from(elementList)
    .map((el) => {
      return getLabel(el);
    })
    .join(', ');
}

function getLabel(el) {
  return el.getAttribute('aria-label') || el.textContent.trim();
}

function getSelector(role, label) {
  return '[role="' + role + '"][aria-label="' + label + '"]';
}
