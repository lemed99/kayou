import { type Accessor, createRoot, createSignal } from 'solid-js';

import { vi } from 'vitest';

import { CustomResourceProvider } from '../../context/CustomResourceContext';
import type { ResourceOptions } from '../../context/CustomResourceContext';
import {
  type CustomResource,
  type CustomResourceProps,
  useCustomResource,
} from '../../hooks/useCustomResource';

export interface TestProviderOptions {
  refreshData?: Accessor<Record<string, boolean>> | null;
  baseUrl?: string;
  retryCount?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  errorsBlackList?: number[];
  dedupeRequests?: boolean;
  dedupeInterval?: number;
  fetcher?: ResourceOptions<unknown>['fetcher'];
  onSuccess?: ResourceOptions<unknown>['onSuccess'];
  onError?: ResourceOptions<unknown>['onError'];
  cacheValidator?: ResourceOptions<unknown>['cacheValidator'];
}

/**
 * Creates a useCustomResource instance inside a reactive root with a provider.
 * Returns the hook result plus a dispose function for cleanup.
 */
export function createTestResource<T>(
  hookProps: CustomResourceProps<T>,
  providerOpts: TestProviderOptions = {},
): { result: CustomResource<T>; dispose: () => void } {
  let result!: CustomResource<T>;
  let dispose!: () => void;

  const defaultRefreshData = createSignal<Record<string, boolean>>({});
  const refreshData = providerOpts.refreshData ?? defaultRefreshData[0];

  createRoot((d) => {
    dispose = d;

    const Wrapper = () => {
      result = useCustomResource<T>(hookProps);
      return null;
    };

    return (
      <CustomResourceProvider
        refreshData={refreshData}
        baseUrl={providerOpts.baseUrl}
        retryCount={providerOpts.retryCount}
        retryDelay={providerOpts.retryDelay}
        exponentialBackoff={providerOpts.exponentialBackoff}
        errorsBlackList={providerOpts.errorsBlackList}
        dedupeRequests={providerOpts.dedupeRequests}
        dedupeInterval={providerOpts.dedupeInterval}
        fetcher={providerOpts.fetcher}
        onSuccess={providerOpts.onSuccess}
        onError={providerOpts.onError}
        cacheValidator={providerOpts.cacheValidator}
      >
        <Wrapper />
      </CustomResourceProvider>
    );
  });

  return { result, dispose };
}

/**
 * Flushes all pending microtasks.
 */
export function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}

/**
 * Waits for a condition to become true, flushing microtasks and advancing timers.
 */
export async function waitFor(
  predicate: () => boolean,
  { timeout = 5000, interval = 10 } = {},
): Promise<void> {
  const start = Date.now();
  while (!predicate()) {
    if (Date.now() - start > timeout) {
      throw new Error(`waitFor timed out after ${timeout}ms`);
    }
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(interval);
  }
}

/**
 * Creates a mock fetch that returns a successful JSON response.
 */
export function mockFetchSuccess<T>(data: T, delay = 0) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              status: 200,
              json: () => Promise.resolve(data),
            }),
          delay,
        ),
      ),
  ) as unknown as typeof globalThis.fetch;
}

/**
 * Creates a mock fetch that returns an error response.
 */
export function mockFetchError(status: number, body: unknown = { message: 'Error' }) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    statusText: `HTTP ${status}`,
    json: () => Promise.resolve(body),
  }) as unknown as typeof globalThis.fetch;
}

/**
 * Creates a mock fetch that rejects (network error).
 */
export function mockFetchNetworkError() {
  return vi
    .fn()
    .mockRejectedValue(
      new TypeError('Failed to fetch'),
    ) as unknown as typeof globalThis.fetch;
}
