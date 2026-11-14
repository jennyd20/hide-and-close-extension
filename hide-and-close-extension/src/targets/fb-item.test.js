import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import { fbIndividualItemHide } from './fb-item.js';
import * as utils from '../utils/utils.js';

describe('fbIndividualItemHide', () => {
  let backSpy;
  let closeSpy;
  const originalHistoryLength = Object.getOwnPropertyDescriptor(
    window.history,
    'length',
  );

  beforeEach(() => {
    vi.restoreAllMocks();
    backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalHistoryLength) {
      Object.defineProperty(window.history, 'length', originalHistoryLength);
    } else {
      delete window.history.length;
    }
  });

  test('calls history.back() when hideItem succeeds and history length > 1', async () => {
    vi.spyOn(utils, 'hideItem').mockReturnValue(true);
    Object.defineProperty(window.history, 'length', {
      value: 3,
      configurable: true,
    });
    await fbIndividualItemHide();
    expect(utils.hideItem).toHaveBeenCalledWith(
      'More Item Options',
      'Additional options for this Marketplace listing',
      'Hide listing',
    );
    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  test('calls window.close() when hideItem succeeds and history length <= 1', async () => {
    vi.spyOn(utils, 'hideItem').mockReturnValue(true);
    Object.defineProperty(window.history, 'length', {
      value: 1,
      configurable: true,
    });
    await fbIndividualItemHide();
    expect(utils.hideItem).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(backSpy).not.toHaveBeenCalled();
  });

  test('neither navigates back nor closes window when hideItem fails', async () => {
    vi.spyOn(utils, 'hideItem').mockReturnValue(false);
    await fbIndividualItemHide();
    expect(utils.hideItem).toHaveBeenCalled();
    expect(backSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
