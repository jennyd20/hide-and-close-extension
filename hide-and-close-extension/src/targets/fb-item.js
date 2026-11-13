import { hideItem } from "../utils/index.js";

/***************************************************************************************
 ** IF LOOKING AT AN INDIVIDUAL FACEBOOK ITEM, HIDE IT AND THEN RETURN TO MARKETPLACE **
 ***************************************************************************************/
export function fbIndividualItemHide() {
  console.log("START - fbIndividualItemHide");
  const moreLabel = "More Item Options";
  const menuLabel = "Additional options for this Marketplace listing";
  const hideLabel = "Hide listing";

  const success = hideItem(moreLabel, menuLabel, hideLabel);
  console.log({ success });

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
