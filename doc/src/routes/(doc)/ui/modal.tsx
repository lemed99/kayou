import { createSignal } from 'solid-js';

import { Button, Modal } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function ModalPage() {
  const [showDefault, setShowDefault] = createSignal(false);
  const [showCenter, setShowCenter] = createSignal(false);
  const [showLarge, setShowLarge] = createSignal(false);

  return (
    <DocPage
      title="Modal"
      description="Dialog overlay with backdrop, focus trapping, scroll lock, and flexible sizing options."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for smooth modal open/close transitions',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Controlled Component',
          explanation: 'Parent manages visibility via show prop and onClose handler.',
        },
        {
          term: 'Focus Trapping',
          explanation: 'Tab key cycles only through elements inside the modal.',
        },
        {
          term: 'Scroll Lock',
          explanation: 'Prevents body scrolling while modal is open.',
        },
        {
          term: 'Backdrop',
          explanation: 'Click the overlay behind the modal to dismiss.',
        },
      ]}
      props={[
        {
          name: 'show',
          type: 'boolean',
          default: 'false',
          description: 'Whether the modal is visible',
        },
        {
          name: 'size',
          type: '"sm" | "md" | "lg" | "xl" | "screen"',
          default: '"md"',
          description: 'Size variant of the modal',
        },
        {
          name: 'position',
          type: '"top-center" | "center"',
          default: '"top-center"',
          description: 'Position of the modal on screen',
        },
        {
          name: 'onClose',
          type: '(event: MouseEvent) => void',
          default: '-',
          description: 'Callback fired when the modal is closed (required)',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Modal content (required)',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<ModalAriaLabels>',
          default: 'DEFAULT_MODAL_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'ModalAriaLabels',
          kind: 'type',
          description: 'Aria labels for the Modal component',
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
          title: 'Default Modal',
          description: 'Basic modal positioned at the top-center.',
          component: () => (
            <>
              <Button onClick={() => setShowDefault(true)}>Open Modal</Button>
              <Modal show={showDefault()} onClose={() => setShowDefault(false)}>
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Modal Title</h3>
                <p class="text-gray-600 dark:text-neutral-300">
                  This is the modal content. Click outside or the close button to dismiss.
                </p>
              </Modal>
            </>
          ),
        },
        {
          title: 'Centered Modal',
          description: 'Modal centered vertically on the screen.',
          component: () => (
            <>
              <Button onClick={() => setShowCenter(true)}>Open Centered Modal</Button>
              <Modal
                show={showCenter()}
                position="center"
                onClose={() => setShowCenter(false)}
              >
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Centered Modal</h3>
                <p class="text-gray-600 dark:text-neutral-300">
                  This modal is centered both horizontally and vertically.
                </p>
              </Modal>
            </>
          ),
        },
        {
          title: 'Large Modal',
          description: 'Modal with larger size.',
          component: () => (
            <>
              <Button onClick={() => setShowLarge(true)}>Open Large Modal</Button>
              <Modal show={showLarge()} size="xl" onClose={() => setShowLarge(false)}>
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Large Modal</h3>
                <p class="text-gray-600 dark:text-neutral-300">
                  This modal uses the large size variant for more content space.
                </p>
                <div class="mt-4 flex justify-end gap-2">
                  <Button color="light" onClick={() => setShowLarge(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowLarge(false)}>Confirm</Button>
                </div>
              </Modal>
            </>
          ),
        },
      ]}
      usage={`
        import { Modal } from '@kayou/ui';

        <Modal show={show()} onClose={() => setShow(false)}>Content</Modal>
        <Modal show={show()} position="center" onClose={handleClose}>Content</Modal>
        <Modal show={show()} size="xl" onClose={handleClose}>Content</Modal>
      `}
    />
  );
}
