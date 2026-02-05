import { JSX, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

import { XCloseIcon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { preventBackgroundScroll } from '@kayou/hooks';

/**
 * Get all focusable elements within a container.
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null,
  );
};

export interface ModalAriaLabels {
  close: string;
}

export const DEFAULT_MODAL_ARIA_LABELS: ModalAriaLabels = {
  close: 'Close',
};

/**
 * Size variants for the Modal component.
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'screen';

/**
 * Position options for the Modal component.
 */
export type ModalPosition = 'top-center' | 'center';

/**
 * Props for the Modal component.
 */
export interface ModalProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
  /**
   * Whether the modal is visible.
   * @default false
   */
  show?: boolean;
  /**
   * Size variant of the modal.
   * @default 'md'
   */
  size?: ModalSize;
  /**
   * Position of the modal on screen.
   * @default 'top-center'
   */
  position?: ModalPosition;
  /**
   * Callback fired when the modal is closed.
   */
  onClose: (event: MouseEvent) => void;
  children: JSX.Element;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<ModalAriaLabels>;
}

const theme = {
  backdrop: {
    base: 'fixed z-[90] overflow-hidden inset-0 w-full h-dvh',
    show: 'bg-gray-900/50 dark:bg-neutral-900/80',
  },
  content: {
    base: 'fixed inset-0 flex w-full h-dvh z-[91] p-4',
    inner:
      'relative rounded-lg bg-white shadow dark:bg-neutral-800 w-full max-h-full flex flex-col overflow-hidden',
    sizes: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      screen: 'h-dvh',
    },
    positions: {
      'top-center': 'items-start justify-center',
      center: 'items-center justify-center',
    },
  },
  body: 'p-6 pt-0 grow overflow-y-auto overflow-x-hidden',
  header: {
    base: 'flex items-start justify-between rounded-t p-2 pb-0 shrink-0',
    close: {
      base: 'ml-auto inline-flex items-center cursor-pointer transition-all rounded-lg bg-transparent p-1.5 text-sm text-gray-400 dark:text-neutral-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-neutral-700 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

/**
 * Modal dialog component with backdrop and close button.
 * Uses role="dialog" and aria-modal for accessibility.
 */
const Modal = (props: ModalProps): JSX.Element => {
  const a = createMemo(() => ({ ...DEFAULT_MODAL_ARIA_LABELS, ...props.ariaLabels }));
  const size = createMemo(() => props.size || 'md');
  const position = createMemo(() => props.position || 'top-center');
  const [modalEl, setModalEl] = createSignal<HTMLDivElement | undefined>();

  const { isVisible, isMounted } = createPresence(() => props.show, {
    transitionDuration: 500,
  });

  createEffect(() => {
    if (props.show && modalEl()) {
      preventBackgroundScroll(modalEl()!);
    }
  });

  // Focus trap and Escape key handler
  createEffect(() => {
    if (!props.show || !modalEl()) return;

    const modal = modalEl()!;

    // Focus the first focusable element when modal opens
    queueMicrotask(() => {
      const focusable = getFocusableElements(modal);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        props.onClose(e as unknown as MouseEvent);
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements(modal);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  const transitionStyle = () => ({
    transition: 'opacity .5s cubic-bezier(.32, .72, 0, 1)',
    opacity: isVisible() ? '1' : '0',
  });

  return (
    <Show when={isMounted()}>
      <Portal>
        <div
          class={twMerge(theme.backdrop.base, theme.backdrop.show)}
          style={transitionStyle()}
        />
        <div
          class={twMerge(
            theme.content.base,
            theme.content.positions[position()],
            props.class,
          )}
          style={transitionStyle()}
          onClick={(e) => props?.onClose(e)}
        >
          <div
            ref={setModalEl}
            role="dialog"
            aria-modal="true"
            class={twMerge(theme.content.inner, theme.content.sizes[size()])}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={theme.header.base}>
              <button
                aria-label={a().close}
                class={theme.header.close.base}
                type="button"
                onClick={(e) => props.onClose(e)}
              >
                <XCloseIcon class={theme.header.close.icon} />
              </button>
            </div>
            <div class={theme.body}>{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
