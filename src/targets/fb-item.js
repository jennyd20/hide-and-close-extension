import { hideItem } from '@/utils/menu-utils.js';
import { backOrClose } from '@/utils/nav-utils.js';

/***************************************************************************************
 ** IF LOOKING AT AN INDIVIDUAL FACEBOOK ITEM, HIDE IT AND THEN RETURN TO MARKETPLACE **
 ***************************************************************************************/
export async function fbIndividualItemHide() {
  console.log('START - fbIndividualItemHide');
  const moreLabel = 'More Item Options';
  const menuLabel = 'Additional options for this Marketplace listing';
  const hideLabel = 'Hide listing';

  const success = await hideItem(moreLabel, menuLabel, hideLabel);
  console.log({ success });

  // Close the tab or go back to the prior page
  if (success) {
    await backOrClose();
  } else {
    console.warn('Unable to hide the item');
  }
  console.log('END - fbIndividualItemHide');
}
