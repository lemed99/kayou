import DocPage from '../../../components/DocPage';

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
          explanation:
            'Setting a gap displays panels as individual cards with space between them.',
        },
        {
          term: 'Exclusive Mode',
          explanation:
            'When exclusive is true, only one panel can be open at a time. Opening a panel closes others.',
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
          description:
            'Gap between panels (Tailwind spacing value). When set, panels display as separate cards.',
        },
        {
          name: 'exclusive',
          type: 'boolean',
          default: 'false',
          description:
            'When true, only one panel can be open at a time. Opening a panel closes any other open panel.',
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
      playground={`
        import { Accordion } from '@kayou/ui';

        export default function Example() {
          const faqPanels = [
            { itemKey: 'faq-1', title: 'What is SolidJS?', content: 'SolidJS is a declarative JavaScript library for building user interfaces.' },
            { itemKey: 'faq-2', title: 'Why use SolidJS?', content: 'It offers fine-grained reactivity and excellent performance.' },
            { itemKey: 'faq-3', title: 'How does it compare to React?', content: 'SolidJS compiles away the virtual DOM for faster runtime performance.' },
          ];

          const stepPanels = [
            { itemKey: 'step-1', title: 'Step 1: Create Account', content: 'Fill in your details and create a new account to get started.' },
            { itemKey: 'step-2', title: 'Step 2: Verify Email', content: 'Check your inbox and click the verification link we sent you.' },
            { itemKey: 'step-3', title: 'Step 3: Complete Profile', content: 'Add your profile photo and bio to complete setup.' },
          ];

          return (
            <div class="flex flex-col gap-8">
              {/* Basic FAQ */}
              <div>
                <h3 class="mb-2 font-semibold">Basic</h3>
                <Accordion panels={faqPanels} />
              </div>

              {/* Styled with exclusive mode */}
              <div>
                <h3 class="mb-2 font-semibold">Styled + Exclusive Mode</h3>
                <Accordion panels={stepPanels} isSimple={false} exclusive />
              </div>
            </div>
          );
        }
      `}
      usage={`
        import { Accordion, type PanelData } from '@kayou/ui';

        <Accordion panels={panels} />
        <Accordion panels={panels} isSimple={false} />
        <Accordion panels={panels} gap="4" />
        <Accordion panels={panels} exclusive />
        <Accordion panels={panels} highlightedKey="faq-1" />
      `}
    />
  );
}
