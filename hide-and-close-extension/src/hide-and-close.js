export function getUrl() {
  const currentUrl = window.location.href;
  console.log({ currentUrl });
  return currentUrl;
}

export function getTarget(currentUrl) {
  //console.log('Starting script');

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
  const target = urlMatch ? urlMatch[1] : null;

  return target;
}

export async function executeTarget(target) {
  if (!target) {
    console.warn('No target matched for the current URL');
    return null;
  }

  const targetPath = './targets/' + target + '.js';
  const { targetScript } = await import(targetPath);

  if (typeof targetScript === 'function') {
    targetScript();
  }
  return targetScript;
}
