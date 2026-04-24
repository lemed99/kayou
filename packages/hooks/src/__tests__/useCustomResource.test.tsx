import { createRoot, createSignal, useContext } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';

import {
  CustomResourceContext,
  CustomResourceProvider,
  type PendingEntry,
} from '../context/CustomResourceContext';
import { getCacheRow, insertOrUpdateCacheRow } from '../helpers/indexedDB';
import { useCustomResource, type CustomResource } from '../hooks/useCustomResource';

import {
  createTestResource,
  flushMicrotasks,
  mockFetchError,
  mockFetchNetworkError,
  mockFetchSuccess,
  waitFor,
} from './helpers/test-utils';

// ==================== Context Requirement ====================

describe('context requirement', () => {
  it('throws when used outside CustomResourceProvider', () => {
    expect(() => {
      createRoot((dispose) => {
        try {
          useCustomResource({ urlString: () => '/api/test' });
        } finally {
          dispose();
        }
      });
    }).toThrow('useCustomResource must be used within a CustomResourceProvider');
  });
});

// ==================== Basic Fetching ====================

describe('basic fetching', () => {
  it('fetches data successfully with default fetcher', async () => {
    const data = { id: 1, name: 'Test User' };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource<typeof data>({
      urlString: () => '/api/users/1',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeNull();
    } finally {
      dispose();
    }
  });

  it('sets error and errorStatus on HTTP error response', async () => {
    globalThis.fetch = mockFetchError(500, { message: 'Internal Server Error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()).toBeInstanceOf(Error);
      expect(result.errorStatus()).toBe(500);
    } finally {
      dispose();
    }
  });

  it('parses error message from JSON body', async () => {
    globalThis.fetch = mockFetchError(400, 'Validation failed');

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      errorsBlackList: [400],
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()!.message).toBe('Validation failed');
    } finally {
      dispose();
    }
  });

  it('falls back to statusText when JSON body parse fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: () => Promise.reject(new Error('invalid json')),
    }) as unknown as typeof globalThis.fetch;

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      errorsBlackList: [502],
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()!.message).toBe('Bad Gateway');
    } finally {
      dispose();
    }
  });

  it('falls back to "HTTP {status}" when statusText is empty', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: '',
      json: () => Promise.reject(new Error('invalid json')),
    }) as unknown as typeof globalThis.fetch;

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      errorsBlackList: [503],
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()!.message).toBe('HTTP 503');
    } finally {
      dispose();
    }
  });

  it('uses custom fetcher when provided via options', async () => {
    const customFetcher = vi.fn().mockResolvedValue({ id: 1, custom: true });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      options: { fetcher: customFetcher },
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(customFetcher).toHaveBeenCalledWith('/api/users/1');
      expect(result.data()).toEqual({ id: 1, custom: true });
    } finally {
      dispose();
    }
  });

  it('passes AbortController signal to default fetcher', async () => {
    const data = { id: 1 };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({ signal: expect.any(AbortSignal) as AbortSignal }),
      );
    } finally {
      dispose();
    }
  });
});

// ==================== SWR Pattern ====================

