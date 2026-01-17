import HookDocPage from '../../components/HookDocPage';

export default function UseMutationPage() {
  return (
    <HookDocPage
      title="useMutation"
      description="A data mutation hook for handling async operations like POST, PUT, and DELETE requests. Provides reactive state management with loading indicators, error handling, success/error callbacks at both hook and trigger levels, and built-in URL templating for dynamic endpoints."
      overview="The useMutation hook simplifies async data operations by managing the complexity of loading states, error handling, and callbacks in a consistent pattern. Unlike data fetching hooks that run automatically, mutations are triggered imperatively when you need them—typically in response to user actions like form submissions or button clicks. The hook returns reactive signals for the mutation result, any errors, and loading state, plus a trigger function to execute the mutation. It supports URL templating with {param} placeholders for dynamic endpoints, and allows callbacks at both the hook level (for consistent behavior) and trigger level (for one-off handling)."
      whenToUse={[
        'Submitting form data to an API',
        'Creating, updating, or deleting resources',
        'Any POST, PUT, PATCH, or DELETE operation',
        'Operations that need loading state and error handling',
        'When you need to chain mutations with async/await',
      ]}
      keyConcepts={[
        {
          term: 'Trigger Function',
          explanation:
            'Unlike data fetching hooks that run automatically, mutations are triggered manually via the trigger() function. This returns a Promise so you can await the result or chain with .then().',
        },
        {
          term: 'URL Templating',
          explanation:
            'URLs can include {param} placeholders that are replaced at trigger time. For example, "/api/users/{id}" with urlArgs: { id: "123" } becomes "/api/users/123".',
        },
        {
          term: 'Dual Callbacks',
          explanation:
            'Callbacks can be defined at hook level (always called) and trigger level (called for that specific invocation). Both are called on success/error, hook-level first.',
        },
        {
          term: 'Generic Error Type',
          explanation:
            "The TError generic allows typing custom error shapes from your API. Default is Error, but you can specify your API's error format for full type safety.",
        },
      ]}
      value="Consistent mutation handling is critical for data integrity and user experience. This hook ensures loading states prevent duplicate submissions, errors are captured and surfaced properly, and success callbacks can trigger UI updates or navigation. By standardizing mutation patterns, teams avoid common bugs like missing loading indicators, swallowed errors, or race conditions from rapid clicking."
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
      usage={`import { useMutation } from '@exowpee/the_rock';`}
      examples={[
        {
          title: 'Basic Usage',
          description: 'Simple mutation for creating a resource.',
          code: `import { useMutation } from '@exowpee/the_rock';

function CreateUserForm() {
  const { trigger, isMutating, error } = useMutation({
    urlString: '/api/users',
    options: {
      fetcher: async (url, userData) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (!res.ok) throw new Error('Failed to create user');
        return res.json();
      },
      onSuccess: (data) => {
        console.log('User created:', data);
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await trigger({
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={isMutating()}>
        {isMutating() ? 'Creating...' : 'Create User'}
      </button>
      {error() && <p class="text-red-500">{error().message}</p>}
    </form>
  );
}`,
        },
        {
          title: 'URL Templating',
          description: 'Dynamic URLs with parameter substitution.',
          code: `const { trigger } = useMutation({
  urlString: '/api/users/{userId}/posts/{postId}',
  options: {
    fetcher: async (url, data) => {
      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },
});

// URL becomes: /api/users/123/posts/456
await trigger(
  { title: 'Updated Title' },
  { userId: '123', postId: '456' }
);`,
        },
        {
          title: 'Trigger-Level Callbacks',
          description: 'Override or supplement hook-level callbacks per invocation.',
          code: `const { trigger } = useMutation({
  urlString: '/api/items',
  options: {
    fetcher: createItem,
    onSuccess: (data) => {
      // Always called on success
      invalidateItemsList();
    },
  },
});

// For this specific trigger, also navigate after success
await trigger(newItem, undefined, {
  onSuccess: (data) => {
    // Called in addition to hook-level onSuccess
    navigate(\`/items/\${data.id}\`);
  },
  onError: (err) => {
    // Handle this specific error case
    showToast('Failed to create item');
  },
});`,
        },
        {
          title: 'With Custom Error Type',
          description: 'Type your API error responses for full type safety.',
          code: `interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

interface User {
  id: string;
  name: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

const { trigger, error } = useMutation<User, CreateUserInput, ApiError>({
  urlString: '/api/users',
  options: {
    fetcher: async (url, input) => {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const apiError: ApiError = await res.json();
        throw apiError;
      }
      return res.json();
    },
    onError: (err) => {
      // err is typed as ApiError
      if (err.code === 'VALIDATION_ERROR') {
        console.log('Validation details:', err.details);
      }
    },
  },
});

// error() is Accessor<ApiError | undefined>
{error() && (
  <div>
    <p>{error()!.message}</p>
    {error()!.details?.email && (
      <p>Email: {error()!.details.email}</p>
    )}
  </div>
)}`,
        },
        {
          title: 'Reactive URL',
          description: 'URL that updates based on reactive state.',
          code: `const [tenantId, setTenantId] = createSignal('default');

const { trigger } = useMutation({
  // URL updates when tenantId changes
  urlString: () => \`/api/tenants/\${tenantId()}/resources\`,
  options: {
    fetcher: async (url, data) => {
      const res = await fetch(url, { method: 'POST', body: JSON.stringify(data) });
      return res.json();
    },
  },
});

// When tenantId is 'acme', URL is /api/tenants/acme/resources
await trigger({ name: 'New Resource' });`,
        },
        {
          title: 'With Button Loading State',
          description: 'Integrate with Button component for consistent UX.',
          code: `import { Button } from '@exowpee/the_rock';
import { useMutation } from '@exowpee/the_rock';

function DeleteButton(props: { itemId: string }) {
  const { trigger, isMutating } = useMutation({
    urlString: '/api/items/{id}',
    options: {
      fetcher: async (url) => {
        const res = await fetch(url, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      },
      onSuccess: () => {
        props.onDeleted?.();
      },
    },
  });

  return (
    <Button
      color="failure"
      isLoading={isMutating()}
      onClick={() => trigger({}, { id: props.itemId })}
    >
      {isMutating() ? 'Deleting...' : 'Delete'}
    </Button>
  );
}`,
        },
        {
          title: 'Async/Await Pattern',
          description: 'Use trigger with try/catch for sequential operations.',
          code: `const createUser = useMutation({ ... });
const createProfile = useMutation({ ... });
const sendWelcomeEmail = useMutation({ ... });

async function handleSignup(formData) {
  try {
    // Sequential mutations
    const user = await createUser.trigger(formData);
    await createProfile.trigger({ userId: user.id, bio: '' });
    await sendWelcomeEmail.trigger({ userId: user.id });

    showToast('Signup complete!');
    navigate('/dashboard');
  } catch (err) {
    // Any failed mutation stops the chain
    showToast('Signup failed: ' + err.message);
  }
}`,
        },
        {
          title: 'Types Reference',
          description: 'TypeScript types used by useMutation.',
          code: `interface MutationOptions<TData, TArg, TError = Error> {
  fetcher: (url: string, arg: TArg) => Promise<TData>;
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: TError, arg: TArg) => void;
}

interface MutationTriggerOptions<TData, TArg, TError = Error> {
  onSuccess?: (data: TData, arg: TArg) => void;
  onError?: (error: TError, arg: TArg) => void;
}

interface MutationProps<TData, TArg, TError = Error> {
  urlString: string | Accessor<string>;
  options: MutationOptions<TData, TArg, TError>;
}

interface Mutation<TData, TArg, TError = Error> {
  data: Accessor<TData | undefined>;
  error: Accessor<TError | undefined>;
  isMutating: Accessor<boolean>;
  trigger: (
    arg: TArg,
    urlArgs?: Record<string, string>,
    options?: MutationTriggerOptions<TData, TArg, TError>,
  ) => Promise<TData>;
}`,
        },
      ]}
    />
  );
}
