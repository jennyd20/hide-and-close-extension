import { beforeEach, expect, test, describe, vi } from "vitest";
import { getTarget, executeTarget } from "./hide-and-close.js";

test("Script compiles", () => {
  expect(true).toBe(true);
});

describe("FB individual items", () => {
  const testCases = [
    {
      name: "Valid item with slash",
      input: "https://www.facebook.com/marketplace/item/1589479896055232/",
      expected: "fb-item",
    },
    {
      name: "Valid item without slash",
      input: "https://www.facebook.com/marketplace/item/1589479896055232",
      expected: "fb-item",
    },
    {
      name: "No specific item",
      input: "https://www.facebook.com/marketplace/item/",
      expected: null,
    },
    {
      name: "Non-target url",
      input: "https://www.google.com",
      expected: null,
    },
    {
      name: "With query parameters",
      input:
        "https://www.facebook.com/marketplace/item/1589479896055232?query=iwantit&marketplace=fb",
      expected: "fb-item",
    },
  ];

  test.each(testCases)(
    '$name (maps "$input" -> "$expected")',
    ({ input, expected }) => {
      const result = getTarget(input);
      expect(result).toBe(expected);
    },
  );
});

describe("FB saved items", () => {
  const testCases = [
    {
      name: "Test correct list page, with trailing slash",
      input: "https://www.facebook.com/saved/",
      expected: "fb-saved-cleanup",
    },
    {
      name: "Valid item without slash",
      input: "https://www.facebook.com/saved",
      expected: "fb-saved-cleanup",
    },
    {
      name: "Other category of saved items",
      input: "https://www.facebook.com/saved/?dashboard_section=VIDEOS",
      expected: null,
    },
    {
      name: "Product save page, with query parameters",
      input: "https://www.facebook.com/saved/?source=HOME&local=LOCAL",
      expected: "fb-saved-cleanup",
    },
    {
      name: "Product save page, PRODUCTS hidden among random query parameters",
      input:
        "https://www.facebook.com/saved/?locale=LOCAL&dashboard_section=PRODUCTS&source=Marketplace",
      expected: "fb-saved-cleanup",
    },
    {
      name: "Other category of saved items",
      input: "https://www.facebook.com/saved/?dashboard_section=VIDEOS",
      expected: null,
    },
  ];

  test.each(testCases)(
    '$name (maps "$input" -> "$expected")',
    ({ input, expected }) => {
      const result = getTarget(input);
      expect(result).toBe(expected);
    },
  );
});

describe("Execute target", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test("Correct FB Item execution", async () => {
    const target = "fb-item";
    const expectedPath = "./targets/fb-item.js";

    vi.doMock(expectedPath, () => {
      return {
        targetScript: "mocked-fb-item",
      };
    });

    const result = await executeTarget(target);
    expect(result).toBe("mocked-fb-item");
  });

  test("Correct FB Saved Bulk Remove execution", async () => {
    const target = "fb-saved-cleanup";
    const expectedPath = "./targets/fb-saved-cleanup.js";
    vi.doMock(expectedPath, () => {
      return {
        targetScript: "mocked-fb-saved-cleanup",
      };
    });

    const result = await executeTarget(target);
    expect(result).toBe("mocked-fb-saved-cleanup");
  });
});