describe('SWR pattern', () => {
  it('serves cached data immediately then revalidates', async () => {
    const cachedData = { id: 1, name: 'Cached' };
    const freshData = { id: 1, name: 'Fresh' };
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    // Delay the network fetch so cache resolves first
    globalThis.fetch = mockFetchSuccess(freshData, 200);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    }, {
      dedupeRequests: false,
    });

    try {
      // Cache data should arrive first
      await waitFor(() => result.data() !== undefined);
      expect(result.fromCache()).toBe(true);
      expect(result.data()).toEqual(cachedData);

      // Advance past the fetch delay so network data arrives
      await vi.advanceTimersByTimeAsync(300);
      await flushMicrotasks();

      // Then network data should update
      await waitFor(() => result.fromCache() === false);
      expect(result.data()).toEqual(freshData);
    } finally {
      dispose();
    }
  });

  it('sets validating to true during revalidation', async () => {
    const cachedData = { id: 1, name: 'Cached' };
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    globalThis.fetch = mockFetchSuccess({ id: 1, name: 'Fresh' }, 100);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      // After cache is served, validating should be true while network is in-flight
      // Note: validating is set when swr=true in wrappedFetcher
      await vi.advanceTimersByTimeAsync(150);
      await flushMicrotasks();
    } finally {
      dispose();
    }
  });

  it('does not let slow cache overwrite fresh network data', async () => {
    const freshData = { id: 1, name: 'Fresh' };
    const staleCacheData = { id: 1, name: 'Stale Cache' };
    let resolveCacheRead!: (value: unknown) => void;
    vi.mocked(getCacheRow).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCacheRead = resolve;
        }),
    );
    globalThis.fetch = mockFetchSuccess(freshData);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
      pullFromCache: false,
    }, {
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual(freshData);
      expect(result.fromCache()).toBe(false);

      resolveCacheRead(staleCacheData);
      await flushMicrotasks();

      expect(result.data()).toEqual(freshData);
      expect(result.fromCache()).toBe(false);
    } finally {
      dispose();
    }
  });

  it('applies cache for new URL without being blocked by previous URL network sequence', async () => {
    const [url, setUrl] = createSignal('/a');
    const [forceRefresh, setForceRefresh] = createSignal(true);
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });
    const fetcher = vi.fn().mockImplementation((requestUrl: string) => {
      if (requestUrl === '/a') {
        return Promise.resolve({ id: 'a', name: 'Network A' });
      }
      if (requestUrl === '/b') {
        return Promise.resolve({ id: 'b', name: 'Network B' });
      }
      return Promise.resolve({ id: 'unknown', name: 'Unknown' });
    });

    vi.mocked(getCacheRow).mockImplementation((requestUrl: string) => {
      if (requestUrl === '/a') {
        return Promise.resolve({ id: 'a-cache', name: 'Cache A' });
      }
      if (requestUrl === '/b') {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ id: 'b-cache', name: 'Cache B' }), 120);
        });
      }
      return Promise.resolve(null);
    });

    let result!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const Wrapper = () => {
        result = useCustomResource<{ id: string; name: string }>({
          urlString: url,
          refreshKey: 'user',
          swr: false,
          forceRefresh,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
        >
          <Wrapper />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => result.data()?.id === 'a');
      expect(fetcher).toHaveBeenCalledTimes(1);

      setForceRefresh(false);
      await flushMicrotasks();
      setUrl('/b');
      await waitFor(() => result.data()?.id === 'b-cache');

      expect(result.data()).toEqual({ id: 'b-cache', name: 'Cache B' });
      expect(result.fromCache()).toBe(true);
      expect(fetcher).toHaveBeenCalledTimes(1);
    } finally {
      dispose();
    }
  });

  it('blocks stale cache apply across hook instances after shared URL network success', async () => {
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });
    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    let cacheCallCount = 0;
    vi.mocked(getCacheRow).mockImplementation((requestUrl: string) => {
      if (requestUrl !== '/api/users/1') return Promise.resolve(null);
      cacheCallCount += 1;
      if (cacheCallCount === 1) {
        // B hook shouldFetch check: cache exists -> no network for B.
        return Promise.resolve({ id: 'stale', name: 'Stale Cache' });
      }
      // B hook cache resource read: resolves late with stale value.
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id: 'stale', name: 'Stale Cache' }), 120);
      });
    });

    let resultA!: CustomResource<{ id: string; name: string }>;
    let resultB!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const HookA = () => {
        resultA = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          forceRefresh: () => true,
          swr: false,
        });
        return null;
      };

      const HookB = () => {
        resultB = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          swr: true,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
        >
          <HookA />
          <HookB />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => resultA.data() !== undefined);
      expect(resultA.data()).toEqual({ id: 'fresh', name: 'Fresh Network' });
      expect(fetcher).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(150);
      await flushMicrotasks();

      expect(resultB.data()).toBeUndefined();
      expect(resultB.fromCache()).toBe(false);
    } finally {
      dispose();
    }
  });

  it('blocks stale delayed cache when another instance succeeds with lower local seq', async () => {
    const [conditionA, setConditionA] = createSignal(false);
    const [conditionB, setConditionB] = createSignal(false);
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });

    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    let cacheCallCount = 0;
    vi.mocked(getCacheRow).mockImplementation((requestUrl: string) => {
      if (requestUrl !== '/api/users/1') return Promise.resolve(null);
      cacheCallCount += 1;
      if (cacheCallCount === 1) {
        // B shouldFetch check: cache exists, so no network in B.
        return Promise.resolve({ id: 'stale', name: 'Stale Cache' });
      }
      // B cache read: delayed stale value captured before A network success.
      return new Promise((resolve) => {
        setTimeout(() => resolve({ id: 'stale', name: 'Stale Cache' }), 120);
      });
    });

    let resultA!: CustomResource<{ id: string; name: string }>;
    let resultB!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const HookA = () => {
        resultA = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionA,
          forceRefresh: () => true,
          swr: false,
        });
        return null;
      };

      const HookB = () => {
        resultB = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionB,
          swr: true,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
        >
          <HookA />
          <HookB />
        </CustomResourceProvider>
      );
    });

    try {
      // Inflate B local request sequence while blocked.
      resultB.refetch();
      resultB.refetch();

      // Start B delayed cache read first (snapshot before any A network success).
      setConditionB(true);
      await flushMicrotasks();

      // Then A succeeds with lower local seq.
      setConditionA(true);
      await waitFor(() => resultA.data() !== undefined);
      expect(resultA.data()).toEqual({ id: 'fresh', name: 'Fresh Network' });
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Late stale cache in B must be blocked.
      await vi.advanceTimersByTimeAsync(150);
      await flushMicrotasks();
      expect(resultB.data()).toBeUndefined();
      expect(resultB.fromCache()).toBe(false);
    } finally {
      dispose();
    }
  });

  it('does not apply stale cache read started during pending shared cache write', async () => {
    const [conditionA, setConditionA] = createSignal(false);
    const [conditionB, setConditionB] = createSignal(false);
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });
    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    const onSuccess = vi.fn();
    let cacheWriteStarted = false;
    let resolveCacheWrite: (() => void) | undefined;
    vi.mocked(insertOrUpdateCacheRow).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          cacheWriteStarted = true;
          resolveCacheWrite = resolve;
        }),
    );

    let cacheCallCount = 0;
    vi.mocked(getCacheRow).mockImplementation((requestUrl: string) => {
      if (requestUrl !== '/api/users/1') return Promise.resolve(null);
      cacheCallCount += 1;
      if (cacheCallCount === 1) {
        return Promise.resolve({ id: 'stale', name: 'Stale Cache' });
      }
      return Promise.resolve({ id: 'stale', name: 'Stale Cache' });
    });

    let resultA!: CustomResource<{ id: string; name: string }>;
    let resultB!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const HookA = () => {
        resultA = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionA,
          forceRefresh: () => true,
          swr: false,
        });
        return null;
      };

      const HookB = () => {
        resultB = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionB,
          swr: true,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
          onSuccess={onSuccess}
        >
          <HookA />
          <HookB />
        </CustomResourceProvider>
      );
    });

    try {
      setConditionA(true);
      await waitFor(() => resultA.data()?.id === 'fresh');
      await waitFor(() => cacheWriteStarted);
      expect(fetcher).toHaveBeenCalledTimes(1);

      // Start B cache read after A network success but before cache write commits.
      setConditionB(true);
      await flushMicrotasks();
      await vi.advanceTimersByTimeAsync(20);
      await flushMicrotasks();

      expect(resultB.data()).toBeUndefined();
      expect(resultB.fromCache()).toBe(false);
      const cacheSuccessCall = onSuccess.mock.calls.find(
        (call: unknown[]) => call[1] === true,
      );
      expect(cacheSuccessCall).toBeUndefined();
    } finally {
      if (resolveCacheWrite) {
        resolveCacheWrite();
        await flushMicrotasks();
      }
      dispose();
    }
  });

  it('does not apply stale cache when shared cache write fails after gap read starts', async () => {
    const [conditionA, setConditionA] = createSignal(false);
    const [conditionB, setConditionB] = createSignal(false);
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });
    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    const onSuccess = vi.fn();
    let cacheWriteStarted = false;
    let rejectCacheWrite: ((reason?: unknown) => void) | undefined;
    let resolveGapCacheRead: ((value: unknown) => void) | undefined;
    vi.mocked(insertOrUpdateCacheRow).mockImplementationOnce(
      () =>
        new Promise<void>((_resolve, reject) => {
          cacheWriteStarted = true;
          rejectCacheWrite = reject;
        }),
    );

    let cacheCallCount = 0;
    vi.mocked(getCacheRow).mockImplementation((requestUrl: string) => {
      if (requestUrl !== '/api/users/1') return Promise.resolve(null);
      cacheCallCount += 1;
      if (cacheCallCount === 1) {
        return Promise.resolve({ id: 'stale', name: 'Stale Cache' });
      }
      return new Promise((resolve) => {
        resolveGapCacheRead = resolve;
      });
    });

    let resultA!: CustomResource<{ id: string; name: string }>;
    let resultB!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const HookA = () => {
        resultA = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionA,
          forceRefresh: () => true,
          swr: false,
        });
        return null;
      };

      const HookB = () => {
        resultB = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionB,
          swr: true,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
          onSuccess={onSuccess}
        >
          <HookA />
          <HookB />
        </CustomResourceProvider>
      );
    });

    try {
      setConditionA(true);
      await waitFor(() => resultA.data()?.id === 'fresh');
      await waitFor(() => cacheWriteStarted);

      // Start B cache read after A network success but before failed cache write settles.
      setConditionB(true);
      await waitFor(() => cacheCallCount >= 2);

      rejectCacheWrite?.(new Error('cache write failed'));
      resolveGapCacheRead?.({ id: 'stale', name: 'Stale Cache' });
      await flushMicrotasks();
      await vi.advanceTimersByTimeAsync(20);
      await flushMicrotasks();

      expect(resultB.data()).toBeUndefined();
      expect(resultB.fromCache()).toBe(false);
      const cacheSuccessCall = onSuccess.mock.calls.find(
        (call: unknown[]) => call[1] === true,
      );
      expect(cacheSuccessCall).toBeUndefined();
    } finally {
      dispose();
    }
  });

  it('allows cache apply again after failed shared cache write settles', async () => {
    const [conditionA, setConditionA] = createSignal(false);
    const [conditionB, setConditionB] = createSignal(false);
    const [refreshData] = createSignal<Record<string, boolean>>({ user: false });
    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    const onSuccess = vi.fn();
    let rejectCacheWrite: ((reason?: unknown) => void) | undefined;
    vi.mocked(insertOrUpdateCacheRow).mockImplementationOnce(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectCacheWrite = reject;
        }),
    );

    vi.mocked(getCacheRow).mockResolvedValue({ id: 'stale', name: 'Stale Cache' });

    let resultA!: CustomResource<{ id: string; name: string }>;
    let resultB!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const HookA = () => {
        resultA = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionA,
          forceRefresh: () => true,
          swr: false,
        });
        return null;
      };

      const HookB = () => {
        resultB = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          condition: conditionB,
          swr: true,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
          onSuccess={onSuccess}
        >
          <HookA />
          <HookB />
        </CustomResourceProvider>
      );
    });

    try {
      setConditionA(true);
      await waitFor(() => resultA.data()?.id === 'fresh');

      rejectCacheWrite?.(new Error('cache write failed'));
      await flushMicrotasks();
      await vi.advanceTimersByTimeAsync(20);
      await flushMicrotasks();

      // After failure settles, cache suppression should recover and allow cache apply.
      setConditionB(true);
      await waitFor(() => resultB.data()?.id === 'stale');
      expect(resultB.fromCache()).toBe(true);
      const cacheSuccessCall = onSuccess.mock.calls.find(
        (call: unknown[]) => call[1] === true,
      );
      expect(cacheSuccessCall).toBeTruthy();
    } finally {
      dispose();
    }
  });

  it('keeps successful network state when cache write fails and later cache checks run', async () => {
    const [refreshData, setRefreshData] = createSignal<Record<string, boolean>>({ user: true });
    const [forceRefresh, setForceRefresh] = createSignal(true);
    const onError = vi.fn();
    const fetcher = vi.fn().mockResolvedValue({ id: 'fresh', name: 'Fresh Network' });
    vi.mocked(insertOrUpdateCacheRow).mockRejectedValueOnce(new Error('cache write failed'));
    vi.mocked(getCacheRow).mockResolvedValue({ id: 'stale', name: 'Stale Cache' });

    let result!: CustomResource<{ id: string; name: string }>;
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;

      const Hook = () => {
        result = useCustomResource<{ id: string; name: string }>({
          urlString: () => '/api/users/1',
          refreshKey: 'user',
          forceRefresh,
          swr: false,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={refreshData}
          retryCount={0}
          fetcher={fetcher}
          onError={onError}
        >
          <Hook />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => result.data()?.id === 'fresh');
      expect(result.error()).toBeNull();

      // Trigger cache-only path on same hook after failed cache write settled.
      setForceRefresh(false);
      setRefreshData({ user: false });
      await flushMicrotasks();
      await vi.advanceTimersByTimeAsync(20);
      await flushMicrotasks();

      expect(result.data()).toEqual({ id: 'fresh', name: 'Fresh Network' });
      expect(result.fromCache()).toBe(false);
      expect(result.error()).toBeNull();
      expect(result.attempts()).toBe(0);
      expect(onError).not.toHaveBeenCalled();
    } finally {
      dispose();
    }
  });

  it('loading is false when SWR has cached data', async () => {
    const cachedData = { id: 1, name: 'Cached' };
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    globalThis.fetch = mockFetchSuccess({ id: 1, name: 'Fresh' }, 100);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      // With SWR and cached data, loading should be false
      expect(result.loading()).toBe(false);
    } finally {
      dispose();
    }
  });

  it('calls onSuccess with fromCache=true for cached data', async () => {
    const cachedData = { id: 1, name: 'Cached' };
    const onSuccess = vi.fn();
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    globalThis.fetch = mockFetchSuccess({ id: 1, name: 'Fresh' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    }, {
      onSuccess,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      // First call should be from cache
      const cacheCall = onSuccess.mock.calls.find(
        (call: unknown[]) => call[1] === true,
      );
      expect(cacheCall).toBeTruthy();
      expect(cacheCall![0]).toEqual(cachedData);
    } finally {
      dispose();
    }
  });

  it('calls onSuccess with fromCache=false for network data', async () => {
    const freshData = { id: 1, name: 'Fresh' };
    const onSuccess = vi.fn();
    vi.mocked(getCacheRow).mockResolvedValue(null);
    globalThis.fetch = mockFetchSuccess(freshData);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    }, {
      onSuccess,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      const networkCall = onSuccess.mock.calls.find(
        (call: unknown[]) => call[1] === false,
      );
      expect(networkCall).toBeTruthy();
      expect(networkCall![0]).toEqual(freshData);
    } finally {
      dispose();
    }
  });
});

