import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest';
import * as utils from '../utils/utils.js';
import * as clickTrigger from './click-trigger.js';

describe('Compiles', () => {
  test('Script compiles', () => {
    expect(true).toBe(true);
  });
});

describe('Scrolling', () => {
  // Test written by Antigravity
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test('Scroll window until document height stops changing', async () => {
    // 1. Mock window.scrollTo to update window.scrollY
    window.scrollY = 0;
    const scrollToSpy = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation((x, y) => {
        window.scrollY = y;
      });

    // 2. Mock document.body.scrollHeight to simulate page content expanding once, then stopping
    let heightAccessCount = 0;
    vi.spyOn(document.body, 'scrollHeight', 'get').mockImplementation(() => {
      // Return 1000 on initial check and 1st scroll, then increase to 2000, then stay at 2000
      if (heightAccessCount < 2) {
        heightAccessCount++;
        return 1000;
      }
      return 2000;
    });

    // 3. Start the scrollToBottom promise
    const scrollPromise = utils.scrollToBottom();

    // 4. Advance fake timers to fast-forward through the 2000ms waits
    await vi.runAllTimersAsync();

    // Wait for scrollToBottom to complete
    await scrollPromise;

    // 5. Assertions
    expect(scrollToSpy).toHaveBeenCalledWith(0, 1000);
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 2000);
    expect(window.scrollY).toBe(2000);
  });
});

// (describe("hideItem"),
//   () => {
//     test("hide item", async () => {
//       const target = "fb-item";
//       const expectedPath = "./targets/fb-item.js";
//       const result = await executeTarget(target);
//       expect(result).toBe("mocked-fb-item");
//     });
//   });

describe('hideItem', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('returns true and clicks hide button when all elements match (happy path)', async () => {
    // 1. Setup 'More Item Options' button in DOM
    const moreBtn = document.createElement('button');
    moreBtn.setAttribute('role', 'button');
    moreBtn.setAttribute('aria-label', 'More Item Options');
    moreBtn.setAttribute('aria-haspopup', 'menu');
    document.body.appendChild(moreBtn);
    // 2. Setup mock menu returned by triggerClickAsync
    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Menu Label');
    const option1 = document.createElement('div');
    option1.setAttribute('role', 'menuitem');
    option1.textContent = 'Save listing';
    const hideOption = document.createElement('div');
    hideOption.setAttribute('role', 'menuitem');
    hideOption.textContent = 'Hide listing from search';
    const hideClickSpy = vi.spyOn(hideOption, 'click');
    menu.appendChild(option1);
    menu.appendChild(hideOption);
    document.body.appendChild(menu);
    vi.spyOn(clickTrigger, 'triggerClickAsync').mockResolvedValue(menu);
    // 3. Execute
    const result = await utils.hideItem(
      'More Item Options',
      'Additional options for this Marketplace listing',
      'Hide listing',
      document,
    );
    expect(result).toBe(true);
    expect(hideClickSpy).toHaveBeenCalledTimes(1);
  });

  test('returns false when moreOptions button cannot be found', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // DOM is empty, no button exists
    const result = await utils.hideItem(
      'More Item Options',
      'Menu Label',
      'Hide listing',
    );
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('returns false and errors when moreOptions button is null', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // Explicitly pass a document context that has no matching button
    const emptyDiv = document.createElement('div');
    const result = await utils.hideItem(
      'More Item Options',
      'Menu Label',
      'Hide listing',
      emptyDiv, // ← scoped context with no matching button
    );
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  test('returns false when triggerClickAsync rejects or returns null', async () => {
    const moreBtn = document.createElement('button');
    moreBtn.setAttribute('role', 'button');
    moreBtn.setAttribute('aria-label', 'More Item Options');
    document.body.appendChild(moreBtn);
    vi.spyOn(clickTrigger, 'triggerClickAsync').mockResolvedValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await utils.hideItem(
      'More Item Options',
      'Menu Label',
      'Hide listing',
    );
    expect(result).toBe(false);
  });

  test('returns false when hide option is not found in menu options', async () => {
    const moreBtn = document.createElement('button');
    moreBtn.setAttribute('role', 'button');
    moreBtn.setAttribute('aria-label', 'More Item Options');
    document.body.appendChild(moreBtn);

    // Menu with no matching hide item
    const menu = document.createElement('div');
    const option1 = document.createElement('div');
    option1.setAttribute('role', 'menuitem');
    option1.textContent = 'Report listing';
    menu.appendChild(option1);

    vi.spyOn(clickTrigger, 'triggerClickAsync').mockResolvedValue(menu);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await utils.hideItem(
      'More Item Options',
      'Menu Label',
      'Hide listing',
    );
    expect(result).toBe(false);
  });
});
