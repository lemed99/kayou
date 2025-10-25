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

import {
  CustomResourceContext,
  PendingEntry,
  ResourceOptions,
} from '../context/CustomResourceContext';
import { getCacheRow, insertOrUpdateCacheRow } from '../helpers/indexedDB';

export interface CustomResource<T> {
  data: Accessor<T | undefined>;
  error: Accessor<unknown>;
  loading: Accessor<boolean>;
  validating: Accessor<boolean>;
  state: Accessor<Resource<T>['state']>;
  latest: Accessor<T | undefined>;
  refetch: () => void;
  fromCache: Accessor<boolean>;
  errorStatus: Accessor<number | undefined>;
  setErrorStatus: (status: number | undefined) => void;
  attempts: Accessor<number>;
}

export interface CustomResourceContextProps<T> {
  options: ResourceOptions<T>;
  pendingRequests: Map<string, PendingEntry<T>>;
  refreshData: Record<string, boolean> | null;
  baseUrl: string;
}

export interface CustomResourceProps<T> {
  urlString: Accessor<string>;
  options?: ResourceOptions<T>;
  refreshKey?: string;
  condition?: Accessor<boolean>;
  forceRefresh?: Accessor<boolean>;
  pullFromCache?: boolean;
  swr?: boolean;
}

export function useCustomResource<T>(props: CustomResourceProps<T>): CustomResource<T> {
  const [error, setError] = createSignal<unknown>(null);
  const [fromCache, setFromCache] = createSignal(false);
  const [errorStatus, setErrorStatus] = createSignal<number>();
  const [attempts, setAttempts] = createSignal(0);
  const [resourceData, setResourceData] = createSignal<T>();
  const [validating, setValidating] = createSignal(false);

  const pullFromCache = createMemo(() => props.pullFromCache ?? true);
  const swr = createMemo(() => props.swr ?? true);

  const context = useContext(CustomResourceContext) as CustomResourceContextProps<T>;
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
    options,
    pendingRequests,
    swr,
  }: {
    url: string;
    options?: ResourceOptions<T>;
    pendingRequests: Map<string, PendingEntry<T>>;
    swr?: boolean;
  }): Promise<T | null> => {
    if (!url) return null;
    if (swr) {
      setValidating(true);
    }
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

  const [shouldFetch] = createResource(
    () => ({
      refreshData: context.refreshData,
      url: urlString(),
      forceRefresh: props.forceRefresh?.(),
      condition: props.condition?.(),
      key: props.refreshKey,
      pullFromCache: pullFromCache(),
    }),
    async ({ refreshData, url, forceRefresh, condition, key, pullFromCache }) => {
      if (!url) return undefined;

      if (!refreshData) return true;

      if (forceRefresh) return true;

      if (condition === false) return false;

      const cacheData = pullFromCache ? await getCacheRow(url) : null;
      const needsFetch = key ? refreshData[key] === true : true;

      return needsFetch || !cacheData;
    },
  );

  const [resource, { refetch: originalRefetch }] = createResource(
    () => ({
      url: shouldFetch() ? urlString() : '',
      options: mergedOptions,
      pendingRequests: context.pendingRequests,
      swr: swr(),
    }),
    wrappedFetcher,
  );

  createResource(
    () => ({
      url: (((shouldFetch() === false && pullFromCache()) || swr()) && urlString()) || '',
      onSuccess: mergedOptions?.onSuccess,
    }),
    async ({ url, onSuccess }) => {
      if (!url) return undefined;
      const cached = (await getCacheRow(url)) as T | null;
      if (cached) {
        setFromCache(true);
        setErrorStatus(undefined);
        onSuccess?.(cached, true);
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
        const delay = mergedOptions.exponentialBackoff
          ? (mergedOptions.retryDelay ?? 2000) * Math.pow(2, currentAttempts) +
            Math.random() * 500
          : (mergedOptions.retryDelay ?? 2000);

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
      setError(resource.error);
      mergedOptions.onError?.(resource.error);
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
