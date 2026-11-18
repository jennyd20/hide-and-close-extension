import { expect, test, describe } from 'vitest';
import { getTargetHandler } from './target-utils.js';
import { fbIndividualItemHide } from '../targets/fb-item.js';
import { fbSavedItemsHideAll } from '../targets/fb-saved-cleanup.js';

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
      expected: null,
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

describe('FB saved item list', () => {
  const testCases = [
    {
      name: 'Test correct list page, with trailing slash',
      input: 'https://www.facebook.com/saved/',
    },
    {
      name: 'Valid item without slash',
      input: 'https://www.facebook.com/saved',
    },
    {
      name: 'Product save page, with query parameters',
      input: 'https://www.facebook.com/saved/?source=HOME&local=LOCAL',
    },
    {
      name: 'Product save page, PRODUCTS hidden among random query parameters',
      input:
        'https://www.facebook.com/saved/?locale=LOCAL&dashboard_section=PRODUCTS&source=Marketplace',
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
