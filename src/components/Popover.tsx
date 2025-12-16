import {
  JSX,
  ParentComponent,
  Show,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';
import { useFloating } from '../hooks';
import { Placement } from '../hooks/useFloating/types';

export interface PopoverProps {
  content: JSX.Element;
  children: JSX.Element;
  onHover?: boolean;
  menu?: boolean; // used for sidebar menu
  position?: Placement;
  hidden?: boolean;
  onClose?: () => void;
  class?: string;
  offset?: number;
}

const Popover: ParentComponent<PopoverProps> = (props) => {
  const merged = defaultProps(
    {
      onHover: false,
      menu: false,
      hidden: false,
    },
    props,
  );

  const [isPopoverVisible, setIsPopoverVisible] = createSignal(false);

  const { isVisible, isMounted } = createPresence(() => isPopoverVisible(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, container } = useFloating({
    isOpen: isMounted,
    get placement() {
      return merged.position || undefined;
    },
    offset: merged.offset ?? (merged.menu ? 0 : 8),
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const floatingEl = refs.floating();
      const referenceEl = refs.reference();

      if (merged.onHover && !floatingEl?.contains(target)) {
        setIsPopoverVisible(false);
        props.onClose?.();
      }

      if (
        !isMounted() ||
        !floatingEl ||
        !referenceEl ||
        floatingEl?.contains(target) ||
        referenceEl?.contains(target)
      ) {
        return;
      }

      if (
        floatingEl?.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        return;
      }

      setIsPopoverVisible(false);
      props.onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  onCleanup(() => {
    if (isMounted()) {
      props.onClose?.();
    }
  });

  return (
    <div class="relative flex grow">
      <div
        ref={refs.setReference}
        class="w-full"
        onClick={() =>
          !merged.hidden && !merged.onHover ? setIsPopoverVisible(true) : null
        }
        onMouseEnter={() =>
          !merged.hidden && merged.onHover ? setIsPopoverVisible(true) : null
        }
        onMouseLeave={() =>
          !merged.hidden && merged.onHover ? setIsPopoverVisible(false) : null
        }
      >
        {merged.children}
      </div>
      <Show when={isMounted()}>
        <Portal mount={container()}>
          <div
            ref={refs.setFloating}
            class={twMerge('z-50', merged.menu ? 'pl-4' : '')}
            style={{
              ...floatingStyles(),
              opacity: isVisible() ? '1' : '0',
              scale: isVisible() ? 1 : 0.8,
              'transition-property': 'opacity, scale',
              'transition-duration': '.2s',
              'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
            }}
            onMouseEnter={() =>
              !merged.hidden && merged.onHover ? setIsPopoverVisible(true) : null
            }
            onMouseLeave={() =>
              !merged.hidden && merged.onHover ? setIsPopoverVisible(false) : null
            }
          >
            <div
              class={twMerge(
                'w-fit rounded-md border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-none',
                props.class,
              )}
            >
              {merged.content}
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default Popover;
