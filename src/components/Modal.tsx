import { JSX, Show, createMemo, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { twMerge } from 'tailwind-merge';

import { XMarkIcon } from '../icons';

interface ModalProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
  show?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-center' | 'center';
  onClose: (event: MouseEvent) => void;
  children: JSX.Element;
}

const theme = {
  root: {
    base: 'fixed top-0 right-0 left-0 z-[90] overflow-y-auto overflow-x-hidden inset-0 w-full h-full scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-400 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800',
    show: {
      on: 'flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80',
      off: 'hidden',
    },
    sizes: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    },
    positions: {
      'top-center': 'items-start justify-center',
      center: 'items-center justify-center',
    },
  },
  content: {
    base: 'relative w-full p-4 h-auto',
    inner: 'relative rounded-lg bg-white shadow dark:bg-gray-700',
  },
  body: {
    base: 'p-6',
    popup: 'pt-0',
  },
  header: {
    base: 'flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5',
    popup: '!p-2 !border-b-0',
    close: {
      base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
      icon: 'h-5 w-5',
    },
  },
};

const Modal = (props: ModalProps) => {
  const [local, otherProps] = splitProps(props, [
    'children',
    'class',
    'show',
    'size',
    'position',
    'onClose',
  ]);

  const size = createMemo(() => local.size || 'md');
  const position = createMemo(() => local.position || 'top-center');

  return (
    <Show when={local.show}>
      <Portal>
        <dialog
          open={local.show}
          class={twMerge(
            theme.root.base,
            theme.root.positions[position()],
            local.show ? theme.root.show.on : theme.root.show.off,
            local.class,
          )}
          {...otherProps}
        >
          <div class={twMerge(theme.content.base, theme.root.sizes[size()])}>
            <div class={theme.content.inner}>
              <div class={twMerge(theme.header.base, theme.header.popup)}>
                <button
                  aria-label="Close"
                  class={theme.header.close.base}
                  type="button"
                  onClick={(e) => local.onClose(e)}
                >
                  <XMarkIcon class={theme.header.close.icon} />
                </button>
              </div>
              <div class={twMerge(theme.body.base, theme.body.popup)}>
                {local.children}
              </div>
            </div>
          </div>
        </dialog>
      </Portal>
    </Show>
  );
};

export default Modal;
