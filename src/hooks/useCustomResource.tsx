import {
  Accessor,
  ParentComponent,
  Resource,
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js';

import { getCacheRow, insertOrUpdateCacheRow } from '../helpers/indexedDB';

interface CustomError {
  message: string;
  status?: number;
  code?: string;
}

interface ResourceOptions<T> {
  fetcher?: (url: string) => Promise<T>;
  onSuccess?: (data: T, fromCache: boolean) => void;
  onError?: (err: CustomError) => void;
  retryCount?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  errorsBlackList?: number[];
  dedupeRequests?: boolean;
  dedupeInterval?: number;
}

interface ProviderProps<T> extends ResourceOptions<T> {
  pendingRequests: Map<string, PendingEntry<T>>;
  refreshData: Record<string, boolean> | null;
}

interface CustomResource<T> {
  data: Accessor<T | undefined>;
  error: Accessor<CustomError | null>;
  loading: Accessor<boolean>;
  state: Accessor<Resource<T>['state']>;
  latest: Accessor<T | undefined>;
  refetch: () => void;
  fromCache: Accessor<boolean>;
  errorStatus: Accessor<number | undefined>;
  setErrorStatus: (status: number | undefined) => void;
  attempts: Accessor<number>;
}

interface CustomResourceProps<T> {
  options: ResourceOptions<T>;
  pendingRequests: Map<string, PendingEntry<T>>;
  refreshData: Record<string, boolean> | null;
}

type PendingEntry<T> = {
  promise: Promise<T> | null;
  lastValue?: T;
  resolvedAt?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
};

const CustomResourceContext = createContext();

export const CustomResourceProvider: ParentComponent<ProviderProps<unknown>> = (
  props,
) => {
  const pendingRequests = new Map<string, PendingEntry<unknown>>();
  const options: ResourceOptions<unknown> = {
    get retryCount() {
      return props.retryCount ?? 3;
    },
    get retryDelay() {
      return props.retryDelay ?? 2000;
    },
    get exponentialBackoff() {
      return props.exponentialBackoff ?? true;
    },
    get errorsBlackList() {
      return props.errorsBlackList ?? [404, 500, 400, 401, 403];
    },
    get dedupeRequests() {
      return props.dedupeRequests ?? true;
    },
    get dedupeInterval() {
      return props.dedupeInterval ?? 2000;
    },
    get fetcher() {
      return props.fetcher;
    },
    get onSuccess() {
      return props.onSuccess;
    },
    get onError() {
      return props.onError;
    },
  };

  return (
    <CustomResourceContext.Provider
      value={{
        options,
        pendingRequests,
        get refreshData() {
          return props.refreshData;
        },
      }}
    >
      {props.children}
    </CustomResourceContext.Provider>
  );
};

export function useCustomResource<T>(props: {
  options: ResourceOptions<T>;
  urlString: string;
  refreshKey?: string;
  condition?: boolean;
  forceRefresh?: boolean;
  pullFromCache?: boolean;
}): CustomResource<T> {
  const [error, setError] = createSignal<CustomError | null>(null);
  const [fromCache, setFromCache] = createSignal(false);
  const [errorStatus, setErrorStatus] = createSignal<number>();
  const [attempts, setAttempts] = createSignal(0);
  const [resourceData, setResourceData] = createSignal<T>();

  const pullFromCache = createMemo(() => props.pullFromCache ?? true);

  const context = useContext(CustomResourceContext) as CustomResourceProps<T>;
  if (!context) {
    throw new Error('useCustomResource must be used within a CustomResourceProvider');
  }

  const mergedOptions: ResourceOptions<T> = {
    get retryCount() {
      return props.options.retryCount ?? context.options.retryCount;
    },
    get retryDelay() {
      return props.options.retryDelay ?? context.options.retryDelay;
    },
    get exponentialBackoff() {
      return props.options.exponentialBackoff ?? context.options.exponentialBackoff;
    },
    get errorsBlackList() {
      return props.options.errorsBlackList ?? context.options.errorsBlackList;
    },
    get dedupeRequests() {
      return props.options.dedupeRequests ?? context.options.dedupeRequests;
    },
    get dedupeInterval() {
      return props.options.dedupeInterval ?? context.options.dedupeInterval;
    },
    get fetcher() {
      return props.options.fetcher ?? context.options.fetcher;
    },
    get onSuccess() {
      return props.options.onSuccess ?? context.options.onSuccess;
    },
    get onError() {
      return props.options.onError ?? context.options.onError;
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
  }: {
    url: string;
    options?: ResourceOptions<T>;
    pendingRequests: Map<string, PendingEntry<T>>;
  }): Promise<T> => {
    const fetcher = options?.fetcher ?? defaultFetcher;
    const fetchPromiseCallback = async (data: T) => {
      setFromCache(false);
      setErrorStatus(undefined);
      setAttempts(0);
      clearAllRetryTimers();
      options?.onSuccess?.(data, false);
      setResourceData(() => data);
      await insertOrUpdateCacheRow(url, data);
    };

    if (options?.dedupeRequests && pendingRequests.has(url)) {
      const entry = pendingRequests.get(url);
      if (entry?.timeoutId) {
        clearTimeout(entry.timeoutId);
      }
      if (
        entry?.lastValue !== undefined &&
        entry.resolvedAt &&
        Date.now() - entry.resolvedAt < options.dedupeInterval!
      ) {
        return Promise.resolve(entry.lastValue as T);
      }
      return entry?.promise as Promise<T>;
    }

    const fetchPromise = (async () => {
      const data = await fetcher(url);
      await fetchPromiseCallback(data);
      if (options?.dedupeRequests) {
        pendingRequests.set(url, {
          promise: null,
          lastValue: data,
          resolvedAt: Date.now(),
        });
      }
      return data;
    })();

    if (options?.dedupeRequests) {
      const timeOut = setTimeout(() => {
        const entry = pendingRequests.get(url);
        if (
          entry &&
          entry.resolvedAt &&
          Date.now() - entry.resolvedAt >= options.dedupeInterval!
        ) {
          pendingRequests.delete(url);
        }
      }, options.dedupeInterval);
      pendingRequests.set(url, { promise: fetchPromise, timeoutId: timeOut });
    }

    return fetchPromise;
  };

  const clearAllRetryTimers = () => {
    retryTimers.forEach((timer) => clearTimeout(timer));
    retryTimers.clear();
  };

  const [shouldFetch] = createResource(
    () => ({
      refreshData: context.refreshData,
      url: props.urlString,
      forceRefresh: props.forceRefresh,
      condition: props.condition,
      key: props.refreshKey,
      pullFromCache: pullFromCache(),
    }),
    async ({ refreshData, url, forceRefresh, condition, key, pullFromCache }) => {
      if (!url) return false;

      if (forceRefresh) return true;

      if (condition === false) return false;

      const cacheData = pullFromCache ? await getCacheRow(url) : null;
      const needsFetch = key ? refreshData?.[key] === true : true;

      return needsFetch || !cacheData;
    },
  );

  const [resource, { refetch: originalRefetch }] = createResource(
    () => ({
      url: shouldFetch() ? props.urlString : '',
      options: mergedOptions,
      pendingRequests: context.pendingRequests,
    }),
    wrappedFetcher,
  );

  createResource(
    () => ({
      url: (!shouldFetch() && pullFromCache() && props.urlString) || '',
      onSuccess: mergedOptions?.onSuccess,
    }),
    async ({ url, onSuccess }) => {
      const cached = (await getCacheRow(url)) as T | null;
      if (cached) {
        setFromCache(true);
        setErrorStatus(undefined);
        onSuccess?.(cached, true);
        setResourceData(() => cached);
        return cached;
      }
      return undefined;
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

  const parseError = (error: unknown): CustomError => {
    if (typeof error === 'string') {
      try {
        return JSON.parse(error) as CustomError;
      } catch {
        return { message: error };
      }
    }
    return { message: String(error) };
  };

  createEffect(() => {
    if (resource.error) {
      const parsedError = parseError(resource.error);
      setError(parsedError);
      mergedOptions.onError?.(parsedError);
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
    loading: () => resource.loading,
    state: () => resource.state,
    latest: () => resource.latest,
    refetch,
    fromCache,
  };
}
