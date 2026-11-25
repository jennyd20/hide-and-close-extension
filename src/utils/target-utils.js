import { fbIndividualItemHide } from '@/targets/fb-item.js';
import { fbSavedItemsHideAll } from '@/targets/fb-saved-cleanup.js';

// TODO(@Jenny): rename this to target-dispatcher or something related

// Given a URL, return the appropriate handler function for that URL, or null if no match is found.
export function getTargetHandler(currentUrl) {
  const target = supportedTargets.find(({ match }) => match.test(currentUrl));
  if (!target) {
    return null;
  }
  console.log(`Matched target: ${target.name}`);
  return target.handler;
}

const supportedTargets = [
  {
    // Match a specific Facebook Marketplace item URL, e.g., "https://www.facebook.com/marketplace/item/1234567890/" with an optional query string.
    name: 'Facebook Marketplace Item',
    match: /^https:\/\/www\.facebook\.com\/marketplace\/item\/\d+\/?(\?.*)?$/,
    handler: fbIndividualItemHide,
  },
  {
    // Match "https://www.facebook.com/saved" with an optional trailing slash. If there is a dashboard_section query parameter, it must be for PRODUCTS.
    name: 'Facebook Saved Items',
    match:
      /^https:\/\/www\.facebook\.com\/saved\/?(?:\?(?![^#]*\bdashboard_section=(?!PRODUCTS\/?(?:&|$)))[^#]*)?$/,
    handler: fbSavedItemsHideAll,
  },
];
