import { afterEach, beforeEach, vi } from 'vitest';

vi.mock('../helpers/indexedDB', () => ({
  getCacheRow: vi.fn().mockResolvedValue(null),
  insertOrUpdateCacheRow: vi.fn().mockResolvedValue(undefined),
  isValidCacheData: vi.fn().mockReturnValue(true),
}));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