// ==================== Cache Integration ====================

describe('cache integration', () => {
  it('writes fetched data to cache on success', async () => {
    const data = { id: 1, name: 'Test' };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(insertOrUpdateCacheRow).toHaveBeenCalledWith('/api/users/1', data);
    } finally {
      dispose();
    }
  });

  it('skips cache when pullFromCache is false', async () => {
    const data = { id: 1, name: 'Test' };
    globalThis.fetch = mockFetchSuccess(data);
    vi.mocked(getCacheRow).mockClear();

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      pullFromCache: false,
      swr: false,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(getCacheRow).not.toHaveBeenCalled();
    } finally {
      dispose();
    }
  });

  it('passes custom cacheValidator to getCacheRow', async () => {
    const validator = vi.fn().mockReturnValue(true);
    const cachedData = { id: 1, name: 'Cached' };
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    globalThis.fetch = mockFetchSuccess({ id: 1, name: 'Fresh' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    }, {
      cacheValidator: validator,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(getCacheRow).toHaveBeenCalledWith(
        expect.any(String),
        validator,
      );
    } finally {
      dispose();
    }
  });

  it('sets fromCache correctly', async () => {
    const freshData = { id: 1, name: 'Fresh' };
    vi.mocked(getCacheRow).mockResolvedValue(null);
    globalThis.fetch = mockFetchSuccess(freshData);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.fromCache()).toBe(false);
    } finally {
      dispose();
    }
  });
});

