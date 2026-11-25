import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import * as nav_utils from './nav-utils.js';

describe('backOrClose', () => {
  let sendMessageSpy;
  let historyBackSpy;

  beforeEach(() => {
    vi.restoreAllMocks();

    sendMessageSpy = vi
      .spyOn(browser.runtime, 'sendMessage')
      .mockResolvedValue(undefined);

    historyBackSpy = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {});

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('goes back when history has previous entries', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(2);

    await nav_utils.backOrClose();

    expect(historyBackSpy).toHaveBeenCalledOnce();
    expect(sendMessageSpy).not.toHaveBeenCalled();
  });

  test('closes tab when no previous history exists', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1);

    await nav_utils.backOrClose();

    expect(historyBackSpy).not.toHaveBeenCalled();
    expect(sendMessageSpy).toHaveBeenCalledWith({
      type: 'CLOSE_CURRENT_TAB',
    });
  });

  test('warns when background script sendMessage fails', async () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1);
    sendMessageSpy.mockRejectedValue(new Error('no receiver'));

    await nav_utils.backOrClose();

    expect(console.warn).toHaveBeenCalledWith(
      'Failed to close tab:',
      expect.any(Error),
    );
  });
});
