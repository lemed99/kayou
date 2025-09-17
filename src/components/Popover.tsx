import {
  Accessor,
  JSX,
  ParentComponent,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';

import {
  Placement,
  autoPlacement,
  createFloating,
  flip,
  offset,
  shift,
} from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';

export interface PopoverProps {
  content: JSX.Element;
  children: JSX.Element;
  onHover?: boolean;
  menu?: boolean; // used for sidebar menu
  position?: Placement;
  hidden?: boolean;
  isClosed?: boolean;
  setIsClosed?: (state: boolean) => void;
  strategy?: 'absolute' | 'fixed';
}

const Popover: ParentComponent<PopoverProps> = (props) => {
  const merged = defaultProps(
    {
      onHover: false,
      menu: false,
      hidden: false,
      strategy: 'absolute',
    },
    props,
  );

  const [isPopoverVisible, setIsPopoverVisible] = createSignal(false);

  const { refs, floatingStyles } = createFloating({
    get placement() {
      return merged.position || undefined;
    },
    strategy: merged.strategy,
    get middleware() {
      return [
        offset(merged.menu ? 0 : 8),
        merged.position
          ? flip()
          : autoPlacement({ allowedPlacements: ['top', 'bottom', 'right'] }),
        shift({ padding: 8 }),
      ];
    },
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refs.floating() && !refs.floating()?.contains(event.target as Node)) {
        setIsPopoverVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleTogglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible());
  };

  const popoverStyle: Accessor<JSX.CSSProperties> = createMemo(() => {
    return {
      visibility: isPopoverVisible() ? 'visible' : 'hidden',
      opacity: isPopoverVisible() ? 1 : 0,
      transition: 'opacity 0.2s ease-in-out',
    } as JSX.CSSProperties;
  });

  return (
    <div class="relative flex grow">
      <div
        ref={refs.setReference}
        class="w-full"
        onClick={() => (!merged.hidden && !merged.onHover ? handleTogglePopover() : null)}
        onMouseEnter={() =>
          !merged.hidden && merged.onHover ? setIsPopoverVisible(true) : null
        }
        onMouseLeave={() =>
          !merged.hidden && merged.onHover ? setIsPopoverVisible(false) : null
        }
      >
        {merged.children}
      </div>
      <Show when={isPopoverVisible()}>
        <div
          ref={refs.setFloating}
          class={twMerge('z-50', merged.menu ? 'pl-4' : '')}
          style={{ ...popoverStyle(), ...floatingStyles() }}
          onMouseEnter={() =>
            !merged.hidden && merged.onHover ? setIsPopoverVisible(true) : null
          }
          onMouseLeave={() =>
            !merged.hidden && merged.onHover ? setIsPopoverVisible(false) : null
          }
        >
          <div class="w-fit rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
            {merged.content}
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Popover;
