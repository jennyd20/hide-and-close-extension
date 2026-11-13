# HideAndClose Chrome Extension

Processing unwanted items on 3rd party selling sites can take a lot of clicks. This extension aims to streamline processes associated with hiding items from 3rd party marketplaces.

- Hide and close an individual item
- Go through the list of saved items and remove the ones that have been sold

The goal of this extension is to process unwanted items based on context - if on the page for an individual item, hide that one and return to the main list. If on a list of saved or bookmarked items, remove all the ones that have been sold.

This extension does DOM manipulation and will break if website elements are changed. It simulates mouse clicks on menus and buttons with appropriately timed pauses.

I originally created a bookmarklet that hid and closed Facebook marketplace items, but then I realized I wanted more custom options for different marketplaces and different webpage contexts within those marketplaces (individual items vs. lists, for instance). The original script is in archive/hideandclose_v1.js, written partially with help from Copilot (its code is in copilotHideAndClose.js).

The initial target is Facebook Marketplace, to eventually expand to Nextdoor and Offerup.
