import {
  Accessor,
  Resource,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js';

// Free imports from @exowpee/solidly
import { getCacheRow, insertOrUpdateCacheRow } from '@exowpee/solidly/helpers';

// Pro imports
import {
  CustomResourceContext,
  CustomResourceContextValue,
  ResourceOptions,
} from '../context/CustomResourceContext';

/** Maximum random jitter added to retry delays to prevent thundering herd (in ms) */
const RETRY_JITTER_MAX = 500;

/**
 * Return type for the useCustomResource hook.
 * Contains reactive accessors for data state and control methods.
 * @template T - The type of data being fetched
 */
export interface CustomResource<T> {
  /** Accessor for the fetched data, undefined until loaded */
  data: Accessor<T | undefined>;
  /** Accessor for any fetch error, null when no error */
  error: Accessor<Error | null>;
  /** True during initial load (false when using SWR with cached data) */
  loading: Accessor<boolean>;
  /** True when revalidating in background (SWR pattern) */
  validating: Accessor<boolean>;
  /** Current resource state: "unresolved" | "pending" | "ready" | "errored" | "refreshing" */
  state: Accessor<Resource<T>['state']>;
  /** Latest successful data, persists through errors */
  latest: Accessor<T | undefined>;
  /** Manually trigger a refetch, resets retry attempts */
  refetch: () => void;
  /** True if current data came from cache */
  fromCache: Accessor<boolean>;
  /** HTTP status code of the error response, if applicable */
  errorStatus: Accessor<number | undefined>;
  /** Manually set error status (useful for custom error handling) */
  setErrorStatus: (status: number | undefined) => void;
  /** Current retry attempt count (0-based) */
  attempts: Accessor<number>;
}

/**
 * Configuration props for the useCustomResource hook.
 * @template T - The type of data being fetched
 */
export interface CustomResourceProps<T> {
  /** Reactive accessor returning the URL to fetch. Changes trigger a new fetch. */
  urlString: Accessor<string>;
  /** Per-resource options that override context defaults */
  options?: ResourceOptions<T>;
  /** Key for coordinated refresh via context.refreshData */
  refreshKey?: string;
  /** Reactive condition that must be true for fetch to execute */
  condition?: Accessor<boolean>;
  /** When true, bypasses cache and forces fresh fetch */
  forceRefresh?: Accessor<boolean>;
  /** Whether to check IndexedDB cache. Default: true */
  pullFromCache?: boolean;
  /** Enable stale-while-revalidate pattern. Default: true */
  swr?: boolean;
}

/**
 * Custom resource hook implementing SWR pattern with caching and retry logic.
 *
 * Features:
 * - Stale-while-revalidate (SWR) caching pattern
 * - Automatic retries with exponential backoff
 * - Request deduplication
 * - IndexedDB persistence
 * - Conditional fetching
 *
 * @template T - The type of data being fetched
 * @param props - Hook configuration options
 * @returns CustomResource object with data accessors and control methods
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCustomResource<User>({
 *   urlString: () => `/api/users/${userId()}`,
 *   condition: () => !!userId(),
 *   refreshKey: 'user',
 * });
 * ```
 */
export function useCustomResource<T>(props: CustomResourceProps<T>): CustomResource<T> {
  const [error, setError] = createSignal<Error | null>(null);
  const [fromCache, setFromCache] = createSignal(false);
  const [errorStatus, setErrorStatus] = createSignal<number | undefined>(undefined);
  const [attempts, setAttempts] = createSignal(0);
  const [resourceData, setResourceData] = createSignal<T | undefined>(undefined);
  const [validating, setValidating] = createSignal(false);

  const pullFromCache = createMemo(() => props.pullFromCache ?? true);
  const swr = createMemo(() => props.swr ?? true);

  const context = useContext(CustomResourceContext) as
    | CustomResourceContextValue<T>
    | undefined;
  if (!context) {
    throw new Error('useCustomResource must be used within a CustomResourceProvider');
  }

  const urlString = () =>
    context.baseUrl ? context.baseUrl + props.urlString() : props.urlString();

  const mergedOptions: ResourceOptions<T> = {
    get retryCount() {
      return props.options?.retryCount ?? context.options.retryCount;
    },
    get retryDelay() {
      return props.options?.retryDelay ?? context.options.retryDelay;
    },
    get exponentialBackoff() {
      return props.options?.exponentialBackoff ?? context.options.exponentialBackoff;
    },
    get errorsBlackList() {
      return props.options?.errorsBlackList ?? context.options.errorsBlackList;
    },
    get dedupeRequests() {
      return props.options?.dedupeRequests ?? context.options.dedupeRequests;
    },
    get dedupeInterval() {
      return props.options?.dedupeInterval ?? context.options.dedupeInterval;
    },
    get fetcher() {
      return props.options?.fetcher ?? context.options.fetcher;
    },
    get onSuccess() {
      return props.options?.onSuccess ?? context.options.onSuccess;
    },
    get onError() {
      return props.options?.onError ?? context.options.onError;
    },
  };

  const retryTimers = new Set<number>();

  const defaultFetcher = async (url: string): Promise<T> => {
    const res = await fetch(url);
    const data = (await res.json()) as T;
    if (!res.ok) {
      setErrorStatus(res.status);
      throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
    }
    return data;
  };

  const wrappedFetcher = async ({
    url,
    swr,
  }: {
    url: string;
    swr?: boolean;
  }): Promise<T | null> => {
    if (!url) return null;
    if (swr) {
      setValidating(true);
    }
    const options = mergedOptions;
    const pendingRequests = context.pendingRequests;
    const fetcher = options?.fetcher ?? defaultFetcher;
    const fetchPromiseCallback = async (data: T) => {
      setFromCache(false);
      setErrorStatus(undefined);
      setAttempts(0);
      clearAllRetryTimers();
      options?.onSuccess?.(data, false);
      setResourceData(() => data);
      setValidating(false);
      await insertOrUpdateCacheRow(url, data);
      return data;
    };

    const fetchPromise = async () => {
      const data = await fetcher(url);
      return data;
    };

    if (options?.dedupeRequests) {
      let entry = pendingRequests.get(url);

      if (entry?.resolvedAt && Date.now() - entry.resolvedAt >= options.dedupeInterval!) {
        if (entry.timeoutId) {
          clearTimeout(entry.timeoutId);
        }
        pendingRequests.delete(url);
        entry = undefined;
      }

      if (
        entry?.lastValue !== undefined &&
        entry?.resolvedAt &&
        Date.now() - entry.resolvedAt < options.dedupeInterval!
      ) {
        return fetchPromiseCallback(entry.lastValue);
      }

      let promiseReturn: Promise<T>;

      if (entry?.promise) {
        promiseReturn = entry.promise;
      } else {
        promiseReturn = fetchPromise().then((data) => {
          const timeOut = setTimeout(() => {
            pendingRequests.delete(url);
          }, options.dedupeInterval);

          pendingRequests.set(url, {
            promise: null,
            lastValue: data,
            resolvedAt: Date.now(),
            timeoutId: timeOut,
          });

          return data;
        });

        pendingRequests.set(url, {
          promise: promiseReturn,
        });
      }

      return promiseReturn.then((data) => fetchPromiseCallback(data));
    }

    return fetchPromise().then((data) => fetchPromiseCallback(data));
  };

  const clearAllRetryTimers = () => {
    retryTimers.forEach((timer) => clearTimeout(timer));
    retryTimers.clear();
  };

  const [shouldFetch, { refetch: shouldRefetch }] = createResource(
    () => ({
      url: urlString(),
      forceRefresh: props.forceRefresh?.(),
      condition: props.condition?.(),
      key: props.refreshKey,
      pullFromCache: pullFromCache(),
    }),
    async ({ url, forceRefresh, condition, key, pullFromCache }) => {
      if (!url) return undefined;

      if (!context.refreshData?.()) return true;

      if (forceRefresh) return true;

      if (condition === false) return false;

      const cacheData = pullFromCache ? await getCacheRow(url) : null;
      const needsFetch = key ? context.refreshData?.()[key] !== false : true;

      return needsFetch || !cacheData;
    },
  );

  createEffect(() => {
    const refresh = context.refreshData?.();
    if (refresh) void shouldRefetch();
  });

  const [resource, { refetch: originalRefetch }] = createResource(
    () => ({
      url: shouldFetch() ? urlString() : '',
      swr: swr(),
    }),
    wrappedFetcher,
  );

  createResource(
    () => (((shouldFetch() === false && pullFromCache()) || swr()) && urlString()) || '',
    async (url) => {
      if (!url) return undefined;
      const cached = (await getCacheRow(url)) as T | null;
      if (cached) {
        setFromCache(true);
        setErrorStatus(undefined);
        mergedOptions?.onSuccess?.(cached, true);
        setResourceData(() => cached);
        return cached;
      }
    },
  );

  createEffect(() => {
    if (
      resource.error &&
      errorStatus() &&
      !mergedOptions.errorsBlackList?.includes(errorStatus()!)
    ) {
      const currentAttempts = attempts();
      if (currentAttempts < mergedOptions.retryCount!) {
        // Calculate delay with exponential backoff and random jitter
        const baseDelay = mergedOptions.retryDelay ?? 2000;
        const delay = mergedOptions.exponentialBackoff
          ? baseDelay * Math.pow(2, currentAttempts) + Math.random() * RETRY_JITTER_MAX
          : baseDelay;

        const newAttempts = currentAttempts + 1;
        setAttempts(newAttempts);

        const timer = window.setTimeout(() => {
          retryTimers.delete(timer);
          void originalRefetch();
        }, delay);

        retryTimers.add(timer);
      }
    }
  });

  createEffect(() => {
    if (resource.error) {
      const err =
        resource.error instanceof Error
          ? resource.error
          : new Error(String(resource.error));
      setError(err);
      mergedOptions.onError?.(err);
      setValidating(false);
    }
  });

  createEffect(() => {
    if (resource() && error()) {
      setError(null);
    }
  });

  onCleanup(() => {
    clearAllRetryTimers();
  });

  const refetch = () => {
    setAttempts(0);
    void originalRefetch();
  };

  return {
    data: () => resourceData(),
    error,
    errorStatus,
    setErrorStatus,
    attempts,
    loading: () => (swr() ? false : resource.loading),
    state: () => resource.state,
    latest: () => resource.latest ?? undefined,
    refetch,
    fromCache,
    validating,
  };
}
