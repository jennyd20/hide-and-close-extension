import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import { fbIndividualItemHide } from './fb-item.js';
import * as menu_utils from '@/utils/menu-utils.js';
import * as nav_utils from '@/utils/nav-utils.js';

describe('fbIndividualItemHide', () => {
  let hideItemSpy;
  let backOrCloseSpy;

  beforeEach(() => {
    vi.restoreAllMocks();
    hideItemSpy = vi.spyOn(menu_utils, 'hideItem').mockImplementation(() => {});
    backOrCloseSpy = vi
      .spyOn(nav_utils, 'backOrClose')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks;
  });

  test('Hides the menu item with the correctly named menu items on the FB item page', async () => {
    hideItemSpy.mockReturnValue(true);
    await fbIndividualItemHide();
    expect(hideItem).toHaveBeenCalledWith(
      'More Item Options',
      'Additional options for this Marketplace listing',
      'Hide listing',
    );
    expect(hideItem).toHaveReturnedWith(true);
    expect(backOrCloseSpy).toHaveBeenCalled();
  });

  test('Do not attempt to go back if hiding the item failed', async () => {
    hideItemSpy.mockReturnValue(false);
    await fbIndividualItemHide();
    expect(hideItem).toHaveReturnedWith(false);
    expect(backOrCloseSpy).not.toHaveBeenCalled();
  });
});
