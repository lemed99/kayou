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

import { CustomResourceContext, ResourceOptions } from '../context';
import { getCacheRow, insertOrUpdateCacheRow } from '../helpers';

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
 * Extracts and returns the HTTP status code from an error object, if available.
 *
 * @param error - The error object to check for a status property.
 * @returns The status code as a number if present, otherwise undefined.
 */
function getErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number'
  ) {
    return (error as { status: number }).status;
  }
  return undefined;
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
  let resourceDataUrl: string | null = null;

  let abortController = new AbortController();

  const pullFromCache = createMemo(() => props.pullFromCache ?? true);
  const swr = createMemo(() => props.swr ?? true);

  const context = useContext(CustomResourceContext);
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
      return (props.options?.fetcher ??
        context.options.fetcher) as ResourceOptions<T>['fetcher'];
    },
    get onSuccess() {
      return props.options?.onSuccess ?? context.options.onSuccess;
    },
    get onError() {
      return props.options?.onError ?? context.options.onError;
    },
    get cacheValidator() {
      return props.options?.cacheValidator ?? context.options.cacheValidator;
    },
  };

  const retryTimers = new Set<number>();
  let instanceRequestSeq = 0;
  let forceFreshNextFetch = false;

  const incrementInstanceRequestSeq = () => {
    instanceRequestSeq += 1;
    return instanceRequestSeq;
  };

  const isCurrentInstanceRequest = (seq: number) => instanceRequestSeq === seq;
  const getNoopResult = () => resourceData() as T | null;

  const defaultFetcher = async (url: string): Promise<T> => {
    const res = await fetch(url, { signal: abortController.signal });
    if (!res.ok) {
      setErrorStatus(res.status);
      let message: string;
      try {
        const body: unknown = await res.json();
        message = typeof body === 'string' ? body : JSON.stringify(body);
      } catch {
        message = res.statusText || `HTTP ${res.status}`;
      }
      throw new Error(message);
    }
    return (await res.json()) as T;
  };

  const wrappedFetcher = async ({
    url,
    swr,
  }: {
    url: string;
    swr?: boolean;
  }): Promise<T | null> => {
    const shouldBypassDedupeReuse = forceFreshNextFetch;
    forceFreshNextFetch = false;
    if (!url) {
      setValidating(false);
      return getNoopResult();
    }
    const requestSeq = incrementInstanceRequestSeq();
    if (swr) {
      setValidating(true);
    }
    try {
      const options = mergedOptions;
      const pendingRequests = context.pendingRequests;
      const fetcher = options?.fetcher ?? defaultFetcher;
      const fetchPromiseCallback = async (data: T) => {
        if (!isCurrentInstanceRequest(requestSeq)) {
          return data;
        }
        setFromCache(false);
        setErrorStatus(undefined);
        setError(null);
        setAttempts(0);
        clearAllRetryTimers();
        options?.onSuccess?.(data, false);
        setResourceData(() => data);
        resourceDataUrl = url;
        const previousCommittedVersion = context.networkVersionByUrl.get(url) ?? 0;
        const currentAnnouncedVersion =
          context.nextNetworkVersionByUrl.get(url) ?? previousCommittedVersion;
        const nextNetworkVersion = currentAnnouncedVersion + 1;
        const nextCacheReadGuardVersion =
          (context.cacheReadGuardVersionByUrl.get(url) ?? 0) + 1;
        context.cacheReadGuardVersionByUrl.set(url, nextCacheReadGuardVersion);
        context.nextNetworkVersionByUrl.set(url, nextNetworkVersion);
        setValidating(false);
        try {
          await insertOrUpdateCacheRow(url, data);
          const currentCommittedVersion = context.networkVersionByUrl.get(url) ?? 0;
          if (nextNetworkVersion > currentCommittedVersion) {
            context.networkVersionByUrl.set(url, nextNetworkVersion);
          }
        } catch (cacheWriteError) {
          const failedWriteGuardVersion =
            (context.cacheReadGuardVersionByUrl.get(url) ?? 0) + 1;
          context.cacheReadGuardVersionByUrl.set(url, failedWriteGuardVersion);
          if ((context.nextNetworkVersionByUrl.get(url) ?? 0) === nextNetworkVersion) {
            context.nextNetworkVersionByUrl.set(url, previousCommittedVersion);
          }
          void cacheWriteError;
        }
        return data;
      };

      const fetchPromise = async () => {
        const data = await fetcher(url);
        return data;
      };

      if (options?.dedupeRequests) {
        let entry = pendingRequests.get(url);

        if (
          entry?.resolvedAt &&
          Date.now() - entry.resolvedAt >= options.dedupeInterval!
        ) {
          if (entry.timeoutId) {
            clearTimeout(entry.timeoutId);
          }
          pendingRequests.delete(url);
          entry = undefined;
        }

        if (
          !shouldBypassDedupeReuse &&
          entry?.lastValue !== undefined &&
          entry?.resolvedAt &&
          Date.now() - entry.resolvedAt < options.dedupeInterval!
        ) {
          return await fetchPromiseCallback(entry.lastValue as T);
        }

        let promiseReturn: Promise<T>;

        if (entry?.promise && !shouldBypassDedupeReuse) {
          promiseReturn = entry.promise as Promise<T>;
        } else {
          promiseReturn = fetchPromise().then(
            (data) => {
              if (pendingRequests.get(url)?.promise !== promiseReturn) {
                return data;
              }
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
            },
            (error) => {
              // If in-flight request fails, clear dedupe entry so next refetch can
              // issue a new network request instead of reusing a stale rejected promise.
              if (pendingRequests.get(url)?.promise === promiseReturn) {
                pendingRequests.delete(url);
              }
              throw error;
            },
          );

          pendingRequests.set(url, {
            promise: promiseReturn,
          });
        }

        return await promiseReturn.then(async (data) => {
          if (!isCurrentInstanceRequest(requestSeq)) {
            return getNoopResult();
          }
          return await fetchPromiseCallback(data);
        });
      }

      const data = await fetchPromise();
      if (!isCurrentInstanceRequest(requestSeq)) {
        return getNoopResult();
      }
      return await fetchPromiseCallback(data);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        if (isCurrentInstanceRequest(requestSeq)) {
          setValidating(false);
        }
        return getNoopResult();
      }
      if (!isCurrentInstanceRequest(requestSeq)) {
        return getNoopResult();
      }
      const err = e instanceof Error ? e : new Error(String(e));
      const extractedStatus = getErrorStatus(e);
      if (extractedStatus !== undefined) {
        setErrorStatus(extractedStatus);
      }
      setError(err);
      mergedOptions.onError?.(err);
      setValidating(false);
      return getNoopResult();
    }
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
      try {
        if (!url) return undefined;

        if (condition === false) return false;

        if (!context.refreshData?.()) return true;

        if (forceRefresh) return true;

        const cacheData = pullFromCache
          ? await getCacheRow(url, mergedOptions.cacheValidator)
          : null;
        const needsFetch = key ? context.refreshData?.()[key] !== false : true;

        return needsFetch || !cacheData;
      } catch {
        return true;
      }
    },
  );

  createEffect(() => {
    const refresh = context.refreshData?.();
    if (refresh) void shouldRefetch();
  });

  const [resource, { refetch: originalRefetch }] = createResource(
    () => ({
      url: props.condition?.() !== false && shouldFetch() ? urlString() : '',
      swr: swr(),
    }),
    wrappedFetcher,
  );

  createResource(
    () =>
      (props.condition?.() !== false &&
        ((shouldFetch() === false && pullFromCache()) || swr()) &&
        urlString()) ||
      '',
    async (url) => {
      try {
        if (!url) return undefined;
        const cacheReadSeq = instanceRequestSeq;
        const snapshotCacheReadGuardVersion =
          context.cacheReadGuardVersionByUrl.get(url) ?? 0;
        const snapshotCommittedVersion = context.networkVersionByUrl.get(url) ?? 0;
        const cached = (await getCacheRow(url, mergedOptions.cacheValidator)) as T | null;
        if (cached) {
          if (!isCurrentInstanceRequest(cacheReadSeq)) {
            return cached;
          }
          const currentCacheReadGuardVersion =
            context.cacheReadGuardVersionByUrl.get(url) ?? 0;
          if (currentCacheReadGuardVersion > snapshotCacheReadGuardVersion) {
            return cached;
          }
          const currentAnnouncedVersion =
            context.nextNetworkVersionByUrl.get(url) ??
            context.networkVersionByUrl.get(url) ??
            0;
          if (currentAnnouncedVersion > snapshotCommittedVersion) {
            return cached;
          }
          if (resourceDataUrl === url && resourceData() !== undefined && !fromCache()) {
            return cached;
          }
          setFromCache(true);
          setErrorStatus(undefined);
          mergedOptions?.onSuccess?.(cached, true);
          setResourceData(() => cached);
          resourceDataUrl = url;
          return cached;
        }
      } catch {
        return undefined;
      }
    },
  );

  createEffect(() => {
    const currentError = error();
    if (
      currentError &&
      (errorStatus() === undefined ||
        !mergedOptions.errorsBlackList?.includes(errorStatus()!))
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

  // Abort in-flight requests when condition transitions true → false.
  // prev tracks the previous value so we don't abort on initial mount.
  createEffect((prev: boolean | undefined) => {
    const condition = props.condition?.() !== false;
    if (prev === true && condition === false) {
      abortController.abort();
      abortController = new AbortController();
      setValidating(false);
    }
    return condition;
  });

  onCleanup(() => {
    clearAllRetryTimers();
    abortController.abort();
  });

  const refetch = () => {
    const currentUrl = urlString();
    const canFetchNow = Boolean(currentUrl) && props.condition?.() !== false;
    forceFreshNextFetch = canFetchNow;
    incrementInstanceRequestSeq();
    setValidating(false);
    abortController.abort();
    abortController = new AbortController();
    setError(null);
    setErrorStatus(undefined);
    setAttempts(0);
    void originalRefetch();
  };

  return {
    data: () => resourceData(),
    error,
    errorStatus,
    setErrorStatus,
    attempts,
    loading: () =>
      swr() ? resourceData() === undefined && resource.loading : resource.loading,
    state: () => resource.state,
    latest: () => resourceData() ?? resource.latest ?? undefined,
    refetch,
    fromCache,
    validating,
  };
}
