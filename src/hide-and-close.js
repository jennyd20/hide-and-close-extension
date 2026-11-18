import { fbIndividualItemHide } from './targets/fb-item.js';
import { fbSavedItemsHideAll } from './targets/fb-saved-cleanup.js';

export function getUrl() {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return null;
}

export function getTarget(currentUrl) {
  const fbItemUrlRegex =
    /^https:\/\/www\.facebook\.com\/marketplace\/item\/\d+\/?(\?.*)?$/;

  // Match "https://www.facebook.com/saved" with an optional trailing slash. If there is a dashboard_section query parameter, it must be for PRODUCTS.
  const fbSavedCleanupRegex =
    /^https:\/\/www\.facebook\.com\/saved\/?(?:\?(?![^#]*\bdashboard_section=(?!PRODUCTS\/?(?:&|$)))[^#]*)?$/;

  const supportedTargetUrls = [
    [fbItemUrlRegex, 'fb-item'],
    [fbSavedCleanupRegex, 'fb-saved-cleanup'],
  ];

  const urlMatch = supportedTargetUrls.find(([targetUrl]) =>
    targetUrl.test(currentUrl),
  );
  return urlMatch ? urlMatch[1] : null;
}

const targetHandlers = {
  'fb-item': fbIndividualItemHide,
  'fb-saved-cleanup': fbSavedItemsHideAll,
};

export async function executeTarget(target) {
  if (!target) {
    console.warn('No target matched for the current URL');
    return null;
  }

  const handler = targetHandlers[target];
  if (typeof handler === 'function') {
    return await handler();
  }

  console.warn(`No handler implemented for target "${target}"`);
  return null;
}
