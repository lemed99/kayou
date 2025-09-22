import { JSX, Show, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { XMarkIcon } from '../icons';

export interface ModalProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
  show?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-center' | 'center';
  onClose: (event: MouseEvent) => void;
  children: JSX.Element;
}

const theme = {
  backdrop: {
    base: 'fixed z-[90] overflow-hidden inset-0 w-full h-full',
    show: 'bg-gray-900/50 dark:bg-gray-900/80',
  },
  content: {
    base: 'fixed w-full h-auto z-[91]',
    inner: 'relative rounded-lg bg-white shadow dark:bg-gray-700',
    sizes: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    },
    positions: {
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      center: 'top-1/2 left-1/2 -translate-1/2',
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
      base: 'ml-auto inline-flex items-center cursor-pointer rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

const Modal = (props: ModalProps) => {
  const size = createMemo(() => props.size || 'md');
  const position = createMemo(() => props.position || 'top-center');

  const { isVisible, isMounted } = createPresence(() => props.show, {
    transitionDuration: 500,
  });

  return (
    <Show when={isMounted()}>
      <Portal>
        <div
          class={twMerge(theme.backdrop.base, theme.backdrop.show)}
          style={{
            transition: 'opacity .5s cubic-bezier(.32, .72, 0, 1)',
            opacity: isVisible() ? '1' : '0',
          }}
          onClick={(e) => props?.onClose(e)}
        />
        <div
          class={twMerge(
            theme.content.base,
            theme.content.sizes[size()],
            theme.content.positions[position()],
            props.class,
          )}
          style={{
            transition: 'opacity .5s cubic-bezier(.32, .72, 0, 1)',
            opacity: isVisible() ? '1' : '0',
          }}
        >
          <div class={theme.content.inner}>
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

export default Modal;
