import { createSignal } from 'solid-js';

import Button from '@lib/components/Button';
import Modal from '@lib/components/Modal';
import DocPage from '../../components/DocPage';

export default function ModalPage() {
  const [showDefault, setShowDefault] = createSignal(false);
  const [showCenter, setShowCenter] = createSignal(false);
  const [showLarge, setShowLarge] = createSignal(false);

  return (
    <DocPage
      title="Modal"
      description="Modal dialog component that creates an overlay demanding user attention before they can continue interacting with the page. It renders above all other content with a semi-transparent backdrop, automatically preventing background scrolling and trapping focus within the modal for accessibility. The component handles enter/exit animations smoothly and provides flexible sizing options from small confirmation dialogs to full-screen panels. It uses a portal to render at the document root, avoiding z-index conflicts with parent containers. Uses role='dialog' and aria-modal for accessibility."
      keyConcepts={[
        {
          term: 'Controlled Component',
          explanation:
            'The modal visibility is controlled via the show prop. Parent components manage the open/close state and pass an onClose handler for the close button and backdrop clicks.',
        },
        {
          term: 'Focus Trapping',
          explanation:
            'When open, keyboard focus is trapped within the modal. Tab key cycles through focusable elements inside the modal, preventing users from accidentally interacting with background content.',
        },
        {
          term: 'Scroll Lock',
          explanation:
            'Opening the modal prevents scrolling on the page body. This keeps the modal centered and visible, preventing confusing scroll behavior on the background content.',
        },
        {
          term: 'Backdrop',
          explanation:
            'The semi-transparent overlay behind the modal. Clicking it typically closes the modal, providing an intuitive dismiss interaction.',
        },
      ]}
      value="Modals are fundamental to application workflows: confirmations, forms, detail views, and wizards all rely on focused dialog interactions. This component ensures consistent modal behavior across the application with proper accessibility attributes, focus management, and animation polish. The multiple size options accommodate everything from simple confirmations to complex data entry forms, while the scroll lock prevents the disorienting experience of background content shifting."
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
      ]}
      examples={[
        {
          title: 'Default Modal',
          description: 'Basic modal positioned at the top-center.',
          code: `<Button onClick={() => setShow(true)}>Open Modal</Button>
<Modal show={show()} onClose={() => setShow(false)}>
  <h3 class="text-lg font-semibold">Modal Title</h3>
  <p>Modal content goes here.</p>
</Modal>`,
          component: () => (
            <>
              <Button onClick={() => setShowDefault(true)}>Open Modal</Button>
              <Modal show={showDefault()} onClose={() => setShowDefault(false)}>
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Modal Title</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  This is the modal content. Click outside or the close button to dismiss.
                </p>
              </Modal>
            </>
          ),
        },
        {
          title: 'Centered Modal',
          description: 'Modal centered vertically on the screen.',
          code: `<Modal show={show()} position="center" onClose={() => setShow(false)}>
  <p>Centered modal content</p>
</Modal>`,
          component: () => (
            <>
              <Button onClick={() => setShowCenter(true)}>Open Centered Modal</Button>
              <Modal
                show={showCenter()}
                position="center"
                onClose={() => setShowCenter(false)}
              >
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Centered Modal</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  This modal is centered both horizontally and vertically.
                </p>
              </Modal>
            </>
          ),
        },
        {
          title: 'Large Modal',
          description: 'Modal with larger size.',
          code: `<Modal show={show()} size="lg" onClose={() => setShow(false)}>
  <p>Large modal content</p>
</Modal>`,
          component: () => (
            <>
              <Button onClick={() => setShowLarge(true)}>Open Large Modal</Button>
              <Modal show={showLarge()} size="lg" onClose={() => setShowLarge(false)}>
                <h3 class="mb-4 text-lg font-semibold dark:text-white">Large Modal</h3>
                <p class="text-gray-600 dark:text-gray-300">
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
      usage={`import { Modal } from '@exowpee/the_rock';

// Basic usage
const [show, setShow] = createSignal(false);

<Button onClick={() => setShow(true)}>Open</Button>
<Modal show={show()} onClose={() => setShow(false)}>
  <h3>Modal Title</h3>
  <p>Modal content</p>
</Modal>

// Centered modal
<Modal show={show()} position="center" onClose={handleClose}>
  <p>Centered content</p>
</Modal>

// Different sizes
<Modal show={show()} size="sm" onClose={handleClose}>...</Modal>
<Modal show={show()} size="lg" onClose={handleClose}>...</Modal>
<Modal show={show()} size="xl" onClose={handleClose}>...</Modal>
<Modal show={show()} size="screen" onClose={handleClose}>...</Modal>`}
    />
  );
}
