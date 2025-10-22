import { Accessor, createSignal } from 'solid-js';

export interface MutationOptions<TData, TArg> {
  fetcher: (url: string, arg: TArg) => Promise<TData>;
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: Error, arg: TArg) => void;
}

export interface Mutation<TData, TArg> {
  data: Accessor<TData | undefined>;
  error: Accessor<Error | undefined>;
  isMutating: Accessor<boolean>;
  trigger: (arg: TArg, options?: MutationTriggerOptions<TData, TArg>) => Promise<TData>;
}

export interface MutationTriggerOptions<TData, TArg> {
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: Error, arg: TArg) => void;
}

export interface MutationProps<TData, TArg> {
  urlString: string;
  options: MutationOptions<TData, TArg>;
}

export function useMutation<TData = unknown, TArg = unknown>(
  props: MutationProps<TData, TArg>,
): Mutation<TData, TArg> {
  const [error, setError] = createSignal<Error | undefined>();
  const [mutationData, setMutationData] = createSignal<TData | undefined>();
  const [isMutating, setIsMutating] = createSignal(false);

  const trigger = async (
    arg: TArg,
    options?: MutationTriggerOptions<TData, TArg>,
  ): Promise<TData> => {
    const fetcher = props.options.fetcher;

    setIsMutating(true);
    setError();

    try {
      const data = await fetcher(props.urlString, arg);
      setMutationData(() => data);

      options?.onSuccess?.(data, arg);
      props.options?.onSuccess?.(data, arg);

      setIsMutating(false);
      return data;
    } catch (err) {
      setError(err as Error);

      options?.onError?.(err as Error, arg);
      props.options?.onError?.(err as Error, arg);

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
