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
      types={[
        {
          name: 'ToastMethodProps',
          description:
            'Props passed to each custom toast method component defined in the methods record.',
          props: [
            {
              name: 'message',
              type: 'string',
              description: 'The message passed when creating the toast.',
            },
            {
              name: 'paused',
              type: '() => boolean',
              description: 'Accessor returning whether the toast is currently paused.',
            },
            {
              name: 'duration',
              type: 'number',
              description: 'The configured duration for this toast in milliseconds.',
            },
            {
              name: 'dismiss',
              type: '() => void',
              description: 'Dismiss this toast.',
            },
            {
              name: 'pause',
              type: '() => void',
              description: 'Pause the auto-dismiss timer for this toast.',
            },
            {
              name: 'play',
              type: '() => void',
              description: 'Resume the auto-dismiss timer for this toast.',
            },
          ],
        },
        {
          name: 'ToastOptions',
          description:
            'Options that can be passed when creating a toast to override provider defaults.',
          props: [
            {
              name: 'position',
              type: 'ToastPosition',
              default: "'top-right'",
              description: 'Override the position for this specific toast.',
            },
            {
              name: 'duration',
              type: 'number',
              default: '3000',
              description:
                'Override the auto-dismiss duration in milliseconds for this toast.',
            },
            {
              name: 'pauseOnHover',
              type: 'boolean',
              default: 'true',
              description:
                'Override whether hovering pauses the auto-dismiss timer for this toast.',
            },
          ],
        },
        {
          name: 'ToastPosition',
          description: 'Available positions for toast notifications.',
          values: [
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-center',
            'bottom-right',
          ],
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
