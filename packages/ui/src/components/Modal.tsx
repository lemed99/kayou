import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { preventBackgroundScroll } from '@kayou/hooks';
import { XCloseIcon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

/**
 * Get all focusable elements within a container.
 */
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary',
  'audio[controls]',
  'video[controls]',
].join(', ');

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
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
export interface ModalProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
   * Callback fired when the modal is closed (via close button, Escape, or backdrop click).
   */
  onClose: () => void;
  children: JSX.Element;
  /**
   * Title displayed in the modal header. Also sets the dialog's accessible name via aria-labelledby.
   */
  title?: string;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<ModalAriaLabels>;
}

const theme = {
  backdrop: {
    base: 'fixed z-[90] overflow-hidden inset-0 w-full h-dvh',
    show: 'bg-neutral-900/50 dark:bg-neutral-900/80',
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
  body: 'p-6 grow overflow-y-auto overflow-x-hidden',
  header: {
    base: 'flex items-start justify-between rounded-t p-2 pb-0 shrink-0',
    title: 'grow px-4 pt-1 text-lg font-semibold text-neutral-900 dark:text-white',
    close: {
      base: 'ml-auto inline-flex items-center cursor-pointer transition-all rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 dark:text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

/**
 * Modal dialog component with backdrop and close button.
 * Uses role="dialog" and aria-modal for accessibility.
 */
const Modal = (props: ModalProps): JSX.Element => {
  const [local, dialogProps] = splitProps(props, [
    'show',
    'size',
    'position',
    'onClose',
    'children',
    'title',
    'ariaLabels',
    'class',
  ]);

  const a = createMemo(() => ({ ...DEFAULT_MODAL_ARIA_LABELS, ...local.ariaLabels }));
  const size = createMemo(() => local.size || 'md');
  const position = createMemo(() => local.position || 'top-center');
  const [modalEl, setModalEl] = createSignal<HTMLDivElement | undefined>();
  const titleId = createUniqueId();

  const { isVisible, isMounted } = createPresence(() => local.show, {
    transitionDuration: 500,
  });

  createEffect(() => {
    if (local.show && modalEl()) {
      preventBackgroundScroll(modalEl()!);
    }
  });

  // Focus trap, Escape key handler, and focus restoration
  createEffect(() => {
    if (!local.show || !modalEl()) return;

    const modal = modalEl()!;
    const previouslyFocused = document.activeElement as HTMLElement | null;

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
        local.onClose();
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
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    });
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
            local.class,
          )}
          style={transitionStyle()}
          onClick={() => local.onClose()}
        >
          <div
            {...dialogProps}
            ref={setModalEl}
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? titleId : undefined}
            class={twMerge(theme.content.inner, theme.content.sizes[size()])}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={theme.header.base}>
              <Show when={local.title}>
                <h2 id={titleId} class={theme.header.title}>
                  {local.title}
                </h2>
              </Show>
              <button
                aria-label={a().close}
                class={theme.header.close.base}
                type="button"
                onClick={() => local.onClose()}
              >
                <XCloseIcon class={theme.header.close.icon} />
              </button>
            </div>
            <div class={twMerge(theme.body, local.title ? 'pt-4' : 'pt-0')}>
              {local.children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
