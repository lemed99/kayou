import HookDocPage from '../../components/HookDocPage';

export default function UseCustomResourcePage() {
  return (
    <HookDocPage
      title="useCustomResource"
      description="A powerful data fetching hook for SolidJS that provides advanced features like automatic retries with exponential backoff, request deduplication, SWR (stale-while-revalidate) caching, IndexedDB persistence, and comprehensive loading/error states. It integrates with CustomResourceContext for global configuration while allowing per-resource overrides."
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
            'Per-resource configuration that overrides context defaults. See ResourceOptions interface.',
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
            'True during initial load (false with SWR when cached data exists).',
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
          description: 'Function to manually trigger a refetch.',
        },
        {
          name: 'setErrorStatus',
          type: '(status: number | undefined) => void',
          description: 'Function to manually set the error status.',
        },
      ]}
      returnType="CustomResource<T>"
      usage={`import { useCustomResource } from '@exowpee/solidly';`}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Simple data fetching with loading and error states.',
          code: `import { useCustomResource } from '@exowpee/solidly';
import { Show } from 'solid-js';solidly

function UserProfile() {
  const { data, loading, error } = useCustomResource<User>({
    urlString: () => '/api/users/me',
  });

  return (
    <Show when={!loading()} fallback={<Spinner />}>
      <Show when={!error()} fallback={<ErrorMessage error={error()} />}>
        <div>{data()?.name}</div>
      </Show>
    </Show>
  );
}`,
        },
        {
          title: 'Conditional Fetching',
          description:
            'Use the condition prop to control when fetching should occur. Useful for dependent queries.',
          code: `function OrderDetails(props: { orderId: Accessor<string | null> }) {
  // Only fetch when orderId is available
  const { data, loading } = useCustomResource<Order>({
    urlString: () => \`/api/orders/\${props.orderId()}\`,
    condition: () => !!props.orderId(),
  });

  return (
    <Show when={props.orderId()} fallback={<p>Select an order</p>}>
      <Show when={!loading()} fallback={<Spinner />}>
        <OrderCard order={data()} />
      </Show>
    </Show>
  );
}`,
        },
        {
          title: 'Automatic Retry with Exponential Backoff',
          description:
            'Failed requests are automatically retried with increasing delays. 500 errors are NOT retried as they indicate processing errors, not transient issues.',
          code: `const { data, error, attempts, errorStatus } = useCustomResource<Data>({
  urlString: () => '/api/unstable-endpoint',
  options: {
    retryCount: 5,        // Max 5 retries
    retryDelay: 1000,     // Base delay: 1 second
    exponentialBackoff: true, // Delays: 1s, 2s, 4s, 8s, 16s
    // 400, 401, 403, 404, 500 will NOT be retried (in blacklist)
    // 502, 503, 504 WILL be retried (transient server issues)
  },
});

// Track retry progress
createEffect(() => {
  if (attempts() > 0) {
    console.log(\`Retry attempt \${attempts()}/5\`);
  }
});`,
        },
        {
          title: 'SWR (Stale-While-Revalidate)',
          description:
            'Show cached data immediately while fetching fresh data in the background.',
          code: `function ProductList() {
  const { data, validating, fromCache } = useCustomResource<Product[]>({
    urlString: () => '/api/products',
    swr: true,           // Enable SWR pattern
    pullFromCache: true, // Use IndexedDB cache
  });

  return (
    <div>
      {/* Show indicator when revalidating */}
      <Show when={validating()}>
        <div class="fixed top-4 right-4">
          <Spinner size="sm" />
          <span>Updating...</span>
        </div>
      </Show>

      {/* Show cache indicator */}
      <Show when={fromCache()}>
        <Badge color="warning">Showing cached data</Badge>
      </Show>

      {/* Data is available immediately from cache */}
      <For each={data()}>
        {(product) => <ProductCard product={product} />}
      </For>
    </div>
  );
}`,
        },
        {
          title: 'Manual Refresh',
          description:
            'Use refetch() for manual refresh or refreshKey for coordinated refresh across components.',
          code: `function UserDashboard() {
  const { data, refetch, loading } = useCustomResource<User>({
    urlString: () => '/api/user',
    refreshKey: 'user', // Links to context.refreshData
  });

  return (
    <div>
      <button
        onClick={refetch}
        disabled={loading()}
        class="btn-primary"
      >
        {loading() ? 'Refreshing...' : 'Refresh Data'}
      </button>
      <UserInfo user={data()} />
    </div>
  );
}

// Refresh from anywhere using context
function RefreshAllButton() {
  const [, setRefreshData] = useRefreshSignal();

  const refreshAll = () => {
    setRefreshData({ user: true, orders: true });
  };

  return <button onClick={refreshAll}>Refresh All</button>;
}`,
        },
        {
          title: 'Custom Options',
          description: 'Override context defaults with per-resource configuration.',
          code: `function CriticalData() {
  const { data, error, attempts, errorStatus } = useCustomResource<ImportantData>({
    urlString: () => '/api/critical-data',
    options: {
      retryCount: 10,
      retryDelay: 500,
      exponentialBackoff: true,
      onError: (err) => {
        reportToSentry(err);
      },
    },
  });

  return (
    <Show when={error()}>
      <div>
        Failed after {attempts()} attempts.
        Status: {errorStatus()}
      </div>
    </Show>
  );
}`,
        },
        {
          title: 'ResourceOptions Interface',
          description:
            'Configuration options that can be passed per-resource to override context defaults.',
          code: `interface ResourceOptions<T> {
  // Custom fetch function
  fetcher?: (url: string) => Promise<T>;

  // Success/error callbacks
  onSuccess?: (data: T, fromCache: boolean) => void;
  onError?: (err: unknown) => void;

  // Retry configuration
  retryCount?: number;        // Default: 3
  retryDelay?: number;        // Default: 2000ms
  exponentialBackoff?: boolean; // Default: true

  // HTTP errors that should NOT trigger retry
  // Default: [404, 500, 400, 401, 403]
  // 500 is included because it indicates processing errors, not transient issues
  errorsBlackList?: number[];

  // Request deduplication
  dedupeRequests?: boolean;   // Default: true
  dedupeInterval?: number;    // Default: 2000ms
}`,
        },
      ]}
    />
  );
}
