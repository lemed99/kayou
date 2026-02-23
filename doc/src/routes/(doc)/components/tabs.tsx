import DocPage from '../../../components/DocPage';

export default function TabsPage() {
  return (
    <DocPage
      title="Tabs"
      description="Accessible tabbed interface with WAI-ARIA compliance, keyboard navigation, and multiple visual variants."
      keyConcepts={[
        {
          term: 'Controlled vs Uncontrolled',
          explanation:
            'Use activeTab + onTabChange for controlled mode, or omit both for automatic internal state.',
        },
        {
          term: 'Tab Data Structure',
          explanation:
            'Objects with key, label, content (JSX or function), and optional disabled flag.',
        },
        {
          term: 'Keyboard Navigation',
          explanation:
            'ArrowLeft/Right to move between tabs, Home/End for first/last. Tab key moves focus into the panel.',
        },
        {
          term: 'Lazy Rendering',
          explanation:
            'When lazy is true, only the active panel is mounted. Inactive panels are removed from the DOM.',
        },
        {
          term: 'Variants',
          explanation:
            'Three visual styles: underline (default), pills, and bordered.',
        },
      ]}
      props={[
        {
          name: 'tabs',
          type: 'TabData[]',
          default: '-',
          description:
            'Array of tab objects with key, label, content, and optional disabled flag (required)',
        },
        {
          name: 'activeTab',
          type: 'string',
          default: '-',
          description: 'Controlled: currently active tab key',
        },
        {
          name: 'onTabChange',
          type: '(key: string) => void',
          default: '-',
          description: 'Callback when active tab changes (works in both controlled and uncontrolled modes)',
        },
        {
          name: 'variant',
          type: "'underline' | 'pills' | 'bordered'",
          default: "'underline'",
          description: 'Visual style variant',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size of tab buttons',
        },
        {
          name: 'lazy',
          type: 'boolean',
          default: 'false',
          description: 'When true, only the active panel is rendered in the DOM',
        },
        {
          name: 'tabListClass',
          type: 'string',
          default: '-',
          description: 'Custom CSS class for the tab list container',
        },
        {
          name: 'tabClass',
          type: 'string',
          default: '-',
          description: 'Custom CSS class applied to each tab button',
        },
        {
          name: 'panelClass',
          type: 'string',
          default: '-',
          description: 'Custom CSS class applied to each tab panel',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<TabsAriaLabels>',
          default: 'DEFAULT_TABS_ARIA_LABELS',
          description: 'Accessibility labels for the component (tabList aria-label)',
        },
      ]}
      subComponents={[
        {
          name: 'TabData',
          kind: 'type',
          description: 'Data structure for each tab',
          props: [
            { name: 'key', type: 'string', default: '-', description: 'Unique identifier for the tab' },
            { name: 'label', type: 'JSX.Element', default: '-', description: 'Content displayed in the tab button' },
            {
              name: 'content',
              type: 'JSX.Element | () => JSX.Element',
              default: '-',
              description: 'Panel content. Use a function for lazy evaluation.',
            },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the tab is disabled' },
          ],
        },
        {
          name: 'TabsAriaLabels',
          kind: 'type',
          description: 'Accessibility labels for i18n',
          props: [
            { name: 'tabList', type: 'string', default: '"Tabs"', description: 'aria-label for the tablist element' },
          ],
        },
      ]}
      playground={`
        import { Tabs } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [active, setActive] = createSignal('general');

          return (
            <div class="flex flex-col gap-8">
              {/* Underline (default) */}
              <div>
                <h3 class="mb-2 font-semibold">Underline</h3>
                <Tabs
                  tabs={[
                    { key: 'general', label: 'General', content: <p>General settings panel.</p> },
                    { key: 'security', label: 'Security', content: <p>Security settings panel.</p> },
                    { key: 'billing', label: 'Billing', content: <p>Billing settings panel.</p> },
                  ]}
                />
              </div>

              {/* Pills */}
              <div>
                <h3 class="mb-2 font-semibold">Pills</h3>
                <Tabs
                  variant="pills"
                  tabs={[
                    { key: 'all', label: 'All', content: <p>All items.</p> },
                    { key: 'active', label: 'Active', content: <p>Active items.</p> },
                    { key: 'archived', label: 'Archived', content: <p>Archived items.</p>, disabled: true },
                  ]}
                />
              </div>

              {/* Bordered + Controlled */}
              <div>
                <h3 class="mb-2 font-semibold">Bordered + Controlled</h3>
                <Tabs
                  variant="bordered"
                  activeTab={active()}
                  onTabChange={setActive}
                  tabs={[
                    { key: 'general', label: 'General', content: <p>Controlled general panel.</p> },
                    { key: 'advanced', label: 'Advanced', content: <p>Controlled advanced panel.</p> },
                  ]}
                />
              </div>
            </div>
          );
        }
      `}
      usage={`
        import { Tabs, type TabData } from '@kayou/ui';

        {/* Uncontrolled */}
        <Tabs tabs={tabs} />

        {/* Controlled */}
        <Tabs tabs={tabs} activeTab={active()} onTabChange={setActive} />

        {/* Variants */}
        <Tabs tabs={tabs} variant="pills" />
        <Tabs tabs={tabs} variant="bordered" />

        {/* Lazy rendering */}
        <Tabs tabs={tabs} lazy />

        {/* Sizes */}
        <Tabs tabs={tabs} size="sm" />
        <Tabs tabs={tabs} size="lg" />
      `}
    />
  );
}
