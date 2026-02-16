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

export interface DrawerAriaLabels {
  close: string;
}

export const DEFAULT_DRAWER_ARIA_LABELS: DrawerAriaLabels = {
  close: 'Close',
};

/**
 * Position options for the Drawer component.
 */
export type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';

/**
 * Props for the Drawer component.
 */
export interface DrawerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  /**
   * Whether the drawer is visible.
   * @default false
   */
  show?: boolean;
  /**
   * Position from which the drawer slides in.
   * @default 'right'
   */
  position?: DrawerPosition;
  /**
   * Width of the drawer (for left/right positions).
   */
  width?: string;
  /**
   * Height of the drawer (for top/bottom positions).
   */
  height?: string;
  /**
   * Callback fired when the drawer is closed (via close button, Escape, or backdrop click).
   */
  onClose: () => void;
  /**
   * Whether to show rounded edges on the drawer.
   * @default false
   */
  roundedEdges?: boolean;
  /**
   * Whether to show the header with close button.
   * @default false
   */
  showHeader?: boolean;
  /**
   * Title displayed in the drawer header. Also sets the dialog's accessible name via aria-labelledby.
   * Implies showHeader.
   */
  title?: string;
  /**
   * Additional CSS classes for the body content.
   */
  bodyClass?: string;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<DrawerAriaLabels>;
}

const theme = {
  backdrop: {
    base: 'fixed z-[90] overflow-hidden inset-0 w-full h-full',
    show: 'bg-neutral-800/50 dark:bg-neutral-900/80',
  },
  content: {
    positions: {
      top: 'top-0 left-0 right-0 w-full',
      bottom: 'bottom-0 left-0 right-0 w-full',
      left: 'left-0 top-0 h-full',
      right: 'right-0 top-0 h-full',
    },
    base: 'fixed z-[91]',
    inner: {
      base: 'relative bg-white w-full h-full dark:bg-neutral-800 overflow-auto',
      positions: {
        top: 'rounded-b-lg',
        bottom: 'rounded-t-lg',
        left: 'rounded-r-lg',
        right: 'rounded-l-lg',
      },
    },
  },
  body: {
    base: 'p-6',
  },
  header: {
    base: 'flex items-center justify-between p-4',
    title: 'grow text-lg font-semibold text-neutral-900 dark:text-white p-2',
    close: {
      base: 'ml-auto inline-flex cursor-pointer transition-all items-center rounded-lg bg-transparent p-2 text-sm text-neutral-400 dark:text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

/**
 * Drawer component that slides in from the edge of the screen.
 * Uses role="dialog" and aria-modal for accessibility.
 */
const Drawer = (props: DrawerProps): JSX.Element => {
  const [local, dialogProps] = splitProps(props, [
    'show',
    'position',
    'width',
    'height',
    'onClose',
    'roundedEdges',
    'showHeader',
    'title',
    'bodyClass',
    'ariaLabels',
    'children',
    'class',
  ]);

  const a = createMemo(() => ({ ...DEFAULT_DRAWER_ARIA_LABELS, ...local.ariaLabels }));
  const [drawerEl, setDrawerEl] = createSignal<HTMLDivElement | undefined>();
  const titleId = createUniqueId();

  const position = createMemo(() => local.position || 'right');

  const getSizeClasses = createMemo(() => {
    if (position() === 'top' || position() === 'bottom') {
      return local.height ?? 'h-full md:h-fit';
    }
    return local.width ?? 'w-full md:w-fit';
  });

  createEffect(() => {
    if (local.show && drawerEl()) {
      preventBackgroundScroll(drawerEl()!);
    }
  });

  // Focus trap, Escape key handler, and focus restoration
  createEffect(() => {
    if (!local.show || !drawerEl()) return;

    const drawer = drawerEl()!;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus the first focusable element when drawer opens
    queueMicrotask(() => {
      const focusable = getFocusableElements(drawer);
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
        const focusable = getFocusableElements(drawer);
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

  const { isVisible, isMounted } = createPresence(() => local.show, {
    transitionDuration: 500,
  });

  const translateDirection = createMemo(() => {
    switch (position()) {
      case 'right':
        return 'translate(100%, 0)';
      case 'left':
        return 'translate(-100%, 0)';
      case 'top':
        return 'translate(0, -100%)';
      case 'bottom':
        return 'translate(0, 100%)';
      default:
        return 'translate(0, 0)';
    }
  });

  const hasHeader = createMemo(() => local.showHeader || !!local.title);

  return (
    <Show when={isMounted()}>
      <Portal>
        <div
          class={twMerge(theme.backdrop.base, theme.backdrop.show)}
          style={{
            transition: 'all .5s cubic-bezier(.32, .72, 0, 1)',
            opacity: isVisible() ? '1' : '0',
          }}
          onClick={() => local.onClose()}
        />
        <div
          ref={setDrawerEl}
          class={twMerge(
            theme.content.base,
            theme.content.positions[position()],
            local.class,
            getSizeClasses(),
          )}
          style={{
            transition: 'transform .5s cubic-bezier(.32, .72, 0, 1)',
            transform: isVisible() ? 'translate(0, 0)' : translateDirection(),
          }}
        >
          <div
            {...dialogProps}
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? titleId : undefined}
            class={twMerge(
              theme.content.inner.base,
              local.roundedEdges ? theme.content.inner.positions[position()] : '',
            )}
          >
            <Show when={hasHeader()}>
              <div class={twMerge(theme.header.base)}>
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
            </Show>
            <div
              class={twMerge(
                theme.body.base,
                hasHeader() ? (local.title ? 'pt-4' : 'pt-0') : '',
                local.bodyClass,
              )}
            >
              {local.children}
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Drawer;
