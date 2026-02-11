import DocPage from '../../../components/DocPage';

export default function PopoverPage() {
  return (
    <DocPage
      title="Popover"
      description="Floating overlay for rich content with auto-positioning, click/hover triggers, and keyboard support."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for popover open/close transitions',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Trigger Mode',
          explanation:
            'Opens on click (default) or hover; click suits interactive content.',
        },
        {
          term: 'Placement',
          explanation:
            '12 positions (side + alignment); auto-flips if space is insufficient.',
        },
        {
          term: 'Controlled vs Uncontrolled',
          explanation:
            'Use isOpen/onOpenChange for controlled; otherwise manages state internally.',
        },
        {
          term: 'Click Outside',
          explanation: 'Closes when clicking outside for intuitive dismiss behavior.',
        },
      ]}
      props={[
        {
          name: 'content',
          type: 'JSX.Element',
          default: '-',
          description: 'Content to display inside the popover (required)',
          required: true,
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Trigger element that opens the popover (required)',
          required: true,
        },
        {
          name: 'onHover',
          type: 'boolean',
          default: 'false',
          description: 'Whether to trigger the popover on hover instead of click',
        },
        {
          name: 'position',
          type: 'Placement',
          default: '"bottom"',
          description:
            'Position of the popover. Options: "top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"',
        },
        {
          name: 'offset',
          type: 'number',
          default: '8',
          description: 'Distance in pixels between the trigger and popover',
        },
        {
          name: 'hidden',
          type: 'boolean',
          default: 'false',
          description: 'Whether the popover is disabled and cannot be opened',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          default: '-',
          description:
            'Controlled open state. When provided, the component becomes controlled',
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          default: '-',
          description: 'Callback fired when the open state changes',
        },
        {
          name: 'onClose',
          type: '() => void',
          default: '-',
          description: 'Callback fired when the popover closes',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the popover content container',
        },
        {
          name: 'floatingClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the floating container',
        },
        {
          name: 'wrapperClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the outer wrapper container',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: 'Accessible label for the popover dialog',
        },
        {
          name: 'onMouseEnter',
          type: '() => void',
          default: '-',
          description: 'Callback fired when mouse enters the trigger or popover',
        },
        {
          name: 'onMouseLeave',
          type: '() => void',
          default: '-',
          description: 'Callback fired when mouse leaves the trigger or popover',
        },
        {
          name: 'backgroundScrollBehavior',
          type: '"prevent" | "close" | "follow"',
          default: '"close"',
          description:
            'How to handle background scroll when popover is open. "close" closes on scroll, "follow" updates position and hides when anchor exits, "prevent" locks scroll.',
        },
      ]}
      playground={`
        import { Button, Popover } from '@kayou/ui';

        export default function Example() {
          return (
            <Popover
              aria-label="User info"
              content={
                <div class="w-64 p-4">
                  <h4 class="font-semibold dark:text-white">Popover Title</h4>
                  <p class="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                    This is the popover content. Click outside or press Escape to close.
                  </p>
                </div>
              }
            >
              <Button>Click me</Button>
            </Popover>
          );
        }
      `}
      usage={`
        import { Popover } from '@kayou/ui';

        <Popover content={<div>Content</div>}><Button>Open</Button></Popover>
        <Popover onHover content={<div>Content</div>}><span>Hover me</span></Popover>
        <Popover position="top" content={<div>Content</div>}><Button>Open</Button></Popover>
      `}
      subComponents={[
        {
          name: 'Placement',
          kind: 'type',
          description: 'Position of the popover relative to its trigger element.',
          values: [
            'top',
            'top-start',
            'top-end',
            'bottom',
            'bottom-start',
            'bottom-end',
            'left',
            'left-start',
            'left-end',
            'right',
            'right-start',
            'right-end',
          ],
        },
      ]}
      relatedHooks={[
        {
          name: 'useFloating',
          path: '/hooks/use-floating',
          description:
            'Positioning engine that handles floating element placement, viewport boundary detection, and automatic flipping.',
        },
      ]}
    />
  );
}
