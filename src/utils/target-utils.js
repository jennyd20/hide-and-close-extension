import { fbIndividualItemHide } from '@/targets/fb-item.js';
import { fbSavedItemsHideAll } from '@/targets/fb-saved-cleanup.js';

// Given a URL, return the appropriate handler function for that URL, or null if no match is found.
export function getTargetHandler(currentUrl) {
  // Match a specific Facebook Marketplace item URL, e.g., "https://www.facebook.com/marketplace/item/1234567890/" with an optional query string.
  const fbItemUrlRegex =
    /^https:\/\/www\.facebook\.com\/marketplace\/item\/\d+\/?(\?.*)?$/;

  // Match "https://www.facebook.com/saved" with an optional trailing slash. If there is a dashboard_section query parameter, it must be for PRODUCTS.
  const fbSavedCleanupRegex =
    /^https:\/\/www\.facebook\.com\/saved\/?(?:\?(?![^#]*\bdashboard_section=(?!PRODUCTS\/?(?:&|$)))[^#]*)?$/;

  // Add future targets here as needed, following the same pattern.
  const supportedTargetUrls = [
    [fbItemUrlRegex, fbIndividualItemHide],
    [fbSavedCleanupRegex, fbSavedItemsHideAll],
  ];

  const targetMatch = supportedTargetUrls.find(([targetUrl]) =>
    targetUrl.test(currentUrl),
  );
  return targetMatch ? targetMatch[1] : null;
}
