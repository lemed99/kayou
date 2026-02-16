import DocPage from '../../../components/DocPage';

export default function ModalPage() {
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
          type: '() => void',
          default: '-',
          description: 'Callback fired when the modal is closed (required)',
        },
        {
          name: 'title',
          type: 'string',
          default: '-',
          description:
            'Title displayed in the modal header. Also sets the dialog accessible name via aria-labelledby.',
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
      playground={`
        import { Button, Modal } from '@kayou/ui';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [show, setShow] = createSignal(false);

          return (
            <div>
              <Button onClick={() => setShow(true)}>Open Modal</Button>
              <Modal show={show()} title="Confirm Action" onClose={() => setShow(false)}>
                <p class="text-neutral-600 dark:text-neutral-300">
                  Are you sure you want to proceed? This action cannot be undone.
                </p>
                <div class="mt-4 flex justify-end gap-2">
                  <Button color="light" onClick={() => setShow(false)}>Cancel</Button>
                  <Button onClick={() => setShow(false)}>Confirm</Button>
                </div>
              </Modal>
            </div>
          );
        }
      `}
      usage={`
        import { Modal } from '@kayou/ui';

        <Modal show={show()} title="My Modal" onClose={() => setShow(false)}>Content</Modal>
        <Modal show={show()} title="Centered" position="center" onClose={handleClose}>Content</Modal>
        <Modal show={show()} title="Large" size="xl" onClose={handleClose}>Content</Modal>
      `}
    />
  );
}
