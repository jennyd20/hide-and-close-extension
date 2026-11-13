import { beforeEach, afterEach, expect, test, describe, vi } from "vitest";
import { hideItem, scrollToBottom } from "./utils.js";

describe("Compiles", () => {
  test("Script compiles", () => {
    expect(true).toBe(true);
  });
});

describe("Scrolling", () => {
  // Test written by Antigravity
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("Scroll window until document height stops changing", async () => {
    // 1. Mock window.scrollTo to update window.scrollY
    window.scrollY = 0;
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation((x, y) => {
        window.scrollY = y;
      });

    // 2. Mock document.body.scrollHeight to simulate page content expanding once, then stopping
    let heightAccessCount = 0;
    vi.spyOn(document.body, "scrollHeight", "get").mockImplementation(() => {
      // Return 1000 on initial check and 1st scroll, then increase to 2000, then stay at 2000
      if (heightAccessCount < 2) {
        heightAccessCount++;
        return 1000;
      }
      return 2000;
    });

    // 3. Start the scrollToBottom promise
    const scrollPromise = scrollToBottom();

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
