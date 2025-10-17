import { JSX, Show, createEffect, createMemo, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { preventBackgroundScroll } from '../helpers/preventBackgroundScroll';
import { XMarkIcon } from '../icons';

export interface ModalProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'onClose'> {
  show?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'screen';
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
    base: 'fixed inset-0 flex w-full h-full z-[91] p-4',
    inner:
      'relative rounded-lg bg-white shadow dark:bg-gray-700 w-full max-h-full flex flex-col overflow-hidden',
    sizes: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      screen: 'h-full',
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
      base: 'ml-auto inline-flex items-center cursor-pointer transition-all rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
      icon: 'size-5',
    },
  },
};

const Modal = (props: ModalProps) => {
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

  const transitionStyle = () => {
    return size() === 'screen'
      ? {}
      : {
          transition: 'opacity .5s cubic-bezier(.32, .72, 0, 1)',
          opacity: isVisible() ? '1' : '0',
        };
  };

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
            class={twMerge(theme.content.inner, theme.content.sizes[size()])}
            onClick={(e) => e.stopPropagation()}
          >
            <div class={theme.header.base}>
              <button
                aria-label="Close"
                class={theme.header.close.base}
                type="button"
                onClick={(e) => props.onClose(e)}
              >
                <XMarkIcon class={theme.header.close.icon} />
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
