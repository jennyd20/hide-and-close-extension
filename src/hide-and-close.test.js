import { afterEach, expect, test, describe, vi } from 'vitest';
import { runHideAndClose } from './hide-and-close.js';
import * as fbItemModule from './targets/fb-item.js';
import * as fbSavedModule from './targets/fb-saved-cleanup.js';

describe('runHideAndClose', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('executes fbIndividualItemHide when on an FB item page', async () => {
    const resolvedValue = 'mocked-fb-item-success';
    vi.stubGlobal('location', {
      href: 'https://www.facebook.com/marketplace/item/1234567890/',
    });
    const spy = vi
      .spyOn(fbItemModule, 'fbIndividualItemHide')
      .mockResolvedValue(resolvedValue);
    const result = await runHideAndClose();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBe(resolvedValue);
  });

  test('executes fbSavedItemsHideAll when on an FB saved page', async () => {
    const resolvedValue = 'mocked-fb-saved-success';
    vi.stubGlobal('location', {
      href: 'https://www.facebook.com/saved/?dashboard_section=PRODUCTS',
    });
    const spy = vi
      .spyOn(fbSavedModule, 'fbSavedItemsHideAll')
      .mockResolvedValue(resolvedValue);
    const result = await runHideAndClose();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBe(resolvedValue);
  });

  test('returns null and warns when URL does not match any target path', async () => {
    vi.stubGlobal('location', {
      href: 'https://www.google.com',
    });
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    const result = await runHideAndClose();
    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'No handler implemented for "https://www.google.com"',
      ),
    );
  });
});
