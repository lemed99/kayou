import { JSX, Show, createEffect, createSignal } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { XMarkIcon } from '../icons';

interface DrawerProps
  extends Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, 'children'> {
  children?: JSX.Element | ((props: { close: () => void }) => JSX.Element);
  show?: boolean;
  position?: 'right' | 'left' | 'top' | 'bottom';
  widthClass?: string;
  heightClass?: string;
  backdropType?: 'none' | 'default' | 'blurry';
  closeOnBackdropClick?: boolean;
  onClose: () => void;
}

const Drawer = (props: DrawerProps) => {
  const [isOpening, setIsOpening] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);

  const positions = {
    right: 'right-0 translate-x-full',
    left: 'left-0 -translate-x-full',
    top: 'top-0 -translate-y-full',
    bottom: 'bottom-0 translate-y-full',
  };

  const openPositions = {
    right: 'translate-x-0',
    left: 'translate-x-0',
    top: 'translate-y-0',
    bottom: 'translate-y-0',
  };

  const backdropStyles = {
    none: '',
    default: 'bg-gray-900/50 dark:bg-gray-900/80',
    blurry: 'backdrop-blur-sm bg-gray-900/30 dark:bg-gray-900/50',
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (props.closeOnBackdropClick && e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  const getSizeClasses = () => {
    if (props.position === 'top' || props.position === 'bottom') {
      return props.heightClass ?? 'h-full md:h-1/2';
    }
    return props.widthClass ?? 'w-full md:w-1/2';
  };

  const openDrawer = () => {
    document.body.style.overflow = 'hidden';
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
    }, 50);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => {
      document.body.style.overflow = '';
      props.onClose();
    }, 300); // Match this with your transition duration
  };

  createEffect(() => {
    if (props.show) {
      setTimeout(() => {
        openDrawer();
      }, 0);
    }
  });

  return (
    <Show when={props.show || isOpening() || isOpen()}>
      <div
        class={twMerge(
          'fixed inset-0 z-[90] h-full w-full overflow-x-hidden overflow-y-auto',
          'scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-100 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500',
          'flex transition-all duration-300',
          backdropStyles[props.backdropType || 'default'],
          props.class,
        )}
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
      >
        <div
          class={twMerge(
            'fixed z-50 overflow-y-auto bg-white shadow dark:bg-gray-800',
            'duration-500 ease-in-out',
            props.position === 'left' || props.position === 'right'
              ? 'top-0 h-screen'
              : 'left-0 w-screen',
            getSizeClasses(),
            positions[props.position || 'right'],
            (isOpen() || isOpening()) && openPositions[props.position || 'right'],
          )}
        >
          <div class="flex items-start justify-between !border-b-0 p-2">
            <button
              aria-label="Close"
              class="ml-auto inline-flex cursor-pointer items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              type="button"
              onClick={closeDrawer}
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          <div class="p-6 pt-0">
            {typeof props.children === 'function'
              ? props.children({ close: closeDrawer })
              : props.children}
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Drawer;
