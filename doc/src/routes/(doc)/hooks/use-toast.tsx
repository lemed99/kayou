import HookDocPage from '../../../components/HookDocPage';

export default function UseToastPage() {
  return (
    <HookDocPage
      title="useToast"
      description="A hook for displaying toast notifications. Returns the toast API from ToastProvider context, allowing you to programmatically show, dismiss, pause, and play toast notifications. Must be used within a ToastProvider."
      parameters={[]}
      returnType="ToastAPI"
      returns={[
        {
          name: 'dismiss',
          type: '(id: string) => void',
          description: 'Dismiss a specific toast by its ID.',
        },
        {
          name: 'pause',
          type: '(id: string) => void',
          description: 'Pause the auto-dismiss timer for a specific toast.',
        },
        {
          name: 'play',
          type: '(id: string) => void',
          description: 'Resume the auto-dismiss timer for a paused toast.',
        },
        {
          name: '[method]',
          type: '(message: string, options?: ToastOptions) => string',
          description:
            'Dynamic methods based on the methods prop passed to ToastProvider. Each method shows a toast and returns its ID.',
        },
      ]}
      usage={`
        import { useToast, ToastProvider } from '@kayou/hooks';
      `}
      examples={[
        {
          title: 'Basic Setup',
          description: 'Wrap your app with ToastProvider and define toast methods.',
          code: `
            import { ToastProvider } from '@kayou/hooks';

            // Define your toast components
            const toastMethods = {
              success: (props) => (
                <div class="rounded-lg bg-green-500 px-4 py-2 text-white">
                  {props.message}
                </div>
              ),
              error: (props) => (
                <div class="rounded-lg bg-red-500 px-4 py-2 text-white">
                  {props.message}
                </div>
              ),
            };

            function App() {
              return (
                <ToastProvider methods={toastMethods}>
                  <MyComponent />
                </ToastProvider>
              );
            }
          `,
        },
        {
          title: 'Showing Toasts',
          description: 'Use the hook to show toasts from any component.',
          code: `
            import { useToast } from '@kayou/hooks';

            function MyComponent() {
              const toast = useToast();

              const handleSuccess = () => {
                toast.success('Operation completed!');
              };

              const handleError = () => {
                toast.error('Something went wrong');
              };

              return (
                <div class="space-x-2">
                  <button onClick={handleSuccess}>Show Success</button>
                  <button onClick={handleError}>Show Error</button>
                </div>
              );
            }
          `,
        },
        {
          title: 'With Options',
          description: 'Customize toast position and duration.',
          code: `
            const toast = useToast();

            // Show toast at bottom-center for 5 seconds
            toast.success('Saved!', {
              position: 'bottom-center',
              duration: 5000,
            });

            // Show toast that doesn't auto-dismiss
            const id = toast.error('Connection lost', {
              duration: 0, // Won't auto-dismiss
            });

            // Manually dismiss later
            toast.dismiss(id);
          `,
        },
        {
          title: 'Interactive Toast',
          description: 'Create toasts with pause/play on hover.',
          code: `
            const toastMethods = {
              info: (props) => (
                <div
                  class="rounded-lg bg-blue-500 px-4 py-2 text-white"
                  onMouseEnter={props.pause}
                  onMouseLeave={props.play}
                >
                  {props.message}
                  <button onClick={props.dismiss} class="ml-2">×</button>
                </div>
              ),
            };

            // In ToastProvider, pauseOnHover is true by default
            <ToastProvider methods={toastMethods} pauseOnHover={true}>
              {children}
            </ToastProvider>
          `,
        },
        {
          title: 'ToastProvider Props',
          description: 'Configuration options for ToastProvider.',
          code: `
            interface ToastProviderProps {
              // Required: Object mapping method names to toast components
              methods: Record<string, Component<ToastMethodProps>>;

              // Default position for all toasts
              position?: 'top-left' | 'top-center' | 'top-right'
                       | 'bottom-left' | 'bottom-center' | 'bottom-right';
              // Default: 'top-right'

              // Default duration in milliseconds (0 = no auto-dismiss)
              duration?: number; // Default: 3000

              // Pause timer when hovering over toast
              pauseOnHover?: boolean; // Default: true

              // Gap between toasts in pixels
              gutter?: number; // Default: 16
            }
          `,
        },
        {
          title: 'ToastMethodProps',
          description: 'Props passed to your toast components.',
          code: `
            interface ToastMethodProps {
              // The message passed to the toast method
              message: string;

              // Whether the toast timer is paused
              paused: () => boolean;

              // The duration setting for this toast
              duration: number;

              // Function to dismiss this toast
              dismiss: () => void;

              // Function to pause the auto-dismiss timer
              pause: () => void;

              // Function to resume the auto-dismiss timer
              play: () => void;
            }
          `,
        },
      ]}
    />
  );
}