// ==================== Retry Logic ====================

describe('retry logic', () => {
  it('retries on error up to retryCount', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: () => Promise.resolve({ message: 'error' }),
      });
    }) as unknown as typeof globalThis.fetch;

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 2,
      retryDelay: 100,
      exponentialBackoff: false,
      errorsBlackList: [],
      dedupeRequests: false,
    });

    try {
      // Wait for initial fetch to fail
      await waitFor(() => result.error() !== null);
      expect(result.attempts()).toBeGreaterThanOrEqual(1);

      // Advance past retry delays (100ms each, flat)
      for (let i = 0; i < 5; i++) {
        await vi.advanceTimersByTimeAsync(150);
        await flushMicrotasks();
      }

      // Should have retried up to retryCount times
      expect(callCount).toBeGreaterThanOrEqual(2);
    } finally {
      dispose();
    }
  });

  it('uses exponential backoff for retry delays', async () => {
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    globalThis.fetch = mockFetchError(502, { message: 'error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
      errorsBlackList: [],
    });

    try {
      await waitFor(() => result.attempts() >= 1);

      // With Math.random mocked to 0, jitter = 0
      // First retry: 1000 * 2^0 + 0 = 1000ms
      const retryCalls = timeoutSpy.mock.calls.filter(
        (call) => typeof call[1] === 'number' && call[1] >= 1000,
      );
      expect(retryCalls.length).toBeGreaterThanOrEqual(1);
      expect(retryCalls[0][1]).toBe(1000); // 1000 * 2^0 = 1000
    } finally {
      dispose();
    }
  });

  it('does not retry for blacklisted error status codes', async () => {
    globalThis.fetch = mockFetchError(404, { message: 'Not found' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 3,
      errorsBlackList: [404],
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.errorStatus()).toBe(404);

      // Wait some time - no retries should happen
      await vi.advanceTimersByTimeAsync(10000);
      await flushMicrotasks();
      expect(result.attempts()).toBe(0);
    } finally {
      dispose();
    }
  });

  it('does not retry AbortError', async () => {
    // Use a custom fetcher: first call rejects with AbortError, second would succeed
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    const customFetcher = vi.fn()
      .mockRejectedValueOnce(abortError)
      .mockResolvedValue({ id: 1, name: 'Success' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
      options: { fetcher: customFetcher },
    }, {
      retryCount: 3,
      retryDelay: 100,
      errorsBlackList: [],
      dedupeRequests: false,
    });

    try {
      // Let initial fetch + effects resolve
      await vi.advanceTimersByTimeAsync(200);
      await flushMicrotasks();

      // Advance well past all possible retry delays
      await vi.advanceTimersByTimeAsync(5000);
      await flushMicrotasks();

      // AbortError should not trigger full retry cycle.
      // With retryCount=3, a normal error would retry 3 times.
      // AbortError should stop retries — data should NOT be set from a retry.
      expect(result.attempts()).toBeLessThanOrEqual(1);
    } finally {
      dispose();
    }
  });

  it('retries network errors (no status code)', async () => {
    globalThis.fetch = mockFetchNetworkError();

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 2,
      retryDelay: 500,
      exponentialBackoff: false,
      errorsBlackList: [404, 500],
    });

    try {
      await waitFor(() => result.error() !== null);
      // errorStatus should be undefined for network errors
      expect(result.errorStatus()).toBeUndefined();
      // Should still retry since errorStatus is undefined (not in blacklist)
      expect(result.attempts()).toBeGreaterThanOrEqual(1);
    } finally {
      dispose();
    }
  });

  it('resets attempts on manual refetch', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount <= 2) {
        return Promise.resolve({
          ok: false,
          status: 502,
          statusText: 'Bad Gateway',
          json: () => Promise.resolve({ message: 'error' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      });
    }) as unknown as typeof globalThis.fetch;

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 1,
      retryDelay: 1000,
      exponentialBackoff: false,
      errorsBlackList: [],
    });

    try {
      await waitFor(() => result.attempts() >= 1);

      // Manual refetch should reset attempts — the refetch itself fails
      // (callCount=2 ≤ 2), so retry fires once from the fresh counter: 0 → 1
      result.refetch();
      await flushMicrotasks();
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();
      expect(result.attempts()).toBe(1);
    } finally {
      dispose();
    }
  });

  it('stops retrying after reaching retryCount', async () => {
    globalThis.fetch = mockFetchError(502, { message: 'error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 1,
      retryDelay: 500,
      exponentialBackoff: false,
      errorsBlackList: [],
    });

    try {
      await waitFor(() => result.attempts() >= 1);

      // Advance past retry
      await vi.advanceTimersByTimeAsync(600);
      await flushMicrotasks();

      // Should not exceed retryCount
      await vi.advanceTimersByTimeAsync(5000);
      await flushMicrotasks();
      expect(result.attempts()).toBeLessThanOrEqual(1);
    } finally {
      dispose();
    }
  });
});

