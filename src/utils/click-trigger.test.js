// Written with Antigravity
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { triggerClickAsync } from './click-trigger.js';

describe('triggerClickAsync', () => {
  let triggerButton;

  beforeEach(() => {
    document.body.innerHTML = '';
    triggerButton = document.createElement('button');
    triggerButton.id = 'trigger-btn';
    document.body.appendChild(triggerButton);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  // 1. Success case: target opens within time
  it('resolves with the target element when it appears dynamically after click', async () => {
    const targetSelector = '.dropdown-menu';

    // Simulate clicking the button causing the element to appear after a short delay
    triggerButton.addEventListener('click', () => {
      setTimeout(() => {
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.textContent = 'Menu Content';
        document.body.appendChild(menu);
      }, 50);
    });

    const clickSpy = vi.spyOn(triggerButton, 'click');

    const result = await triggerClickAsync(triggerButton, targetSelector);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(result).not.toBeUndefined();
    expect(result.className).toBe('dropdown-menu');
    expect(result.textContent).toBe('Menu Content');
  });

  // 2. Failure case: selector / trigger element is not present (or invalid)
  it('logs an error and returns undefined when trigger element is not present', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await triggerClickAsync(null, '.target-item');

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  // 3. Failure case: target does not open in time (timeout)
  it('logs an error and returns undefined when target element does not appear before timeout', async () => {
    vi.useFakeTimers();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Button does not insert anything matching '.non-existent-menu'
    const promise = triggerClickAsync(triggerButton, '.non-existent-menu');

    // Fast-forward past the default 5000ms timeout in waitForElement
    await vi.advanceTimersByTimeAsync(5000);

    const result = await promise;

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Timeout: Element ".non-existent-menu" did not appear within 5000ms',
      ),
    );
    expect(result).toBeUndefined();

    vi.useRealTimers();
  });

  // Target is already present before click
  it('resolves immediately if the target element already exists in the DOM', async () => {
    const existingElement = document.createElement('div');
    existingElement.className = 'pre-existing';
    document.body.appendChild(existingElement);
    const result = await triggerClickAsync(triggerButton, '.pre-existing');
    expect(result).toBe(existingElement);
  });

  // Invalid selector throws a syntax error
  it('handles invalid selector syntax gracefully without throwing unhandled exceptions', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const result = await triggerClickAsync(
      triggerButton,
      ':::invalid[selector',
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  // Ignores unrelated DOM mutations
  it('continues waiting if unrelated mutations occur in the DOM', async () => {
    vi.useFakeTimers();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const promise = triggerClickAsync(triggerButton, '.desired-element');
    // Add an unrelated element
    const unrelated = document.createElement('div');
    unrelated.className = 'unrelated';
    document.body.appendChild(unrelated);
    // Advance time to timeout
    await vi.advanceTimersByTimeAsync(5000);
    const result = await promise;
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
