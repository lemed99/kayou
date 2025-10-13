import { JSX, Show, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { XMarkIcon } from '../icons';

export interface DrawerProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
  children?: JSX.Element;
  show?: boolean;
  position?: 'right' | 'left' | 'top' | 'bottom';
  width?: string;
  height?: string;
  onClose: (event: MouseEvent) => void;
  roundedEdges?: boolean;
}

const theme = {
  backdrop: {
    base: 'fixed z-[90] overflow-hidden inset-0 w-full h-full',
    show: 'bg-gray-800/50 dark:bg-gray-800/80',
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
      base: 'relative bg-white w-full h-full dark:bg-gray-700',
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
    popup: 'pt-0',
  },
  header: {
    base: 'flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5',
    popup: '!p-2 !border-b-0',
    close: {
      base: 'ml-auto inline-flex cursor-pointer transition-all items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

const Drawer = (props: DrawerProps) => {
  const getSizeClasses = () => {
    if (props.position === 'top' || props.position === 'bottom') {
      return props.height ?? 'h-full md:h-fit';
    }
    return props.width ?? 'w-full md:w-fit';
  };

  const position = createMemo(() => props.position || 'right');

  const { isVisible, isMounted } = createPresence(() => props.show, {
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

  return (
    <Show when={isMounted()}>
      <Portal>
        <div
          class={twMerge(theme.backdrop.base, theme.backdrop.show)}
          style={{
            transition: 'all .5s cubic-bezier(.32, .72, 0, 1)',
            opacity: isVisible() ? '1' : '0',
          }}
          onClick={(e) => props?.onClose(e)}
        />
        <div
          class={twMerge(
            theme.content.base,
            theme.content.positions[position()],
            props.class,
            getSizeClasses(),
          )}
          style={{
            transition: 'transform .5s cubic-bezier(.32, .72, 0, 1)',
            transform: isVisible() ? 'translate(0, 0)' : translateDirection(),
          }}
        >
          <div
            class={twMerge(
              theme.content.inner.base,
              props.roundedEdges ? theme.content.inner.positions[position()] : '',
            )}
          >
            <div class={twMerge(theme.header.base, theme.header.popup)}>
              <button
                aria-label="Close"
                class={theme.header.close.base}
                type="button"
                onClick={(e) => props.onClose(e)}
              >
                <XMarkIcon class={theme.header.close.icon} />
              </button>
            </div>
            <div class={twMerge(theme.body.base, theme.body.popup)}>{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Drawer;