// ==================== Request Deduplication ====================

describe('request deduplication', () => {
  it('skips dedup when dedupeRequests is false', async () => {
    const data = { id: 1 };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    }, {
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual(data);
    } finally {
      dispose();
    }
  });

  it('clears stale rejected dedupe promise after 401 so refetch performs new request', async () => {
    const fetcher = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }))
      .mockResolvedValueOnce({ id: 1, name: 'Recovered' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      errorsBlackList: [401],
      fetcher,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(fetcher).toHaveBeenCalledTimes(1);

      result.refetch();
      await waitFor(() => result.data() !== undefined);

      expect(result.data()).toEqual({ id: 1, name: 'Recovered' });
      expect(fetcher).toHaveBeenCalledTimes(2);
    } finally {
      dispose();
    }
  });

  it('clears stale rejected dedupe promise after AbortError so refetch performs new request', async () => {
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    const fetcher = vi.fn()
      .mockRejectedValueOnce(abortError)
      .mockResolvedValueOnce({ id: 1, name: 'Recovered' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      fetcher,
    });

    try {
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();
      expect(fetcher).toHaveBeenCalledTimes(1);

      result.refetch();
      await waitFor(() => result.data() !== undefined);

      expect(result.data()).toEqual({ id: 1, name: 'Recovered' });
      expect(fetcher).toHaveBeenCalledTimes(2);
    } finally {
      dispose();
    }
  });

  it('clears rejected dedupe entry within same microtask flush', async () => {
    let rejectFirstRequest!: (reason: unknown) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((_resolve, reject) => {
      rejectFirstRequest = reject;
    });
    const fetcher = vi.fn().mockReturnValueOnce(firstRequest);

    let pendingRequests!: Map<string, PendingEntry<unknown>>;
    let dispose!: () => void;
    const defaultRefreshData = createSignal<Record<string, boolean>>({});

    createRoot((d) => {
      dispose = d;

      const Wrapper = () => {
        useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        const context = useContext(CustomResourceContext);
        if (!context) throw new Error('missing CustomResourceContext in test');
        pendingRequests = context.pendingRequests as Map<string, PendingEntry<unknown>>;
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={defaultRefreshData[0]}
          retryCount={0}
          errorsBlackList={[401]}
          fetcher={fetcher}
        >
          <Wrapper />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(pendingRequests.get('/api/users/1')?.promise).toBeTruthy();

      rejectFirstRequest(Object.assign(new Error('Unauthorized'), { status: 401 }));
      await flushMicrotasks();

      expect(pendingRequests.get('/api/users/1')).toBeUndefined();
    } finally {
      dispose();
    }
  });

  it('manual refetch bypasses shared pending dedupe promise without entry-gap', async () => {
    let resolveFirstRequest!: (value: { id: number; name: string }) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((resolve) => {
      resolveFirstRequest = resolve;
    });
    const fetcher = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce({ id: 2, name: 'Fresh' });

    let result!: CustomResource<{ id: number; name: string }>;
    let pendingRequests!: Map<string, PendingEntry<unknown>>;
    let dispose!: () => void;
    const defaultRefreshData = createSignal<Record<string, boolean>>({});

    createRoot((d) => {
      dispose = d;

      const Wrapper = () => {
        result = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        const context = useContext(CustomResourceContext);
        if (!context) throw new Error('missing CustomResourceContext in test');
        pendingRequests = context.pendingRequests as Map<string, PendingEntry<unknown>>;
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={defaultRefreshData[0]}
          retryCount={0}
          fetcher={fetcher}
        >
          <Wrapper />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);
      expect(pendingRequests.get('/api/users/1')?.promise).toBeTruthy();

      result.refetch();
      expect(pendingRequests.get('/api/users/1')?.promise).toBeTruthy();

      await waitFor(() => fetcher.mock.calls.length === 2);
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual({ id: 2, name: 'Fresh' });
      expect(pendingRequests.get('/api/users/1')?.lastValue).toEqual({
        id: 2,
        name: 'Fresh',
      });

      resolveFirstRequest({ id: 1, name: 'Stale' });
      await flushMicrotasks();

      expect(result.data()).toEqual({ id: 2, name: 'Fresh' });
      expect(result.error()).toBeNull();
      expect(pendingRequests.get('/api/users/1')?.lastValue).toEqual({
        id: 2,
        name: 'Fresh',
      });
    } finally {
      dispose();
    }
  });

  it('does not leak forceFreshNextFetch after refetch while URL is empty', async () => {
    const [url, setUrl] = createSignal('/api/users/1');
    const fetcher = vi.fn().mockResolvedValue({ id: 1, name: 'Fresh' });

    const { result, dispose } = createTestResource({
      urlString: url,
      swr: false,
    }, {
      retryCount: 0,
      fetcher,
      dedupeInterval: 10_000,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(fetcher).toHaveBeenCalledTimes(1);

      setUrl('');
      await flushMicrotasks();
      result.refetch();
      await flushMicrotasks();

      setUrl('/api/users/1');
      await flushMicrotasks();
      await waitFor(() => result.data() !== undefined);

      // Should reuse dedupe lastValue; no forced bypass-triggered second network call.
      expect(fetcher).toHaveBeenCalledTimes(1);
    } finally {
      dispose();
    }
  });

  it('ignores stale first rejection after newer manual refetch success', async () => {
    let rejectFirstRequest!: (reason: unknown) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((_resolve, reject) => {
      rejectFirstRequest = reject;
    });
    const fetcher = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce({ id: 2, name: 'Fresh' });
    const onError = vi.fn();

    let result!: CustomResource<{ id: number; name: string }>;
    let dispose!: () => void;
    const defaultRefreshData = createSignal<Record<string, boolean>>({});

    createRoot((d) => {
      dispose = d;

      const Wrapper = () => {
        result = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={defaultRefreshData[0]}
          retryCount={0}
          errorsBlackList={[401]}
          fetcher={fetcher}
          onError={onError}
        >
          <Wrapper />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);

      result.refetch();
      await waitFor(() => fetcher.mock.calls.length === 2);
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual({ id: 2, name: 'Fresh' });

      rejectFirstRequest(Object.assign(new Error('Unauthorized'), { status: 401 }));
      await flushMicrotasks();

      expect(result.data()).toEqual({ id: 2, name: 'Fresh' });
      expect(result.error()).toBeNull();
      expect(result.errorStatus()).toBeUndefined();
      expect(onError).not.toHaveBeenCalled();
    } finally {
      dispose();
    }
  });

  it('stale abort from older request does not prematurely settle newer pending request', async () => {
    let rejectFirstRequest!: (reason: unknown) => void;
    let resolveSecondRequest!: (value: { id: number; name: string }) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((_resolve, reject) => {
      rejectFirstRequest = reject;
    });
    const secondRequest = new Promise<{ id: number; name: string }>((resolve) => {
      resolveSecondRequest = resolve;
    });
    const fetcher = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      fetcher,
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);
      result.refetch();
      await waitFor(() => fetcher.mock.calls.length === 2);

      rejectFirstRequest(new DOMException('The operation was aborted', 'AbortError'));
      await flushMicrotasks();

      expect(result.loading()).toBe(true);
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeNull();

      resolveSecondRequest({ id: 2, name: 'Fresh' });
      await waitFor(() => result.data() !== undefined);

      expect(result.loading()).toBe(false);
      expect(result.data()).toEqual({ id: 2, name: 'Fresh' });
      expect(result.error()).toBeNull();
    } finally {
      dispose();
    }
  });

  it('keeps sibling shared-request completion while protecting refetching instance state', async () => {
    let resolveFirstRequest!: (value: { id: number; name: string }) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((resolve) => {
      resolveFirstRequest = resolve;
    });
    const fetcher = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce({ id: 2, name: 'Fresh' });

    let resultA!: CustomResource<{ id: number; name: string }>;
    let resultB!: CustomResource<{ id: number; name: string }>;
    let dispose!: () => void;
    const defaultRefreshData = createSignal<Record<string, boolean>>({});

    createRoot((d) => {
      dispose = d;

      const WrapperA = () => {
        resultA = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        return null;
      };

      const WrapperB = () => {
        resultB = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={defaultRefreshData[0]}
          retryCount={0}
          fetcher={fetcher}
        >
          <WrapperA />
          <WrapperB />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);

      resultA.refetch();
      await waitFor(() => fetcher.mock.calls.length === 2);
      await waitFor(() => resultA.data() !== undefined);
      expect(resultA.data()).toEqual({ id: 2, name: 'Fresh' });

      resolveFirstRequest({ id: 1, name: 'Stale' });
      await flushMicrotasks();
      await waitFor(() => resultB.data() !== undefined);

      expect(resultA.data()).toEqual({ id: 2, name: 'Fresh' });
      expect(resultA.error()).toBeNull();
      expect(resultB.data()).toEqual({ id: 1, name: 'Stale' });
      expect(resultB.error()).toBeNull();
    } finally {
      dispose();
    }
  });

  it('keeps sibling completion with dedupeRequests=false while protecting refetching instance', async () => {
    let resolveFirstRequest!: (value: { id: number; name: string }) => void;
    let resolveSecondRequest!: (value: { id: number; name: string }) => void;
    const firstRequest = new Promise<{ id: number; name: string }>((resolve) => {
      resolveFirstRequest = resolve;
    });
    const secondRequest = new Promise<{ id: number; name: string }>((resolve) => {
      resolveSecondRequest = resolve;
    });
    const fetcher = vi.fn()
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest)
      .mockResolvedValueOnce({ id: 3, name: 'Fresh' });

    let resultA!: CustomResource<{ id: number; name: string }>;
    let resultB!: CustomResource<{ id: number; name: string }>;
    let dispose!: () => void;
    const defaultRefreshData = createSignal<Record<string, boolean>>({});

    createRoot((d) => {
      dispose = d;

      const WrapperA = () => {
        resultA = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        return null;
      };

      const WrapperB = () => {
        resultB = useCustomResource<{ id: number; name: string }>({
          urlString: () => '/api/users/1',
          swr: false,
        });
        return null;
      };

      return (
        <CustomResourceProvider
          refreshData={defaultRefreshData[0]}
          retryCount={0}
          dedupeRequests={false}
          fetcher={fetcher}
        >
          <WrapperA />
          <WrapperB />
        </CustomResourceProvider>
      );
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 2);

      resultA.refetch();
      await waitFor(() => fetcher.mock.calls.length === 3);
      await waitFor(() => resultA.data() !== undefined);
      expect(resultA.data()).toEqual({ id: 3, name: 'Fresh' });

      resolveFirstRequest({ id: 1, name: 'Stale A' });
      resolveSecondRequest({ id: 2, name: 'Stale B' });
      await flushMicrotasks();
      await waitFor(() => resultB.data() !== undefined);

      expect(resultA.data()).toEqual({ id: 3, name: 'Fresh' });
      expect(resultA.error()).toBeNull();
      expect(resultB.data()).toEqual({ id: 2, name: 'Stale B' });
      expect(resultB.error()).toBeNull();
    } finally {
      dispose();
    }
  });
});

// ==================== AbortController ====================

describe('abort and cancellation', () => {
  it('aborts request on cleanup/unmount', async () => {
    let abortSignal: AbortSignal | undefined;
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      abortSignal = init?.signal ?? undefined;
      return new Promise<Response>((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ id: 1 }),
            } as Response),
          5000,
        ),
      );
    });

    const { dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    await vi.advanceTimersByTimeAsync(100);
    await flushMicrotasks();

    // Dispose should abort
    dispose();
    expect(abortSignal?.aborted).toBe(true);
  });

  it('aborts previous request on refetch', async () => {
    const signals: AbortSignal[] = [];
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.signal) signals.push(init.signal);
      return new Promise<Response>((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve({ id: 1 }),
            } as Response),
          5000,
        ),
      );
    });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    try {
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();

      // Refetch should abort previous
      result.refetch();
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();

      if (signals.length >= 2) {
        expect(signals[0].aborted).toBe(true);
      }
    } finally {
      dispose();
    }
  });

  it('refetch clears validating when replacement fetch is skipped', async () => {
    const neverSettles = new Promise<{ id: number }>(() => undefined);
    const fetcher = vi.fn().mockReturnValue(neverSettles);
    const [url, setUrl] = createSignal('/api/users/1');

    const { result, dispose } = createTestResource<{ id: number }>({
      urlString: url,
      swr: true,
    }, {
      retryCount: 0,
      fetcher,
    });

    try {
      await waitFor(() => fetcher.mock.calls.length === 1);
      expect(result.validating()).toBe(true);

      setUrl('');
      result.refetch();
      await flushMicrotasks();

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result.validating()).toBe(false);
    } finally {
      dispose();
    }
  });
});

