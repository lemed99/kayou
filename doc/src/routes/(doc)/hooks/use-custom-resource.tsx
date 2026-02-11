import HookDocPage from '../../../components/HookDocPage';

export default function UseCustomResourcePage() {
  return (
    <HookDocPage
      title="useCustomResource"
      description="A powerful data fetching hook for SolidJS that provides advanced features like automatic retries with exponential backoff, request deduplication, SWR (stale-while-revalidate) caching, IndexedDB persistence, request cancellation via AbortController, customizable cache validation, and comprehensive loading/error states. It integrates with CustomResourceProvider for global configuration while allowing per-resource overrides."
      parameters={[
        {
          name: 'urlString',
          type: 'Accessor<string>',
          description:
            'Reactive accessor returning the URL to fetch. Changes trigger a new fetch.',
          required: true,
        },
        {
          name: 'options',
          type: 'ResourceOptions<T>',
          description:
            'Per-resource configuration that overrides context defaults. Includes fetcher, retryCount, retryDelay, exponentialBackoff, errorsBlackList, dedupeRequests, dedupeInterval, cacheValidator, onSuccess, and onError.',
        },
        {
          name: 'refreshKey',
          type: 'string',
          description:
            'Key used to identify this resource for manual refresh via the context refreshData signal.',
        },
        {
          name: 'condition',
          type: 'Accessor<boolean>',
          default: '() => true',
          description:
            'Reactive condition that must be true for the fetch to execute. Useful for dependent queries.',
        },
        {
          name: 'forceRefresh',
          type: 'Accessor<boolean>',
          default: '() => false',
          description:
            'When true, bypasses cache and forces a fresh fetch from the server.',
        },
        {
          name: 'pullFromCache',
          type: 'boolean',
          default: 'true',
          description: 'Whether to check IndexedDB cache for previously fetched data.',
        },
        {
          name: 'swr',
          type: 'boolean',
          default: 'true',
          description:
            'Enable stale-while-revalidate pattern. Shows cached data immediately while fetching fresh data in background.',
        },
      ]}
      returns={[
        {
          name: 'data',
          type: 'Accessor<T | undefined>',
          description: 'The fetched data, or undefined if not yet loaded.',
        },
        {
          name: 'error',
          type: 'Accessor<Error | null>',
          description: 'Error object if fetch failed, null otherwise.',
        },
        {
          name: 'errorStatus',
          type: 'Accessor<number | undefined>',
          description: 'HTTP status code of the error response.',
        },
        {
          name: 'loading',
          type: 'Accessor<boolean>',
          description:
            'True during initial load when no cached data is available. With SWR enabled, becomes false once cached data is served.',
        },
        {
          name: 'validating',
          type: 'Accessor<boolean>',
          description: 'True when revalidating data in background.',
        },
        {
          name: 'state',
          type: 'Accessor<ResourceState>',
          description: '"unresolved" | "pending" | "ready" | "errored"',
        },
        {
          name: 'latest',
          type: 'Accessor<T | undefined>',
          description: 'Latest successful data (persists even when refetching).',
        },
        {
          name: 'fromCache',
          type: 'Accessor<boolean>',
          description: 'True if current data came from IndexedDB cache.',
        },
        {
          name: 'attempts',
          type: 'Accessor<number>',
          description: 'Current retry attempt count.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Manually trigger a refetch. Aborts any in-flight request before starting a new one.',
        },
        {
          name: 'setErrorStatus',
          type: '(status: number | undefined) => void',
          description: 'Function to manually set the error status.',
        },
      ]}
      returnType="CustomResource<T>"
      types={[
        {
          name: 'ResourceOptions<T>',
          description:
            'Configuration options for resource fetching behavior. Can be set globally via CustomResourceProvider or per-hook.',
          props: [
            {
              name: 'fetcher',
              type: '(url: string) => Promise<T>',
              default: 'fetch + JSON.parse',
              description: 'Custom fetcher function. Defaults to fetch with JSON parsing.',
            },
            {
              name: 'onSuccess',
              type: '(data: T, fromCache: boolean) => void',
              description:
                'Callback invoked on successful fetch. Receives data and a flag indicating if it came from cache.',
            },
            {
              name: 'onError',
              type: '(err: Error | null) => void',
              description: 'Callback invoked on fetch error.',
            },
            {
              name: 'retryCount',
              type: 'number',
              default: '3',
              description: 'Maximum number of retry attempts on failure.',
            },
            {
              name: 'retryDelay',
              type: 'number',
              default: '2000',
              description: 'Base delay in milliseconds between retries.',
            },
            {
              name: 'exponentialBackoff',
              type: 'boolean',
              default: 'true',
              description:
                'Whether to use exponential backoff for retries. Delay doubles on each attempt with random jitter.',
            },
            {
              name: 'errorsBlackList',
              type: 'number[]',
              default: '[404, 500, 400, 401, 403]',
              description:
                'HTTP status codes that should NOT trigger retries. Network errors (no status code) always retry.',
            },
            {
              name: 'dedupeRequests',
              type: 'boolean',
              default: 'true',
              description: 'Whether to deduplicate concurrent requests to the same URL.',
            },
            {
              name: 'dedupeInterval',
              type: 'number',
              default: '2000',
              description: 'Time in milliseconds to cache responses for deduplication.',
            },
            {
              name: 'cacheValidator',
              type: '(data: unknown) => boolean',
              default: 'isValidCacheData',
              description:
                'Custom validator for cached data. Return true if the data is valid.',
            },
          ],
        },
        {
          name: 'ResourceState',
          description: 'The current state of the resource.',
          values: ['unresolved', 'pending', 'ready', 'errored', 'refreshing'],
        },
      ]}
      usage={`
        import { useCustomResource, CustomResourceProvider } from '@kayou/hooks';
      `}
      provider={{
        name: 'CustomResourceProvider',
        description:
          'Wraps your application to provide global fetch settings to all useCustomResource hooks. Per-hook options override provider defaults.',
        example: `
          import { createSignal } from 'solid-js';
          import { CustomResourceProvider } from '@kayou/hooks';

          function App() {
            const [refreshData] = createSignal({});

            return (
              <CustomResourceProvider
                refreshData={refreshData}
                retryCount={3}
                retryDelay={1000}
                exponentialBackoff={true}
              >
                <MyApp />
              </CustomResourceProvider>
            );
          }
        `,
        props: [
          {
            name: 'refreshData',
            type: 'Accessor<Record<string, boolean>> | null',
            required: true,
            default: '-',
            description:
              'Reactive signal containing refresh keys. When keys change, associated resources refetch.',
          },
          {
            name: 'baseUrl',
            type: 'string',
            default: '-',
            description:
              'Base URL prepended to all resource URLs. Trailing slashes are automatically removed.',
          },
          {
            name: 'fetcher',
            type: '(url: string) => Promise<T>',
            default: 'fetch + JSON.parse',
            description:
              'Custom fetcher function used by all resources. Defaults to fetch with JSON parsing.',
          },
          {
            name: 'retryCount',
            type: 'number',
            default: '3',
            description: 'Maximum number of retry attempts on failure.',
          },
          {
            name: 'retryDelay',
            type: 'number',
            default: '2000',
            description: 'Base delay in milliseconds between retries.',
          },
          {
            name: 'exponentialBackoff',
            type: 'boolean',
            default: 'true',
            description:
              'Whether to use exponential backoff for retries. Delay doubles on each attempt with random jitter.',
          },
          {
            name: 'errorsBlackList',
            type: 'number[]',
            default: '[404, 500, 400, 401, 403]',
            description:
              'HTTP status codes that should NOT trigger retries. Network errors (no status code) always retry.',
          },
          {
            name: 'dedupeRequests',
            type: 'boolean',
            default: 'true',
            description: 'Whether to deduplicate concurrent requests to the same URL.',
          },
          {
            name: 'dedupeInterval',
            type: 'number',
            default: '2000',
            description: 'Time in milliseconds to cache responses for deduplication.',
          },
          {
            name: 'cacheValidator',
            type: '(data: unknown) => boolean',
            default: 'isValidCacheData',
            description:
              'Custom validator for cached data. Return true if the data is valid. Defaults to built-in validation that rejects strings, empty objects, and falsy values.',
          },
          {
            name: 'onSuccess',
            type: '(data: T, fromCache: boolean) => void',
            default: '-',
            description:
              'Callback invoked on successful fetch. Receives data and a flag indicating if it came from cache.',
          },
          {
            name: 'onError',
            type: '(err: Error | null) => void',
            default: '-',
            description: 'Callback invoked on fetch error.',
          },
        ],
      }}
    />
  );
}
