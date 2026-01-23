import HookDocPage from '../../components/HookDocPage';

export default function UseToastPage() {
  return (
    <HookDocPage
      title="useToast"
      description="A hook for displaying toast notifications with custom components, auto-dismiss, pause-on-hover, and stacking."
      returnType="ToastAPI"
      returns={[
        {
          name: '[method]',
          type: '(message: string, options?: ToastOptions) => string | null',
          description:
            'Dynamic methods for each registered toast type. Returns toast ID or null.',
        },
        {
          name: 'dismiss',
          type: '(id: string) => void',
          description: 'Dismisses a toast by ID with exit animation.',
        },
        {
          name: 'pause',
          type: '(id: string) => void',
          description: 'Pauses the auto-dismiss timer.',
        },
        {
          name: 'play',
          type: '(id: string) => void',
          description: 'Resumes a paused timer.',
        },
      ]}
      usage={`
        import { useToast } from '@exowpee/solidly/hooks';
        import { ToastProvider } from '@exowpee/solidly/context';
      `}
      examples={[
        {
          title: 'Setup with ToastProvider',
          description: 'Wrap your app and define toast components.',
          code: `
            import { ToastProvider } from '@exowpee/solidly/context';
            import type { ToastMethodProps } from '@exowpee/solidly/context';

            // Define your toast components
            const SuccessToast = (props: ToastMethodProps) => (
              <div class="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 shadow-lg">
                <CheckIcon class="size-5 text-green-500" />
                <p class="text-sm text-green-800">{props.message}</p>
                <button onClick={props.dismiss} class="ml-auto">
                  <XIcon class="size-4 text-green-500" />
                </button>
              </div>
            );

            const ErrorToast = (props: ToastMethodProps) => (
              <div class="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3 shadow-lg">
                <AlertIcon class="size-5 text-red-500" />
                <p class="text-sm text-red-800">{props.message}</p>
                <button onClick={props.dismiss} class="ml-auto">
                  <XIcon class="size-4 text-red-500" />
                </button>
              </div>
            );

            // Wrap your app
            function App() {
              return (
                <ToastProvider
                  methods={{
                    success: SuccessToast,
                    error: ErrorToast,
                    warning: WarningToast,
                    info: InfoToast,
                  }}
                  position="top-right"
                  duration={5000}
                >
                  <YourApp />
                </ToastProvider>
              );
            }
          `,
        },
        {
          title: 'Basic Usage',
          description: 'Show toasts after async operations.',
          code: `
            import { useToast } from '@exowpee/solidly/hooks';

            function SaveButton() {
              const toast = useToast();

              const handleSave = async () => {
                try {
                  await saveData();
                  toast.success('Changes saved successfully!');
                } catch (err) {
                  toast.error('Failed to save changes');
                }
              };

              return <button onClick={handleSave}>Save</button>;
            }
          `,
        },
        {
          title: 'Custom Duration',
          description: 'Override duration per toast.',
          code: `
            const toast = useToast();

            // Quick notification (2 seconds)
            toast.success('Copied to clipboard!', { duration: 2000 });

            // Important message (10 seconds)
            toast.warning('Your session expires in 5 minutes', { duration: 10000 });

            // Persistent toast (no auto-dismiss)
            const id = toast.error('Connection lost. Click to retry.', { duration: 0 });

            // Later, dismiss it manually
            toast.dismiss(id);
          `,
        },
        {
          title: 'Pause and Resume',
          description: 'Manual timer control.',
          code: `
            const toast = useToast();

            function ImportantNotification() {
              const [toastId, setToastId] = createSignal<string | null>(null);

              const showImportant = () => {
                const id = toast.warning('Processing your request...');
                setToastId(id);

                // Pause immediately - user must acknowledge
                if (id) toast.pause(id);
              };

              const acknowledge = () => {
                const id = toastId();
                if (id) {
                  toast.play(id); // Resume timer, will auto-dismiss
                  setToastId(null);
                }
              };

              return (
                <>
                  <button onClick={showImportant}>Start Process</button>
                  <Show when={toastId()}>
                    <button onClick={acknowledge}>Got it</button>
                  </Show>
                </>
              );
            }
          `,
        },
        {
          title: 'Toast with Progress Bar',
          description: 'Visual countdown indicator.',
          code: `
            import type { ToastMethodProps } from '@exowpee/solidly/context';
            import { createSignal, createEffect, onCleanup } from 'solid-js';

            const ProgressToast = (props: ToastMethodProps) => {
              const [progress, setProgress] = createSignal(100);

              createEffect(() => {
                if (props.paused()) return;

                const interval = setInterval(() => {
                  setProgress((p) => Math.max(0, p - 100 / (props.duration / 100)));
                }, 100);

                onCleanup(() => clearInterval(interval));
              });

              return (
                <div class="w-80 overflow-hidden rounded-lg bg-white shadow-lg">
                  <div class="flex items-center gap-3 px-4 py-3">
                    <CheckIcon class="size-5 text-green-500" />
                    <p class="text-sm">{props.message}</p>
                    <button onClick={props.dismiss} class="ml-auto">
                      <XIcon class="size-4" />
                    </button>
                  </div>
                  <div class="h-1 bg-gray-100">
                    <div
                      class="h-full bg-green-500 transition-all duration-100"
                      style={{ width: \`\${progress()}%\` }}
                    />
                  </div>
                </div>
              );
            };
          `,
        },
        {
          title: 'Toast with Action Button',
          description: 'Add clickable actions.',
          code: `
            const UndoToast = (props: ToastMethodProps & { onUndo: () => void }) => (
              <div class="flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg">
                <p class="text-sm">{props.message}</p>
                <button
                  onClick={() => {
                    props.onUndo();
                    props.dismiss();
                  }}
                  class="rounded bg-white px-2 py-1 text-xs font-medium text-gray-900"
                >
                  Undo
                </button>
              </div>
            );

            // In ToastProvider, you can pass additional props through the message
            // or use a wrapper pattern:

            function useUndoToast() {
              const toast = useToast();

              return (message: string, onUndo: () => void) => {
                // Store undo callback in a ref/signal that the toast component can access
                return toast.undo(message);
              };
            }
          `,
        },
        {
          title: 'Disable Pause on Hover',
          description: 'Always auto-dismiss.',
          code: `
            const toast = useToast();

            // This toast won't pause when hovered
            toast.info('Quick tip: Press Ctrl+S to save', {
              duration: 3000,
              pauseOnHover: false,
            });
          `,
        },
        {
          title: 'ToastProvider Configuration',
          description: 'All available props.',
          code: `
            <ToastProvider
              // Required: Your toast components
              methods={{
                success: SuccessToast,
                error: ErrorToast,
                warning: WarningToast,
                info: InfoToast,
                loading: LoadingToast,
              }}

              // Position: where toasts appear
              // 'top-left' | 'top-center' | 'top-right' |
              // 'bottom-left' | 'bottom-center' | 'bottom-right'
              position="top-right"

              // Default auto-dismiss time in ms (0 = no auto-dismiss)
              duration={5000}

              // Pause timer when mouse hovers over toast
              pauseOnHover={true}

              // Space between stacked toasts in px
              gutter={16}

              // Maximum visible toasts (oldest dismissed when exceeded)
              maxToasts={5}

              // CSS z-index for toast container
              zIndex={9999}
            >
              {props.children}
            </ToastProvider>
          `,
        },
        {
          title: 'ToastMethodProps Interface',
          description: 'Props for custom toast components.',
          code: `
            interface ToastMethodProps {
              // The message passed to toast.method(message)
              message: string;

              // Reactive accessor: true when toast timer is paused
              paused: () => boolean;

              // The duration in ms (from options or default)
              duration: number;

              // Call to immediately dismiss this toast
              dismiss: () => void;

              // Call to pause the auto-dismiss timer
              pause: () => void;

              // Call to resume a paused timer
              play: () => void;
            }

            // Example usage in a toast component:
            const MyToast = (props: ToastMethodProps) => (
              <div>
                <p>{props.message}</p>
                <Show when={props.paused()}>
                  <span>Paused</span>
                </Show>
                <button onClick={props.dismiss}>Close</button>
                <button onClick={props.pause}>Pause</button>
                <button onClick={props.play}>Resume</button>
              </div>
            );
          `,
        },
        {
          title: 'Types Reference',
          description: 'Full type definitions.',
          code: `
            // Position options for toast container
            type ToastPosition =
              | 'top-left'
              | 'top-center'
              | 'top-right'
              | 'bottom-left'
              | 'bottom-center'
              | 'bottom-right';

            // Options passed when creating a toast
            interface ToastOptions {
              duration?: number;      // Override default duration
              pauseOnHover?: boolean; // Override default pause behavior
            }

            // Props for ToastProvider
            interface ToastProviderProps {
              methods: Record<string, Component<ToastMethodProps>>;
              position?: ToastPosition;    // default: 'top-right'
              duration?: number;           // default: 3000
              pauseOnHover?: boolean;      // default: true
              gutter?: number;             // default: 16
              maxToasts?: number;          // default: 5
              zIndex?: number;             // default: 9999
              children: JSX.Element;
            }

            // The API returned by useToast()
            interface ToastAPI {
              // Dynamic methods based on registered types
              [method: string]: (message: string, options?: ToastOptions) => string | null;

              // Built-in methods
              dismiss: (id: string) => void;
              pause: (id: string) => void;
              play: (id: string) => void;
            }
          `,
        },
        {
          title: 'Error Handling',
          description: 'Validation and edge cases.',
          code: `
            const toast = useToast();

            // If you call an unregistered method, it returns null and logs an error
            const id = toast.customType('Hello');
            // Console: Toast method "customType" is not defined. Available methods: success, error, warning, info
            // id === null

            // Calling dismiss/pause/play with invalid ID is safely ignored
            toast.dismiss('nonexistent-id'); // No error, just no-op

            // The hook must be used within ToastProvider
            function BadComponent() {
              const toast = useToast();
              // Throws: "useToast must be used within ToastProvider"
            }
          `,
        },
        {
          title: 'Accessibility',
          description: 'Built-in ARIA support.',
          code: `
            // The ToastContainer automatically renders with:
            <div
              role="region"
              aria-label="Notifications"
              aria-live="polite"
              aria-atomic="false"
            >
              {/* Toasts render here */}
            </div>

            // This ensures:
            // - Screen readers announce new toasts
            // - "polite" means announcements wait for user idle
            // - "atomic=false" means only new content is announced

            // For urgent notifications, consider using role="alert"
            // in your individual toast component:
            const UrgentToast = (props: ToastMethodProps) => (
              <div role="alert" class="bg-red-500 text-white">
                {props.message}
              </div>
            );
          `,
        },
      ]}
    />
  );
}