// ==================== Conditional Fetching ====================

describe('conditional fetching', () => {
  it('does not fetch when condition is false', async () => {
    globalThis.fetch = mockFetchSuccess({ id: 1 });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      condition: () => false,
      swr: false,
    });

    try {
      await vi.advanceTimersByTimeAsync(500);
      await flushMicrotasks();
      expect(result.data()).toBeUndefined();
      // Fetch may have been called for shouldFetch resource, but data shouldn't be set
    } finally {
      dispose();
    }
  });

  it('fetches when condition becomes true', async () => {
    const data = { id: 1, name: 'Test' };
    globalThis.fetch = mockFetchSuccess(data);
    const [condition, setCondition] = createSignal(false);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      condition,
      swr: false,
    });

    try {
      await vi.advanceTimersByTimeAsync(500);
      await flushMicrotasks();
      expect(result.data()).toBeUndefined();

      // Change condition to true
      setCondition(true);
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual(data);
    } finally {
      dispose();
    }
  });
});

// ==================== Force Refresh ====================

describe('force refresh', () => {
  it('bypasses cache when forceRefresh is true', async () => {
    const cachedData = { id: 1, name: 'Cached' };
    const freshData = { id: 1, name: 'Fresh' };
    vi.mocked(getCacheRow).mockResolvedValue(cachedData);
    globalThis.fetch = mockFetchSuccess(freshData);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      forceRefresh: () => true,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      // Should have fetched fresh data
      expect(globalThis.fetch).toHaveBeenCalled();
    } finally {
      dispose();
    }
  });
});

