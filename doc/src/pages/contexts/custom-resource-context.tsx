import ContextDocPage from '../../components/ContextDocPage';

export default function CustomResourceContextPage() {
  return (
    <ContextDocPage
      title="CustomResourceContext"
      description="A context provider for managing global configuration of data fetching behavior in your SolidJS application. CustomResourceContext provides centralized control over retry logic, request deduplication, caching strategies, and custom fetcher functions. It works in conjunction with the useCustomResource hook to provide a consistent data fetching experience across your application."
      providerProps={[
        {
          name: 'refreshData',
          type: 'Accessor<Record<string, boolean>> | null',
          default: 'null',
          description:
            'A reactive signal containing a record of refresh keys. When keys change, associated resources will refetch.',
          required: true,
        },
        {
          name: 'baseUrl',
          type: 'string',
          default: '""',
          description:
            'Base URL to prepend to all resource URLs. Trailing slashes are automatically removed to prevent double slashes.',
        },
        {
          name: 'fetcher',
          type: '(url: string) => Promise<T>',
          default: 'fetch with JSON parsing',
          description:
            'Custom fetcher function to use for all requests. Overrides the default fetch-based implementation.',
        },
        {
          name: 'onSuccess',
          type: '(data: T, fromCache: boolean) => void',
          description:
            'Global callback invoked when any resource fetch succeeds. Receives the data and a flag indicating if it came from cache.',
        },
        {
          name: 'onError',
          type: '(err: Error | null) => void',
          description:
            'Global callback invoked when any resource fetch fails. Useful for centralized error logging or notifications.',
        },
        {
          name: 'retryCount',
          type: 'number',
          default: '3',
          description:
            'Maximum number of retry attempts for failed requests before giving up.',
        },
        {
          name: 'retryDelay',
          type: 'number',
          default: '2000',
          description: 'Base delay in milliseconds between retry attempts.',
        },
        {
          name: 'exponentialBackoff',
          type: 'boolean',
          default: 'true',
          description:
            'When true, retry delays increase exponentially (delay * 2^attempt) with random jitter.',
        },
        {
          name: 'errorsBlackList',
          type: 'number[]',
          default: '[404, 500, 400, 401, 403]',
          description:
            'HTTP status codes that should NOT trigger automatic retries. 500 errors indicate processing errors, not transient issues.',
        },
        {
          name: 'dedupeRequests',
          type: 'boolean',
          default: 'true',
          description:
            'When true, concurrent requests to the same URL are deduplicated, sharing the same promise.',
        },
        {
          name: 'dedupeInterval',
          type: 'number',
          default: '2000',
          description:
            'Time in milliseconds to cache successful responses for deduplication.',
        },
      ]}
      contextValue={[
        {
          name: 'options',
          type: 'ResourceOptions<T>',
          description: 'The merged configuration options from provider props.',
        },
        {
          name: 'pendingRequests',
          type: 'Map<string, PendingEntry<T>>',
          description: 'Map of pending requests for deduplication.',
        },
        {
          name: 'refreshData',
          type: 'Accessor<Record<string, boolean>> | null',
          description: 'The refresh data signal for coordinated refresh.',
        },
        {
          name: 'baseUrl',
          type: 'string | undefined',
          description: 'The normalized base URL.',
        },
      ]}
      contextType="CustomResourceContextValue<T>"
      usage={`
        import { CustomResourceProvider } from '@exowpee/solidly';
      `}
      examples={[
        {
          title: 'Basic Provider Setup',
          description:
            'Wrap your application with the CustomResourceProvider to enable data fetching capabilities.',
          code: `
            import { CustomResourceProvider } from '@exowpee/solidly;
            import { createSignal } from 'solid-js';

            function App() {
              const [refreshData] = createSignal({});

              return (
                <CustomResourceProvider refreshData={refreshData}>
                  <Dashboard />
                </CustomResourceProvider>
              );
            }
          `,
        },
        {
          title: 'With API Base URL',
          description:
            'Configure a base URL to automatically prepend to all resource URLs.',
          code: `
            <CustomResourceProvider
              refreshData={refreshData}
              baseUrl="https://api.example.com/v1"
            >
              {/* All useCustomResource calls will use this base URL */}
              {/* urlString="/users" becomes "https://api.example.com/v1/users" */}
              <UserList />
            </CustomResourceProvider>
          `,
        },
        {
          title: 'Custom Fetcher with Authentication',
          description:
            'Provide a custom fetcher function for adding authentication headers.',
          code: `
            import { CustomResourceProvider } from '@exowpee/solidly;
            import { createSignal } from 'solid-js';

            function App() {
              const [refreshData, setRefreshData] = createSignal<Record<string, boolean>>({});

              // Custom fetcher with authentication
              const customFetcher = async (url: string) => {
                const res = await fetch(url, {
                  headers: {
                    'Authorization': \`Bearer \${getToken()}\`,
                    'Content-Type': 'application/json',
                  },
                });
                if (!res.ok) throw new Error('Request failed');
                return res.json();
              };

              return (
                <CustomResourceProvider
                  refreshData={refreshData}
                  fetcher={customFetcher}
                >
                  <YourComponents />
                </CustomResourceProvider>
              );
            }
          `,
        },
        {
          title: 'Custom Retry Configuration',
          description:
            'Configure retry behavior for failed requests. 500 errors are NOT retried by default.',
          code: `
            <CustomResourceProvider
              refreshData={refreshData}
              retryCount={5}
              retryDelay={1000}
              exponentialBackoff={true}
              errorsBlackList={[400, 401, 403, 404, 500]}
            >
              <YourComponents />
            </CustomResourceProvider>

            // With this config:
            // - 400/401/403/404/500 errors: Will NOT retry
            // - 502/503/504 errors: Will retry up to 5 times (transient server issues)
            // - Retry delays: 1s, 2s, 4s, 8s, 16s (exponential)
          `,
        },
        {
          title: 'Full Configuration Example',
          description: 'A complete example with all configuration options.',
          code: `
            import { CustomResourceProvider } from '@exowpee/solidly;
            import { createSignal } from 'solid-js';

            function App() {
              const [refreshData, setRefreshData] = createSignal<Record<string, boolean>>({});

              return (
                <CustomResourceProvider
                  refreshData={refreshData}
                  baseUrl="https://api.example.com/v1"
                  retryCount={5}
                  retryDelay={1000}
                  exponentialBackoff={true}
                  errorsBlackList={[400, 401, 403, 404, 500]}
                  dedupeRequests={true}
                  dedupeInterval={5000}
                  onSuccess={(data, fromCache) => {
                    console.log('Fetch succeeded:', { data, fromCache });
                  }}
                  onError={(err) => {
                    console.error('Fetch failed:', err);
                    showErrorNotification(err);
                  }}
                >
                  <YourComponents />
                </CustomResourceProvider>
              );
            }
          `,
        },
        {
          title: 'Triggering Refresh',
          description:
            'Use the refreshData signal to trigger refresh for specific resources.',
          code: `
            function RefreshButton() {
              const [, setRefreshData] = useRefreshData(); // Your app's refresh signal

              const handleRefresh = () => {
                // Trigger refresh for resources with refreshKey="users"
                setRefreshData(prev => ({ ...prev, users: true }));
              };

              return <button onClick={handleRefresh}>Refresh Users</button>;
            }

            // In another component:
            function UserList() {
              const { data } = useCustomResource<User[]>({
                urlString: () => '/users',
                refreshKey: 'users', // Links to the refresh signal
              });

              return <For each={data()}>{(user) => <UserCard user={user} />}</For>;
            }
          `,
        },
      ]}
    />
  );
}
