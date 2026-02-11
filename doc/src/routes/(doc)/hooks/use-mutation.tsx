import HookDocPage from '../../../components/HookDocPage';

export default function UseMutationPage() {
  return (
    <HookDocPage
      title="useMutation"
      description="A data mutation hook for handling async operations like POST, PUT, and DELETE requests. Provides reactive state management with loading indicators, error handling, success/error callbacks at both hook and trigger levels, and built-in URL templating for dynamic endpoints."
      parameters={[
        {
          name: 'urlString',
          type: 'string | Accessor<string>',
          description:
            'The endpoint URL. Can be a static string or reactive accessor. Supports {param} placeholders for URL templating.',
          required: true,
        },
        {
          name: 'options.fetcher',
          type: '(url: string, arg: TArg) => Promise<TData>',
          description:
            'The function that performs the actual mutation. Receives the resolved URL and the argument passed to trigger().',
          required: true,
        },
        {
          name: 'options.onSuccess',
          type: '(data: TData, arg: TArg) => void',
          description:
            'Callback fired after successful mutation. Receives the returned data and the original argument.',
        },
        {
          name: 'options.onError',
          type: '(error: TError, arg: TArg) => void',
          description:
            'Callback fired when mutation fails. Receives the error and the original argument.',
        },
      ]}
      returnType="Mutation<TData, TArg, TError>"
      returns={[
        {
          name: 'data',
          type: 'Accessor<TData | undefined>',
          description:
            'Reactive accessor returning the last successful mutation result. Undefined until first successful mutation.',
        },
        {
          name: 'error',
          type: 'Accessor<TError | undefined>',
          description:
            'Reactive accessor returning the last mutation error. Cleared when a new mutation starts.',
        },
        {
          name: 'isMutating',
          type: 'Accessor<boolean>',
          description:
            'Reactive accessor indicating if a mutation is in progress. Use for loading states.',
        },
        {
          name: 'trigger',
          type: '(arg: TArg, urlArgs?: Record<string, string>, options?: TriggerOptions) => Promise<TData>',
          description:
            'Function to execute the mutation. Returns a Promise that resolves with the data or rejects with the error.',
        },
      ]}
      usage={`
        import { useMutation } from '@kayou/hooks';
      `}
    />
  );
}