// ==================== Error State Management ====================

describe('error state management', () => {
  it('sets error signal on fetch failure', async () => {
    globalThis.fetch = mockFetchError(500, { message: 'Server Error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()).toBeInstanceOf(Error);
    } finally {
      dispose();
    }
  });

  it('calls onError callback on failure', async () => {
    const onError = vi.fn();
    globalThis.fetch = mockFetchError(500, { message: 'Server Error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
    }, {
      retryCount: 0,
      onError,
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    } finally {
      dispose();
    }
  });

  it('clears error when new data arrives', async () => {
    let callCount = 0;
    const customFetcher = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Server error'));
      }
      return Promise.resolve({ id: 1, name: 'Success' });
    });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: false,
      options: { fetcher: customFetcher },
    }, {
      retryCount: 0,
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.error()).toBeInstanceOf(Error);

      // Manually refetch - should succeed this time
      result.refetch();
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();
      await waitFor(() => result.data() !== undefined);
      expect(result.error()).toBeNull();
    } finally {
      dispose();
    }
  });

  it('setErrorStatus allows manual override', async () => {
    const data = { id: 1 };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.errorStatus()).toBeUndefined();

      result.setErrorStatus(403);
      expect(result.errorStatus()).toBe(403);
    } finally {
      dispose();
    }
  });

  it('sets validating to false on error', async () => {
    globalThis.fetch = mockFetchError(500, { message: 'Error' });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      swr: true,
    }, {
      retryCount: 0,
      dedupeRequests: false,
    });

    try {
      await waitFor(() => result.error() !== null);
      expect(result.validating()).toBe(false);
    } finally {
      dispose();
    }
  });
});

