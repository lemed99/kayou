import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Accordion, type PanelData } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function AccordionPage() {
  return (
    <DocPage
      title="Accordion"
      description="Collapsible content sections with controlled/uncontrolled modes and keyboard navigation."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for smooth mount/unmount animations',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Controlled vs Uncontrolled',
          explanation: 'Use openPanels + onOpenChange for controlled mode.',
        },
        {
          term: 'Panel Data Structure',
          explanation: 'Objects with itemKey, title, and content properties.',
        },
        {
          term: 'Highlighting',
          explanation: 'highlightedKey emphasizes a panel and scrolls it into view.',
        },
        {
          term: 'Gap Mode',
          explanation: 'Setting a gap displays panels as individual cards with space between them.',
        },
        {
          term: 'Exclusive Mode',
          explanation: 'When exclusive is true, only one panel can be open at a time. Opening a panel closes others.',
        },
      ]}
      props={[
        {
          name: 'panels',
          type: 'PanelData[]',
          default: '[]',
          description:
            'Array of panel data objects containing itemKey, title, content, and optional class overrides',
        },
        {
          name: 'highlightedKey',
          type: 'string',
          default: '-',
          description: 'Key of the panel to highlight and scroll into view',
        },
        {
          name: 'highlightedClass',
          type: 'string',
          default: '"bg-teal-200 dark:bg-teal-800"',
          description: 'CSS class applied to highlighted panel header',
        },
        {
          name: 'isSimple',
          type: 'boolean',
          default: 'true',
          description: 'When true, renders without borders and background styling',
        },
        {
          name: 'gap',
          type: 'string',
          default: '-',
          description: 'Gap between panels (Tailwind spacing value). When set, panels display as separate cards.',
        },
        {
          name: 'exclusive',
          type: 'boolean',
          default: 'false',
          description: 'When true, only one panel can be open at a time. Opening a panel closes any other open panel.',
        },
        {
          name: 'openPanels',
          type: 'Record<string, boolean>',
          default: '-',
          description: 'Controlled state mapping panel keys to open/closed state',
        },
        {
          name: 'onOpenChange',
          type: '(state: Record<string, boolean>) => void',
          default: '-',
          description: 'Callback when panel state changes (required for controlled mode)',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the accordion container',
        },
      ]}
      examples={[
        {
          title: 'Basic Usage',
          description:
            'Simple accordion with default styling. Panels can be opened and closed independently.',
          code: `const panels: PanelData[] = [
  {
    itemKey: 'panel-1',
    title: <span>What is SolidJS?</span>,
    content: <p>SolidJS is a declarative JavaScript library for building user interfaces.</p>,
  },
  {
    itemKey: 'panel-2',
    title: <span>Why use SolidJS?</span>,
    content: <p>It offers fine-grained reactivity and excellent performance.</p>,
  },
  {
    itemKey: 'panel-3',
    title: <span>How does it compare to React?</span>,
    content: <p>SolidJS compiles away the virtual DOM for faster runtime performance.</p>,
  },
];

<Accordion panels={panels} />`,
          component: () => {
            const panels: PanelData[] = [
              {
                itemKey: 'basic-1',
                title: <span>What is SolidJS?</span>,
                content: (
                  <p>
                    SolidJS is a declarative JavaScript library for building user
                    interfaces.
                  </p>
                ),
              },
              {
                itemKey: 'basic-2',
                title: <span>Why use SolidJS?</span>,
                content: (
                  <p>It offers fine-grained reactivity and excellent performance.</p>
                ),
              },
              {
                itemKey: 'basic-3',
                title: <span>How does it compare to React?</span>,
                content: (
                  <p>
                    SolidJS compiles away the virtual DOM for faster runtime performance.
                  </p>
                ),
              },
            ];
            return <Accordion panels={panels} />;
          },
        },
        {
          title: 'Styled Variant',
          description:
            'Set isSimple to false for bordered panels with background highlights.',
          code: `<Accordion panels={panels} isSimple={false} />`,
          component: () => {
            const panels: PanelData[] = [
              {
                itemKey: 'styled-1',
                title: <span class="font-medium">Getting Started</span>,
                content: (
                  <p>
                    Install with npm install solid-js and create your first component.
                  </p>
                ),
              },
              {
                itemKey: 'styled-2',
                title: <span class="font-medium">Core Concepts</span>,
                content: (
                  <p>Learn about signals, effects, and memos for reactive programming.</p>
                ),
              },
              {
                itemKey: 'styled-3',
                title: <span class="font-medium">Advanced Topics</span>,
                content: <p>Explore stores, context, and server-side rendering.</p>,
              },
            ];
            return <Accordion panels={panels} isSimple={false} />;
          },
        },
        {
          title: 'Separated Cards',
          description:
            'Set a gap to display each panel as a separate card. Useful for distinct content sections.',
          code: `<Accordion panels={panels} gap="4" />`,
          component: () => {
            const panels: PanelData[] = [
              {
                itemKey: 'sep-1',
                title: <span class="font-medium">Account Settings</span>,
                content: (
                  <p>Manage your account preferences, password, and security options.</p>
                ),
              },
              {
                itemKey: 'sep-2',
                title: <span class="font-medium">Notification Preferences</span>,
                content: (
                  <p>Configure email, push, and SMS notification settings.</p>
                ),
              },
              {
                itemKey: 'sep-3',
                title: <span class="font-medium">Privacy & Data</span>,
                content: <p>Control your data sharing and privacy settings.</p>,
              },
            ];
            return <Accordion panels={panels} gap="4" />;
          },
        },
        {
          title: 'Exclusive Mode',
          description:
            'Only one panel can be open at a time. Opening a panel automatically closes others.',
          code: `<Accordion panels={panels} exclusive />`,
          component: () => {
            const panels: PanelData[] = [
              {
                itemKey: 'exc-1',
                title: <span class="font-medium">Step 1: Create Account</span>,
                content: (
                  <p>Fill in your details and create a new account to get started.</p>
                ),
              },
              {
                itemKey: 'exc-2',
                title: <span class="font-medium">Step 2: Verify Email</span>,
                content: (
                  <p>Check your inbox and click the verification link we sent you.</p>
                ),
              },
              {
                itemKey: 'exc-3',
                title: <span class="font-medium">Step 3: Complete Profile</span>,
                content: <p>Add your profile photo and bio to complete setup.</p>,
              },
            ];
            return <Accordion panels={panels} exclusive />;
          },
        },
        {
          title: 'Controlled Mode',
          description:
            'Manage open/closed state externally for full control over panel behavior.',
          code: `const [openPanels, setOpenPanels] = createStore<Record<string, boolean>>({
  'ctrl-1': true, // First panel starts open
});

<Accordion
  panels={panels}
  openPanels={openPanels}
  onOpenChange={setOpenPanels}
/>

// Toggle programmatically
<Button onClick={() => setOpenPanels('ctrl-2', true)}>
  Open Panel 2
</Button>`,
          component: () => {
            const [openPanels, setOpenPanels] = createStore<Record<string, boolean>>({
              'ctrl-1': true,
            });
            const panels: PanelData[] = [
              {
                itemKey: 'ctrl-1',
                title: <span>Panel 1 (starts open)</span>,
                content: <p>This panel is open by default via controlled state.</p>,
              },
              {
                itemKey: 'ctrl-2',
                title: <span>Panel 2</span>,
                content: (
                  <p>Click the button below to open this panel programmatically.</p>
                ),
              },
            ];
            return (
              <div class="w-full space-y-4">
                <Accordion
                  panels={panels}
                  openPanels={openPanels}
                  onOpenChange={setOpenPanels}
                />
                <button
                  class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  onClick={() => setOpenPanels('ctrl-2', !openPanels['ctrl-2'])}
                >
                  Toggle Panel 2
                </button>
              </div>
            );
          },
        },
        {
          title: 'Highlighted Panel',
          description:
            'Highlight a specific panel and scroll it into view. Useful for search or navigation.',
          code: `const [highlighted, setHighlighted] = createSignal<string | undefined>();

<Accordion
  panels={panels}
  highlightedKey={highlighted()}
  highlightedClass="bg-yellow-200 dark:bg-yellow-800"
/>

<Button onClick={() => setHighlighted('panel-3')}>
  Highlight Panel 3
</Button>`,
          component: () => {
            const [highlighted, setHighlighted] = createSignal<string | undefined>();
            const panels: PanelData[] = [
              {
                itemKey: 'hl-1',
                title: <span>First Section</span>,
                content: <p>Content for the first section.</p>,
              },
              {
                itemKey: 'hl-2',
                title: <span>Second Section</span>,
                content: <p>Content for the second section.</p>,
              },
              {
                itemKey: 'hl-3',
                title: <span>Third Section</span>,
                content: <p>This panel gets highlighted when you click the button.</p>,
              },
            ];
            return (
              <div class="w-full space-y-4">
                <Accordion
                  panels={panels}
                  highlightedKey={highlighted()}
                  highlightedClass="bg-yellow-200 dark:bg-yellow-800"
                />
                <div class="flex gap-2">
                  <button
                    class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={() => setHighlighted('hl-3')}
                  >
                    Highlight Panel 3
                  </button>
                  <button
                    class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                    onClick={() => setHighlighted(undefined)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            );
          },
        },
        {
          title: 'Custom Panel Styling',
          description:
            'Each panel can have custom classes for the container, title, and content areas.',
          code: `const panels: PanelData[] = [
  {
    itemKey: 'custom-1',
    title: <span>Custom Styled Panel</span>,
    content: <p>This panel has custom styling applied.</p>,
    class: 'border-blue-500',
    titleClass: 'bg-blue-50 dark:bg-blue-900/30',
    contentClass: 'bg-blue-50/50 dark:bg-blue-900/20',
  },
];

<Accordion panels={panels} isSimple={false} />`,
          component: () => {
            const panels: PanelData[] = [
              {
                itemKey: 'custom-1',
                title: (
                  <span class="text-blue-700 dark:text-blue-300">Blue Theme Panel</span>
                ),
                content: <p>This panel has custom blue styling.</p>,
                class: 'border-blue-300 dark:border-blue-700',
                titleClass: 'bg-blue-50 dark:bg-blue-900/30',
                contentClass: 'bg-blue-50/50 dark:bg-blue-900/20',
              },
              {
                itemKey: 'custom-2',
                title: (
                  <span class="text-green-700 dark:text-green-300">
                    Green Theme Panel
                  </span>
                ),
                content: <p>This panel has custom green styling.</p>,
                class: 'border-green-300 dark:border-green-700',
                titleClass: 'bg-green-50 dark:bg-green-900/30',
                contentClass: 'bg-green-50/50 dark:bg-green-900/20',
              },
            ];
            return <Accordion panels={panels} isSimple={false} />;
          },
        },
      ]}
      usage={`import Accordion, { type PanelData } from '@exowpee/solidly/Accordion';

// Define panel data
const panels: PanelData[] = [
  {
    itemKey: 'faq-1',
    title: <span>Question Title</span>,
    content: <p>Answer content here</p>,
  },
  // ... more panels
];

// Basic uncontrolled usage
<Accordion panels={panels} />

// Styled variant with borders
<Accordion panels={panels} isSimple={false} />

// Separated cards with gap
<Accordion panels={panels} gap="4" />

// Exclusive mode (only one panel open at a time)
<Accordion panels={panels} exclusive />

// Controlled mode
const [openPanels, setOpenPanels] = createStore({});

<Accordion
  panels={panels}
  openPanels={openPanels}
  onOpenChange={setOpenPanels}
/>

// With highlighted panel
<Accordion
  panels={panels}
  highlightedKey={searchResult}
  highlightedClass="bg-yellow-200"
/>`}
    />
  );
}
