import { Accessor, ParentComponent, createContext, onCleanup } from 'solid-js';

/**
 * Configuration options for resource fetching behavior.
 * Can be set globally via CustomResourceProvider or per-hook via useCustomResource.
 * @template T - The type of data being fetched
 */
export interface ResourceOptions<T> {
  /** Custom fetcher function. Defaults to fetch with JSON parsing. */
  fetcher?: (url: string) => Promise<T>;
  /** Callback invoked on successful fetch. Receives data and cache flag. */
  onSuccess?: (data: T, fromCache: boolean) => void;
  /** Callback invoked on fetch error. */
  onError?: (err: Error | null) => void;
  /** Maximum number of retry attempts. Default: 3 */
  retryCount?: number;
  /** Base delay in ms between retries. Default: 2000 */
  retryDelay?: number;
  /** Whether to use exponential backoff for retries. Default: true */
  exponentialBackoff?: boolean;
  /**
   * HTTP status codes that should NOT trigger retries.
   * Default: [404, 500, 400, 401, 403]
   * 500 is included because it indicates processing errors, not transient issues.
   */
  errorsBlackList?: number[];
  /** Whether to deduplicate concurrent requests to the same URL. Default: true */
  dedupeRequests?: boolean;
  /** Time in ms to cache responses for deduplication. Default: 2000 */
  dedupeInterval?: number;
  /** Custom validator for cached data. Return true if the data is valid. Defaults to built-in validation that rejects strings, empty objects, and falsy values. */
  cacheValidator?: (data: unknown) => boolean;
}

/**
 * Props for the CustomResourceProvider component.
 * @template T - The type of data being fetched
 */
export interface CustomResourceProviderProps<T> extends ResourceOptions<T> {
  /** Reactive signal containing refresh keys. When keys change, associated resources refetch. */
  refreshData: Accessor<Record<string, boolean>> | null;
  /** Base URL to prepend to all resource URLs. Trailing slashes are automatically removed. */
  baseUrl?: string;
}

/**
 * Internal entry for tracking pending/cached requests.
 * @template T - The type of data being fetched
 */
export interface PendingEntry<T> {
  promise: Promise<T> | null;
  lastValue?: T;
  resolvedAt?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

/**
 * Type for the CustomResourceContext value.
 * @template T - The type of data being fetched
 */
export interface CustomResourceContextValue<T = unknown> {
  options: ResourceOptions<T>;
  pendingRequests: Map<string, PendingEntry<T>>;
  networkVersionByUrl: Map<string, number>;
  nextNetworkVersionByUrl: Map<string, number>;
  cacheReadGuardVersionByUrl: Map<string, number>;
  refreshData: Accessor<Record<string, boolean>> | null;
  baseUrl: string | undefined;
}

/**
 * Context for configuring useCustomResource behavior globally.
 * Provides default options that can be overridden per-hook.
 */
export const CustomResourceContext = createContext<CustomResourceContextValue>();

/**
 * Provider component for CustomResource configuration.
 * Wraps your application to provide global fetch settings to all useCustomResource hooks.
 *
 * @example
 * ```tsx
 * <CustomResourceProvider
 *   baseUrl="https://api.example.com"
 *   retryCount={3}
 *   dedupeInterval={5000}
 *   refreshData={refreshSignal}
 * >
 *   <App />
 * </CustomResourceProvider>
 * ```
 */
export const CustomResourceProvider: ParentComponent<
  CustomResourceProviderProps<unknown>
> = (props) => {
  const pendingRequests = new Map<string, PendingEntry<unknown>>();
  const networkVersionByUrl = new Map<string, number>();
  const nextNetworkVersionByUrl = new Map<string, number>();
  const cacheReadGuardVersionByUrl = new Map<string, number>();

  onCleanup(() => {
    for (const entry of pendingRequests.values()) {
      if (entry.timeoutId) clearTimeout(entry.timeoutId);
    }
    pendingRequests.clear();
    networkVersionByUrl.clear();
    nextNetworkVersionByUrl.clear();
    cacheReadGuardVersionByUrl.clear();
  });

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
    get cacheValidator() {
      return props.cacheValidator;
    },
  };

  /**
   * Normalizes baseUrl by removing trailing slash to prevent double slashes.
   */
  const normalizeBaseUrl = (url: string | undefined): string | undefined => {
    if (!url) return url;
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };

  return (
    <CustomResourceContext.Provider
      value={{
        options,
        pendingRequests,
        networkVersionByUrl,
        nextNetworkVersionByUrl,
        cacheReadGuardVersionByUrl,
        get refreshData() {
          return props.refreshData;
        },
        get baseUrl() {
          return normalizeBaseUrl(props.baseUrl);
        },
      }}
    >
      {props.children}
    </CustomResourceContext.Provider>
  );
};
