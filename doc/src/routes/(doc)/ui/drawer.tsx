import { createSignal } from 'solid-js';

import { Button, Drawer } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function DrawerPage() {
  const [showRight, setShowRight] = createSignal(false);
  const [showLeft, setShowLeft] = createSignal(false);
  const [showTop, setShowTop] = createSignal(false);
  const [showBottom, setShowBottom] = createSignal(false);

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
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Callback fired when the drawer is closed (required)',
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
      examples={[
        {
          title: 'Right Drawer',
          description: 'Drawer sliding in from the right (default).',
          component: () => (
            <>
              <Button onClick={() => setShowRight(true)}>Open Right Drawer</Button>
              <Drawer
                show={showRight()}
                onClose={() => setShowRight(false)}
                showHeader
                width="w-80"
              >
                <p>This drawer slides in from the right.</p>
              </Drawer>
            </>
          ),
        },
        {
          title: 'Left Drawer',
          description: 'Drawer sliding in from the left.',
          component: () => (
            <>
              <Button onClick={() => setShowLeft(true)}>Open Left Drawer</Button>
              <Drawer
                show={showLeft()}
                position="left"
                onClose={() => setShowLeft(false)}
                showHeader
                width="w-80"
              >
                <p>This drawer slides in from the left.</p>
              </Drawer>
            </>
          ),
        },
        {
          title: 'Top Drawer',
          description: 'Drawer sliding in from the top.',
          component: () => (
            <>
              <Button onClick={() => setShowTop(true)}>Open Top Drawer</Button>
              <Drawer
                show={showTop()}
                position="top"
                onClose={() => setShowTop(false)}
                showHeader
                height="h-48"
              >
                <p>This drawer slides in from the top.</p>
              </Drawer>
            </>
          ),
        },
        {
          title: 'Bottom Drawer with Rounded Edges',
          description: 'Drawer with rounded edges option.',
          component: () => (
            <>
              <Button onClick={() => setShowBottom(true)}>Open Bottom Drawer</Button>
              <Drawer
                show={showBottom()}
                position="bottom"
                roundedEdges
                onClose={() => setShowBottom(false)}
                showHeader
                height="h-48"
              >
                <p>This drawer has rounded edges and slides from the bottom.</p>
              </Drawer>
            </>
          ),
        },
      ]}
      usage={`
        import { Drawer } from '@kayou/ui';

        <Drawer show={show()} onClose={() => setShow(false)}>Content</Drawer>
        <Drawer show={show()} position="left" showHeader onClose={handleClose}>Content</Drawer>
        <Drawer show={show()} position="bottom" roundedEdges onClose={handleClose}>Content</Drawer>
      `}
    />
  );
}
