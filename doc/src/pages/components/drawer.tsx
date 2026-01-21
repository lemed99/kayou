import { createSignal } from 'solid-js';

import { Button, Drawer } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

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
      ]}
      examples={[
        {
          title: 'Right Drawer',
          description: 'Drawer sliding in from the right (default).',
          code: `<Button onClick={() => setShow(true)}>Open Right Drawer</Button>
<Drawer show={show()} onClose={() => setShow(false)} showHeader>
  <p>Drawer content goes here</p>
</Drawer>`,
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
          code: `<Drawer show={show()} position="left" onClose={() => setShow(false)}>
  <p>Left drawer content</p>
</Drawer>`,
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
          code: `<Drawer show={show()} position="top" onClose={() => setShow(false)}>
  <p>Top drawer content</p>
</Drawer>`,
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
          code: `<Drawer
  show={show()}
  position="bottom"
  roundedEdges
  onClose={() => setShow(false)}
>
  <p>Bottom drawer content</p>
</Drawer>`,
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
      usage={`import { Drawer } from '@exowpee/solidly';

// Basic usage
const [show, setShow] = createSignal(false);

<Button onClick={() => setShow(true)}>Open Drawer</Button>
<Drawer show={show()} onClose={() => setShow(false)}>
  <p>Drawer content</p>
</Drawer>

// With header and custom width
<Drawer
  show={show()}
  onClose={() => setShow(false)}
  showHeader
  width="w-96"
>
  <p>Content here</p>
</Drawer>

// Different positions
<Drawer show={show()} position="left" onClose={handleClose}>...</Drawer>
<Drawer show={show()} position="top" onClose={handleClose}>...</Drawer>
<Drawer show={show()} position="bottom" onClose={handleClose}>...</Drawer>

// With rounded edges
<Drawer show={show()} roundedEdges onClose={handleClose}>...</Drawer>`}
    />
  );
}
