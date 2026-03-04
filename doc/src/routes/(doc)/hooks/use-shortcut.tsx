import HookDocPage from '../../../components/HookDocPage';

export default function UseShortcutPage() {
  return (
    <HookDocPage
      title="useShortcut"
      description="Register a keyboard shortcut action within a ShortcutProvider. The shortcut is automatically unregistered when the component unmounts. Must be used within a ShortcutProvider."
      relatedHooks={[
        { name: 'ShortcutPanel', path: '/components/shortcut-panel', description: 'UI panel for viewing and editing keyboard shortcuts.' },
      ]}
      parameters={[
        {
          name: 'actionId',
          type: 'string',
          required: true,
          description: 'Unique identifier for the action. If an action with this ID already exists, it is replaced.',
        },
        {
          name: 'options',
          type: 'UseShortcutOptions',
          required: true,
          description: 'Configuration object for the shortcut action.',
        },
      ]}
      returnType="UseShortcutReturn"
      returns={[
        {
          name: 'trigger',
          type: '() => void',
          description: 'Programmatically invoke the action handler.',
        },
      ]}
      types={[
        {
          name: 'UseShortcutOptions',
          description: 'Configuration for a keyboard shortcut action.',
          props: [
            {
              name: 'shortcut',
              type: 'string',
              description: 'Key combination string, e.g. "Ctrl+S", "Ctrl+Shift+K". Modifiers: Ctrl, Alt, Shift, Meta.',
            },
            {
              name: 'handler',
              type: '() => void',
              description: 'Function to call when the shortcut is pressed.',
            },
            {
              name: 'label',
              type: 'string',
              description: 'Human-readable label displayed in ShortcutPanel.',
            },
            {
              name: 'description',
              type: 'string',
              default: '-',
              description: 'Optional description explaining the action.',
            },
            {
              name: 'category',
              type: 'string',
              default: '-',
              description: 'Grouping category for the ShortcutPanel display.',
            },
            {
              name: 'ignoreInputs',
              type: 'boolean',
              default: 'true',
              description: 'When true, the shortcut is suppressed while focus is in an input, textarea, select, or contenteditable element.',
            },
          ],
        },
        {
          name: 'UseShortcutReturn',
          description: 'Return value from useShortcut.',
          props: [
            {
              name: 'trigger',
              type: '() => void',
              description: 'Programmatically trigger the action.',
            },
          ],
        },
        {
          name: 'ShortcutAction',
          description: 'Internal action type used by the ShortcutProvider registry.',
          props: [
            { name: 'id', type: 'string', description: 'Unique action identifier.' },
            { name: 'label', type: 'string', description: 'Human-readable label.' },
            { name: 'description', type: 'string', default: '-', description: 'Action description.' },
            { name: 'category', type: 'string', default: '-', description: 'Grouping category.' },
            { name: 'defaultShortcut', type: 'string', description: 'Default key combination.' },
            { name: 'handler', type: '() => void', description: 'Action handler function.' },
            { name: 'ignoreInputs', type: 'boolean', default: 'true', description: 'Whether to suppress in input elements.' },
          ],
        },
      ]}
      usage={`
        import { useShortcut } from '@kayou/hooks';

        useShortcut('save-document', {
          shortcut: 'Ctrl+S',
          handler: () => saveDocument(),
          label: 'Save document',
          description: 'Save the current document',
          category: 'File',
        });

        useShortcut('toggle-sidebar', {
          shortcut: 'Ctrl+B',
          handler: () => toggleSidebar(),
          label: 'Toggle sidebar',
          category: 'View',
          ignoreInputs: false,
        });
      `}
      provider={{
        name: 'ShortcutProvider',
        description:
          'Wraps your application to provide keyboard shortcut context. Manages the action registry, global keydown listener, localStorage persistence, and conflict detection.',
        example: `
          import { ShortcutProvider } from '@kayou/hooks';

          function App() {
            return (
              <ShortcutProvider namespace="my-app">
                <MyApp />
              </ShortcutProvider>
            );
          }
        `,
        props: [
          {
            name: 'namespace',
            type: 'string',
            default: '-',
            description:
              'Optional namespace for localStorage persistence. Custom key bindings are saved to localStorage under "shortcuts:{namespace}". Omit to disable persistence.',
          },
        ],
      }}
    />
  );
}
