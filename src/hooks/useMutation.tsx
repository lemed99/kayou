import { Accessor, createSignal } from 'solid-js';

import { CustomError } from '../context/CustomResourceContext';

export interface MutationOptions<TData, TArg> {
  fetcher: (url: string, arg: TArg) => Promise<TData>;
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: CustomError, arg: TArg) => void;
}

export interface Mutation<TData, TArg> {
  data: Accessor<TData | undefined>;
  error: Accessor<CustomError | null>;
  isMutating: Accessor<boolean>;
  trigger: (arg: TArg, options?: MutationTriggerOptions<TData, TArg>) => Promise<TData>;
}

export interface MutationTriggerOptions<TData, TArg> {
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: CustomError, arg: TArg) => void;
}

export interface MutationProps<TData, TArg> {
  urlString: string;
  options: MutationOptions<TData, TArg>;
}

export function useMutation<TData = unknown, TArg = unknown>(
  props: MutationProps<TData, TArg>,
): Mutation<TData, TArg> {
  const [error, setError] = createSignal<CustomError | null>(null);
  const [mutationData, setMutationData] = createSignal<TData | undefined>();
  const [isMutating, setIsMutating] = createSignal(false);

  const parseError = (error: unknown): CustomError => {
    if (typeof error === 'string') {
      try {
        return JSON.parse(error) as CustomError;
      } catch {
        return { message: error };
      }
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: String(error) };
  };

  const trigger = async (
    arg: TArg,
    options?: MutationTriggerOptions<TData, TArg>,
  ): Promise<TData> => {
    const fetcher = props.options.fetcher;

    setIsMutating(true);
    setError(null);

    try {
      const data = await fetcher(props.urlString, arg);
      setMutationData(() => data);

      options?.onSuccess?.(data, arg);
      props.options?.onSuccess?.(data, arg);

      setIsMutating(false);
      return data;
    } catch (err) {
      const parsedError = parseError(err);
      setError(parsedError);

      options?.onError?.(parsedError, arg);
      props.options?.onError?.(parsedError, arg);

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
