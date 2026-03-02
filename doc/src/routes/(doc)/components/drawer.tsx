import DocPage from '../../../components/DocPage';

export default function DrawerPage() {
  return (
    <DocPage
      title="Drawer"
      description="Sliding panel from screen edge with four position variants and optional header."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for slide-in/out animations',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Position Variants',
          explanation: 'Four positions: right, left, bottom, top.',
        },
        {
          term: 'Overlay Behavior',
          explanation: 'Backdrop dims content and closes on click.',
        },
        {
          term: 'Focus Management',
          explanation: 'Focus moves to drawer; closes via backdrop, button, or Escape.',
        },
      ]}
      props={[
        {
          name: 'show',
          type: 'boolean',
          default: 'false',
          description: 'Whether the drawer is visible',
        },
        {
          name: 'position',
          type: '"right" | "left" | "top" | "bottom"',
          default: '"right"',
          description: 'Position from which the drawer slides in',
        },
        {
          name: 'width',
          type: 'string',
          default: '"w-full md:w-fit"',
          description: 'Width of the drawer (for left/right positions)',
        },
        {
          name: 'height',
          type: 'string',
          default: '"h-full md:h-fit"',
          description: 'Height of the drawer (for top/bottom positions)',
        },
        {
          name: 'onClose',
          type: '() => void',
          default: '-',
          description: 'Callback fired when the drawer is closed (required)',
        },
        {
          name: 'title',
          type: 'string',
          default: '-',
          description:
            'Title displayed in the drawer header. Also sets the dialog accessible name via aria-labelledby. Implies showHeader.',
        },
        {
          name: 'roundedEdges',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show rounded edges on the drawer',
        },
        {
          name: 'showHeader',
          type: 'boolean',
          default: 'false',
          description: 'Whether to show the header with close button',
        },
        {
          name: 'bodyClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the body content',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Drawer content',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<DrawerAriaLabels>',
          default: 'DEFAULT_DRAWER_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'DrawerAriaLabels',
          kind: 'type',
          description: 'Aria labels for the Drawer component',
          props: [
            {
              name: 'close',
              type: 'string',
              default: '"Close"',
              description: 'Label for the close button',
            },
          ],
        },
      ]}
      playground={`
        import { Button, Drawer } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [show, setShow] = createSignal(false);

          return (
            <div>
              <Button onClick={() => setShow(true)}>Open Drawer</Button>
              <Drawer show={show()} onClose={() => setShow(false)} title="Settings" width="w-80">
                <div class="space-y-4">
                  <p class="text-neutral-600 dark:text-neutral-300">
                    Adjust your preferences below.
                  </p>
                  <div class="flex justify-end gap-2">
                    <Button color="theme" onClick={() => setShow(false)}>Cancel</Button>
                    <Button onClick={() => setShow(false)}>Save</Button>
                  </div>
                </div>
              </Drawer>
            </div>
          );
        }
      `}
      usage={`
        import { Drawer } from '@kayou/ui';

        <Drawer show={show()} title="My Drawer" onClose={() => setShow(false)}>Content</Drawer>
        <Drawer show={show()} position="left" title="Left" onClose={handleClose}>Content</Drawer>
        <Drawer show={show()} position="bottom" roundedEdges title="Bottom" onClose={handleClose}>Content</Drawer>
      `}
    />
  );
}
