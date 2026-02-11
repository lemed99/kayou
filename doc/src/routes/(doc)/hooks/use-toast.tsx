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
      provider={{
        name: 'ToastProvider',
        description:
          'Wraps your application to provide toast notification context to all useToast hooks. Manages toast rendering, positioning, and auto-dismiss behavior.',
        example: `
          import { ToastProvider } from '@kayou/hooks';

          const methods = {
            success: (props) => (
              <div onMouseEnter={props.pause} onMouseLeave={props.play}>
                {props.message}
                <button onClick={props.dismiss}>\u00d7</button>
              </div>
            ),
          };

          function App() {
            return (
              <ToastProvider methods={methods} position="top-right" duration={3000}>
                <MyApp />
              </ToastProvider>
            );
          }
        `,
        props: [
          {
            name: 'methods',
            type: 'Record<string, Component<ToastMethodProps>>',
            required: true,
            default: '-',
            description:
              'Custom render components for each toast type. Each receives message, dismiss, pause, and play props.',
          },
          {
            name: 'position',
            type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
            default: "'top-right'",
            description: 'Position of toast notifications on screen.',
          },
          {
            name: 'duration',
            type: 'number',
            default: '3000',
            description:
              'Default duration in milliseconds before a toast auto-dismisses. Set to 0 for persistent toasts.',
          },
          {
            name: 'pauseOnHover',
            type: 'boolean',
            default: 'true',
            description:
              'Whether to pause the auto-dismiss timer when hovering over a toast.',
          },
          {
            name: 'gutter',
            type: 'number',
            default: '16',
            description: 'Gap in pixels between stacked toast notifications.',
          },
        ],
      }}
    />
  );
}
