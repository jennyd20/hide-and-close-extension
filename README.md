# HideAndClose Chrome Extension

Processing unwanted items on 3rd party selling sites can take a lot of clicks.
This extension aims to streamline processes associated with hiding items from
3rd party marketplaces.

- Hide and close an individual item
- Go through the list of saved items and remove the ones that have been sold

The goal of this extension is to process unwanted items based on context - if on
the page for an individual item, hide that one and return to the main list. If
on a list of saved or bookmarked items, remove all the ones that have been sold.

This extension does DOM manipulation and will break if website elements are
changed. It simulates mouse clicks on menus and buttons with appropriately timed
pauses.

I originally created a bookmarklet that hid and closed Facebook marketplace
items, but then I realized I wanted more custom options for different
marketplaces and different webpage contexts within those marketplaces
(individual items vs. lists, for instance). See original scripts and ideas in
v1_bookmarklet

The initial target is Facebook Marketplace, to eventually expand to Nextdoor
and Offerup.

Uses WXT
- Run `npm run dev` for testing
- Run `npm run build` for production


Daily Development:
- Run npm run dev in your terminal.
- Load .output/chrome-mv3-dev once into your normal Chrome (chrome://extensions -> Load unpacked).
- Edit code in VS Code -> save -> WXT hot-reloads it in Chrome.

Debugging Live Code on Facebook:
- Open DevTools (F12) on Facebook.
- Use debugger; or set breakpoints in the DevTools Sources tab.

Deploying:
- Run npm run build and npm run zip to get your ready-to-upload zip.
