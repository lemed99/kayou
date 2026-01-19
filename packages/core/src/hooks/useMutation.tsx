import { Accessor, createSignal } from 'solid-js';

export interface MutationOptions<TData, TArg, TError = Error> {
  fetcher: (url: string, arg: TArg) => Promise<TData>;
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: TError, arg: TArg) => void;
}

export interface Mutation<TData, TArg, TError = Error> {
  data: Accessor<TData | undefined>;
  error: Accessor<TError | undefined>;
  isMutating: Accessor<boolean>;
  trigger: (
    arg: TArg,
    urlArgs?: Record<string, string>,
    options?: MutationTriggerOptions<TData, TArg, TError>,
  ) => Promise<TData>;
}

export interface MutationTriggerOptions<TData, TArg, TError = Error> {
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: TError, arg: TArg) => void;
}

export interface MutationProps<TData, TArg, TError = Error> {
  urlString: string | Accessor<string>;
  options: MutationOptions<TData, TArg, TError>;
}

/**
 * Hook for performing data mutations with loading state and callbacks.
 *
 * Provides reactive state management for async operations like POST, PUT, DELETE requests.
 * Includes built-in URL templating, dual-level callbacks, and proper error handling.
 *
 * @template TData - The type of data returned from the mutation
 * @template TArg - The type of argument passed to the mutation
 * @template TError - The type of error returned on failure (defaults to Error)
 * @param props - Mutation configuration including URL and options
 * @returns Mutation object with data, error, loading state, and trigger function
 *
 * @example
 * ```tsx
 * const { trigger, isMutating, error } = useMutation({
 *   urlString: '/api/users/{id}',
 *   options: {
 *     fetcher: async (url, data) => {
 *       const res = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
 *       if (!res.ok) throw new Error('Failed to create user');
 *       return res.json();
 *     },
 *     onSuccess: (data) => console.log('Created:', data),
 *     onError: (err) => console.error('Failed:', err),
 *   },
 * });
 *
 * // Trigger with URL parameters
 * await trigger({ name: 'John' }, { id: '123' });
 * ```
 */
export function useMutation<TData = unknown, TArg = unknown, TError = Error>(
  props: MutationProps<TData, TArg, TError>,
): Mutation<TData, TArg, TError> {
  const [error, setError] = createSignal<TError | undefined>(undefined);
  const [mutationData, setMutationData] = createSignal<TData | undefined>(undefined);
  const [isMutating, setIsMutating] = createSignal(false);

  const trigger = async (
    arg: TArg,
    urlArgs?: Record<string, string>,
    options?: MutationTriggerOptions<TData, TArg, TError>,
  ): Promise<TData> => {
    const fetcher = props.options.fetcher;

    setIsMutating(true);
    setError(undefined);

    const getUrl = () => {
      let url: string;
      if (typeof props.urlString === 'string') url = props.urlString;
      else url = props.urlString();
      if (urlArgs) {
        Object.keys(urlArgs).forEach((key) => {
          url = url.split(`{${key}}`).join(urlArgs[key]);
        });
      }
      return url;
    };

    try {
      const data = await fetcher(getUrl(), arg);
      setMutationData(() => data);

      options?.onSuccess?.(data, arg);
      props.options?.onSuccess?.(data, arg);

      setIsMutating(false);
      return data;
    } catch (err) {
      setError(() => err as TError);

      options?.onError?.(err as TError, arg);
      props.options?.onError?.(err as TError, arg);

      setIsMutating(false);
      throw err;
    }
  };

  return {
    data: mutationData,
    error,
    isMutating,
    trigger,
  };
}
