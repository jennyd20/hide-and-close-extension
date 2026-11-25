import { beforeEach, afterEach, expect, test, describe, vi } from 'vitest';

// Define mocks before importing so that spying works as expected
const mocks = vi.hoisted(() => ({
  fbIndividualItemHide: vi.fn(),
  fbSavedItemsHideAll: vi.fn(),
}));

vi.mock('@/targets/fb-item.js', () => ({
  fbIndividualItemHide: mocks.fbIndividualItemHide,
}));

vi.mock('@/targets/fb-saved-cleanup.js', () => ({
  fbSavedItemsHideAll: mocks.fbSavedItemsHideAll,
}));

import { runHideAndClose, getTargetHandler } from '@/hide-and-close.js';
import { fbIndividualItemHide } from '@/targets/fb-item.js';
import { fbSavedItemsHideAll } from '@/targets/fb-saved-cleanup.js';

describe('runHideAndClose', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('executes fbIndividualItemHide when on an FB item page', async () => {
    const resolvedValue = 'mocked-fb-item-success';
    fbIndividualItemHide.mockResolvedValue(resolvedValue);
    vi.stubGlobal('location', {
      href: 'https://www.facebook.com/marketplace/item/1234567890/',
    });

    const result = await runHideAndClose();
    expect(fbIndividualItemHide).toHaveBeenCalledOnce();
    expect(fbSavedItemsHideAll).not.toHaveBeenCalled();
    expect(result).toBe(resolvedValue);
  });

  test('executes fbSavedItemsHideAll when on an FB saved page', async () => {
    const resolvedValue = 'mocked-fb-saved-success';
    fbSavedItemsHideAll.mockResolvedValue(resolvedValue);
    vi.stubGlobal('location', {
      href: 'https://www.facebook.com/saved/?dashboard_section=PRODUCTS',
    });
    const result = await runHideAndClose();
    expect(fbSavedItemsHideAll).toHaveBeenCalledOnce();
    expect(fbIndividualItemHide).not.toHaveBeenCalled();
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

describe('getTargetHandler', () => {
  describe('Invalid targets, expected null', () => {
    const testCases = [
      {
        name: 'No specific item',
        input: 'https://www.facebook.com/marketplace/item/',
      },
      {
        name: 'Non-target Facebook url',
        input: 'https://www.facebook.com',
      },
      {
        name: 'Invalid website',
        input: 'https://www.google.com',
      },
      {
        name: 'Other category of facebook saved items',
        input: 'https://www.facebook.com/saved/?dashboard_section=VIDEOS',
      },
    ];

    test.each(testCases)('$name (invalid url "$input"', ({ input }) => {
      const result = getTargetHandler(input);
      expect(result).toBe(null);
    });
  });

  describe('FB individual items', () => {
    const testCases = [
      {
        name: 'Valid item with slash',
        input: 'https://www.facebook.com/marketplace/item/1589479896055232/',
      },
      {
        name: 'Valid item without slash',
        input: 'https://www.facebook.com/marketplace/item/1589479896055232',
      },
      {
        name: 'With ref parameter',
        input:
          'https://www.facebook.com/marketplace/item/1234567890/?ref=bookmark',
      },
      {
        name: 'With query parameters',
        input:
          'https://www.facebook.com/marketplace/item/1589479896055232?query=iwantit&marketplace=fb',
      },
    ];

    test.each(testCases)(
      '$name (maps "$input" -> fbIndividualItemHide)',
      ({ input }) => {
        const result = getTargetHandler(input);
        expect(result).toBe(fbIndividualItemHide);
      },
    );
  });

  describe('FB saved item list matches', () => {
    const testCases = [
      {
        name: 'With trailing slash',
        input: 'https://www.facebook.com/saved/',
      },
      {
        name: 'Without slash',
        input: 'https://www.facebook.com/saved',
      },
      {
        name: 'With query parameters',
        input: 'https://www.facebook.com/saved/?source=HOME&local=LOCAL',
      },
      {
        name: 'PRODUCTS dashboard section',
        input: 'https://www.facebook.com/saved/?dashboard_section=PRODUCTS',
      },
      {
        name: 'PRODUCTS dashboard section with trailing slash',
        input: 'https://www.facebook.com/saved/?dashboard_section=PRODUCTS/',
      },
      {
        name: 'PRODUCTS hidden among random query parameters',
        input:
          'https://www.facebook.com/saved/?locale=LOCAL&dashboard_section=PRODUCTS&source=Marketplace',
      },
      {
        name: 'Include source and local URL parameters',
        input: 'https://www.facebook.com/saved/?source=HOME&local=LOCAL',
      },
    ];

    test.each(testCases)(
      '$name (maps "$input" -> fbSavedItemsHideAll)',
      ({ input }) => {
        const result = getTargetHandler(input);
        expect(result).toBe(fbSavedItemsHideAll);
      },
    );
  });
});
