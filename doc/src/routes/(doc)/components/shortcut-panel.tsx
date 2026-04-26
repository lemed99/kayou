import DocPage from '../../../components/DocPage';

export default function ShortcutPanelPage() {
  return (
    <DocPage
      title="ShortcutPanel"
      description="UI panel for viewing and editing keyboard shortcuts. Displays registered shortcuts grouped by category with inline editing, conflict detection, and search. Must be used within a ShortcutProvider."
      relatedHooks={[
        {
          name: 'useShortcut',
          path: '/hooks/use-shortcut',
          description: 'Hook to register keyboard shortcut actions.',
        },
      ]}
      keyConcepts={[
        {
          term: 'Recording Mode',
          explanation:
            'Click the edit button on a shortcut, then press any key combination to rebind it. Press Escape to cancel.',
        },
        {
          term: 'Conflict Detection',
          explanation:
            'When two actions share the same key combo, a red "Conflict" badge appears on both.',
        },
        {
          term: 'Category Grouping',
          explanation:
            'Shortcuts are grouped by their category property with section headers.',
        },
        {
          term: 'Platform Display',
          explanation:
            'Key combos show platform-native symbols: \u2318 for Ctrl on Mac, \u2325 for Alt, \u21E7 for Shift.',
        },
      ]}
      props={[
        {
          name: 'labels',
          type: 'Partial<ShortcutPanelLabels>',
          default: 'DEFAULT_SHORTCUT_PANEL_LABELS',
          description: 'Visible text labels for i18n',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<ShortcutPanelAriaLabels>',
          default: 'DEFAULT_SHORTCUT_PANEL_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the panel container',
        },
      ]}
      subComponents={[
        {
          name: 'ShortcutPanelLabels',
          kind: 'type',
          description: 'Visible text labels for the panel',
          props: [
            {
              name: 'search',
              type: 'string',
              default: '"Search shortcuts..."',
              description: 'Search input placeholder',
            },
            {
              name: 'resetAll',
              type: 'string',
              default: '"Reset all"',
              description: 'Reset all button text',
            },
            {
              name: 'resetToDefault',
              type: 'string',
              default: '"Reset"',
              description: 'Per-action reset button text',
            },
            {
              name: 'pressKeyCombination',
              type: 'string',
              default: '"Press a key combination..."',
              description: 'Recording mode prompt',
            },
            {
              name: 'noShortcuts',
              type: 'string',
              default: '"No shortcuts registered"',
              description: 'Empty state message',
            },
            {
              name: 'conflict',
              type: 'string',
              default: '"Conflict"',
              description: 'Conflict badge text',
            },
            {
              name: 'cancel',
              type: 'string',
              default: '"Cancel"',
              description: 'Cancel recording button text',
            },
          ],
        },
        {
          name: 'ShortcutPanelAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for screen readers',
          props: [
            {
              name: 'shortcutList',
              type: 'string',
              default: '"Keyboard shortcuts"',
              description: 'Panel region aria-label',
            },
            {
              name: 'editShortcut',
              type: 'string',
              default: '"Edit shortcut"',
              description: 'Edit button aria-label prefix',
            },
            {
              name: 'searchShortcuts',
              type: 'string',
              default: '"Search shortcuts"',
              description: 'Search input aria-label',
            },
          ],
        },
      ]}
      playground={`
        import { ShortcutProvider, useShortcut } from '@kayou/hooks';
        import { ShortcutPanel } from '@kayou/ui';
        import { createSignal, Show } from 'solid-js';

        function Actions() {
          const [last, setLast] = createSignal('');

          useShortcut('save', {
            shortcut: 'Ctrl+S',
            handler: () => setLast('Save'),
            label: 'Save',
            description: 'Save the current document',
            category: 'File',
          });

          useShortcut('find', {
            shortcut: 'Ctrl+F',
            handler: () => setLast('Find'),
            label: 'Find',
            description: 'Search in document',
            category: 'Edit',
          });

          useShortcut('undo', {
            shortcut: 'Ctrl+Z',
            handler: () => setLast('Undo'),
            label: 'Undo',
            description: 'Undo last action',
            category: 'Edit',
          });

          return (
            <div class="flex flex-col gap-4">
              <Show when={last()}>
                <p class="rounded bg-green-100 p-2 text-sm text-green-800">
                  Last action: {last()}
                </p>
              </Show>
              <ShortcutPanel />
            </div>
          );
        }

        export default function Example() {
          return (
            <ShortcutProvider namespace="demo">
              <Actions />
            </ShortcutProvider>
          );
        }
      `}
      usage={`
        import { ShortcutProvider, useShortcut } from '@kayou/hooks';
        import { ShortcutPanel } from '@kayou/ui';

        {/* Wrap your app with ShortcutProvider */}
        <ShortcutProvider namespace="my-app">
          <MyApp />
        </ShortcutProvider>

        {/* Place the panel anywhere inside the provider */}
        <ShortcutPanel />
        <ShortcutPanel labels={{ search: 'Rechercher...' }} />
      `}
    />
  );
}
