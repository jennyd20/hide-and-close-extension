/* Author: Jenny Ross
Collaborated with MS Copilot

Create a bookmarklet to open a menu, hide an item, and then return to the main
Facebook Marketplace page. This saves at least three clicks on the user's part.

1. Check the URL, only allow execution on a Facebook Marketplace item
2. Decide whether to close the tab or go back, based on browser history
2. Clicks More Item Options
3. Clicks Hide listing
4. Execute decision from step 2, to close tab or go back
*/

// eslint-disable-next-line no-unused-labels
javascript: (function start() {
  // Require Marketplace item page
  if (!location.href.startsWith('https://www.facebook.com/marketplace/item/')) {
    alert('This bookmarklet only works on Facebook Marketplace item pages.');
    return;
  }

  // Decide action automatically:
  // If there's no meaningful history, close the tab.
  // Otherwise, go back.
  function decideAction() {
    return history.length > 1 ? 'back' : 'close';
  }

  const action = decideAction();

  /**
   * Click an element by aria-label
   * @param {string} label
   */
  function clickByAria(label) {
    /** @type {HTMLElement | null} */
    const el = document.querySelector(`[aria-label="${label}"]`);
    if (el) {
      el.click();
    }
    return !!el;
  }

  /**
   * Click an element by exact text match
   * @param {string} txt
   */
  function clickByText(txt) {
    /** @type {NodeListOf<HTMLElement>} */
    const candidates = document.querySelectorAll(
      'div[role="menuitem"], div[role="button"], span',
    );

    const el = [...candidates].find(
      (e) =>
        e.innerText && e.innerText.trim().toLowerCase() === txt.toLowerCase(),
    );

    if (el) {
      el.click();
    }

    return !!el;
  }

  // Step 1: Click "More Item Options"
  const openedMenu = clickByAria('More Item Options');

  if (!openedMenu) {
    alert('More Item Options button not found.');
    return;
  }

  // Step 2: Wait for menu to appear, then click "Hide listing"
  setTimeout(() => {
    const hid = clickByText('Hide listing');

    if (!hid) {
      alert('Hide listing not found after opening menu.');
      return;
    }

    // Step 3: After hiding, perform chosen action
    setTimeout(() => {
      if (action === 'close') {
        window.close();
      } else {
        history.back();
      }
    }, 300);
  }, 300);
})();

// Minified version for bookmarklet:
/*

javascript:(function(){if(!location.href.startsWith("https://www.facebook.com/marketplace/item/")){alert("This bookmarklet only works on Facebook Marketplace item pages.");return;}function k(){return history.length>1?"back":"close";}const action=k();function a(l){const e=document.querySelector(`[aria-label="${l}"]`);if(e)e.click();return!!e;}function b(t){const c=document.querySelectorAll('div[role="menuitem"],div[role="button"],span');const e=[...c].find(x=>x.innerText&&x.innerText.trim().toLowerCase()===t.toLowerCase());if(e)e.click();return!!e;}if(!a("More Item Options")){alert("More Item Options button not found.");return;}setTimeout(()=>{if(!b("Hide listing")){alert("Hide listing not found after opening menu.");return;}setTimeout(()=>{action==="close"?window.close():history.back();},300);},300);})();
*/