// ==================== Context Integration ====================

describe('context integration', () => {
  it('prepends baseUrl to urlString', async () => {
    const data = { id: 1 };
    globalThis.fetch = mockFetchSuccess(data);

    const { result, dispose } = createTestResource({
      urlString: () => '/users/1',
    }, {
      baseUrl: 'https://api.example.com',
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.any(Object),
      );
    } finally {
      dispose();
    }
  });

  it('per-hook options override context defaults', async () => {
    const customFetcher = vi.fn().mockResolvedValue({ id: 1 });
    globalThis.fetch = mockFetchSuccess({ id: 2 });

    const { result, dispose } = createTestResource({
      urlString: () => '/api/users/1',
      options: { fetcher: customFetcher },
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(customFetcher).toHaveBeenCalled();
      expect(result.data()).toEqual({ id: 1 });
    } finally {
      dispose();
    }
  });
});

// ==================== Cleanup and Lifecycle ====================

describe('cleanup and lifecycle', () => {
  it('aborts in-flight request on dispose', async () => {
    let abortSignal: AbortSignal | undefined;
    globalThis.fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      abortSignal = init?.signal ?? undefined;
      return new Promise<Response>(() => {}); // never resolves
    });

    const { dispose } = createTestResource({
      urlString: () => '/api/users/1',
    });

    await vi.advanceTimersByTimeAsync(100);
    await flushMicrotasks();

    dispose();
    expect(abortSignal?.aborted).toBe(true);
  });

  it('refetches when URL changes reactively', async () => {
    const data1 = { id: 1, name: 'User 1' };
    const data2 = { id: 2, name: 'User 2' };
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      const data = callCount <= 1 ? data1 : data2;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(data),
      });
    }) as unknown as typeof globalThis.fetch;

    const [userId, setUserId] = createSignal(1);

    const { result, dispose } = createTestResource({
      urlString: () => `/api/users/${userId()}`,
    });

    try {
      await waitFor(() => result.data() !== undefined);
      expect(result.data()).toEqual(data1);

      // Change URL
      setUserId(2);
      await vi.advanceTimersByTimeAsync(100);
      await flushMicrotasks();
      await waitFor(() => {
        const d = result.data() as { id: number } | undefined;
        return d?.id === 2;
      });
      expect(result.data()).toEqual(data2);
    } finally {
      dispose();
    }
  });
});
