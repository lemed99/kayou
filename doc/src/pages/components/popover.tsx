import { createSignal } from 'solid-js';

import { Button, Popover } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function PopoverPage() {
  const [controlledOpen, setControlledOpen] = createSignal(false);

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
      ]}
      examples={[
        {
          title: 'Basic Popover',
          description: 'Click the button to toggle the popover. Press Escape to close.',
          component: () => (
            <Popover
              content={
                <div class="p-4">
                  <h4 class="font-semibold dark:text-white">Popover Title</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    This is the popover content.
                  </p>
                </div>
              }
            >
              <Button>Click me</Button>
            </Popover>
          ),
        },
        {
          title: 'Hover Trigger',
          description: 'Popover opens on hover instead of click.',
          component: () => (
            <Popover
              onHover
              content={
                <div class="p-3">
                  <p class="text-sm dark:text-gray-300">Hover to see this content!</p>
                </div>
              }
            >
              <Button color="light">Hover over me</Button>
            </Popover>
          ),
        },
        {
          title: 'Different Positions',
          description: 'Popover can be positioned in various directions.',
          component: () => (
            <div class="flex flex-wrap gap-2">
              <Popover
                position="top"
                content={<div class="p-2 text-sm dark:text-white">Top position</div>}
              >
                <Button color="gray">Top</Button>
              </Popover>
              <Popover
                position="right"
                content={<div class="p-2 text-sm dark:text-white">Right position</div>}
              >
                <Button color="gray">Right</Button>
              </Popover>
              <Popover
                position="bottom"
                content={<div class="p-2 text-sm dark:text-white">Bottom position</div>}
              >
                <Button color="gray">Bottom</Button>
              </Popover>
              <Popover
                position="left"
                content={<div class="p-2 text-sm dark:text-white">Left position</div>}
              >
                <Button color="gray">Left</Button>
              </Popover>
            </div>
          ),
        },
        {
          title: 'With Interactive Content',
          description: 'Popover with buttons and interactive elements.',
          component: () => (
            <Popover
              aria-label="Confirm deletion"
              content={
                <div class="w-64 p-4">
                  <h4 class="mb-2 font-semibold dark:text-white">Confirm Action</h4>
                  <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete this item?
                  </p>
                  <div class="flex gap-2">
                    <Button size="sm" color="light">
                      Cancel
                    </Button>
                    <Button size="sm" color="failure">
                      Delete
                    </Button>
                  </div>
                </div>
              }
            >
              <Button color="failure">Delete Item</Button>
            </Popover>
          ),
        },
        {
          title: 'Controlled Mode',
          description:
            'Control the popover state externally with isOpen and onOpenChange.',
          component: () => (
            <div class="flex items-center gap-4">
              <Button onClick={() => setControlledOpen(true)}>Open Popover</Button>
              <Popover
                isOpen={controlledOpen()}
                onOpenChange={setControlledOpen}
                content={
                  <div class="p-4">
                    <p class="mb-3 dark:text-white">This is a controlled popover.</p>
                    <Button size="sm" onClick={() => setControlledOpen(false)}>
                      Close
                    </Button>
                  </div>
                }
              >
                <span class="rounded border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  Or click here
                </span>
              </Popover>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Status: {controlledOpen() ? 'Open' : 'Closed'}
              </span>
            </div>
          ),
        },
        {
          title: 'With Custom Offset',
          description: 'Adjust the distance between trigger and popover.',
          component: () => (
            <div class="flex gap-4">
              <Popover
                offset={4}
                content={
                  <div class="p-3 text-sm dark:text-white">4px offset (close)</div>
                }
              >
                <Button color="light">Small Offset</Button>
              </Popover>
              <Popover
                offset={20}
                content={<div class="p-3 text-sm dark:text-white">20px offset (far)</div>}
              >
                <Button color="light">Large Offset</Button>
              </Popover>
            </div>
          ),
        },
        {
          title: 'Menu-like Popover',
          description: 'Popover styled as a dropdown menu.',
          component: () => (
            <Popover
              position="bottom-start"
              aria-label="Options menu"
              content={
                <div class="w-48 py-1">
                  <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    Duplicate
                  </button>
                  <hr class="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              }
            >
              <Button>Options</Button>
            </Popover>
          ),
        },
        {
          title: 'Disabled Popover',
          description: 'The hidden prop prevents the popover from opening.',
          component: () => (
            <Popover
              hidden
              content={<div class="p-3 dark:text-white">This won't show</div>}
            >
              <Button disabled>Disabled</Button>
            </Popover>
          ),
        },
      ]}
      usage={`
        import { Popover } from '@exowpee/solidly';

        // Basic click-triggered popover
        <Popover content={<div class="p-4">Content here</div>}>
          <Button>Open Popover</Button>
        </Popover>

        // Hover-triggered popover
        <Popover onHover content={<div>Tooltip-like content</div>}>
          <span>Hover me</span>
        </Popover>

        // Controlled mode
        const [open, setOpen] = createSignal(false);
        <Popover
          isOpen={open()}
          onOpenChange={setOpen}
          onClose={() => console.log('closed')}
          content={<div>Controlled content</div>}
        >
          <Button>Trigger</Button>
        </Popover>

        // Different positions
        <Popover position="top" content={...}>...</Popover>
        <Popover position="right-start" content={...}>...</Popover>
        <Popover position="bottom-end" content={...}>...</Popover>

        // Keyboard navigation
        // - Enter/Space: Toggle popover (click mode only)
        // - Escape: Close popover
        // - Tab: Navigate focusable elements inside popover
      `}
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
