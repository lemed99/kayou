import { Accessor, ParentComponent, createContext } from 'solid-js';

export interface ResourceOptions<T> {
  fetcher?: (url: string) => Promise<T>;
  onSuccess?: (data: T, fromCache: boolean) => void;
  onError?: (err: unknown) => void;
  retryCount?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  errorsBlackList?: number[];
  dedupeRequests?: boolean;
  dedupeInterval?: number;
}

export interface CustomResourceProviderProps<T> extends ResourceOptions<T> {
  refreshData: Accessor<Record<string, boolean>> | null;
  baseUrl?: string;
}

export interface PendingEntry<T> {
  promise: Promise<T> | null;
  lastValue?: T;
  resolvedAt?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

export const CustomResourceContext = createContext();

export const CustomResourceProvider: ParentComponent<
  CustomResourceProviderProps<unknown>
> = (props) => {
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
        get baseUrl() {
          return props.baseUrl;
        },
      }}
    >
      {props.children}
    </CustomResourceContext.Provider>
  );
};
