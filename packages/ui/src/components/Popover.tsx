import {
  type JSX,
  type ParentComponent,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { type BackgroundScrollBehavior, type Placement, useFloating } from '@kayou/hooks';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';

/**
 * Props for the Popover component.
 */
export interface PopoverProps {
  /**
   * Content to display inside the popover.
   */
  content: JSX.Element | (() => JSX.Element);
  /**
   * Trigger element that opens the popover.
   */
  children: JSX.Element;
  /**
   * Whether to trigger the popover on hover instead of click.
   * @default false
   */
  onHover?: boolean;
  /**
   * Position of the popover relative to the trigger.
   */
  position?: Placement;
  /**
   * Whether the popover is disabled/hidden.
   * @default false
   */
  hidden?: boolean;
  /**
   * Callback fired when the popover closes.
   */
  onClose?: () => void;
  /**
   * Additional CSS classes for the popover content container.
   */
  class?: string;
  /**
   * Offset from the trigger element in pixels.
   * @default 8
   */
  offset?: number;
  /**
   * Additional CSS classes for the floating container.
   */
  floatingClass?: string;
  /**
   * Callback fired when mouse enters the trigger or popover.
   */
  onMouseEnter?: () => void;
  /**
   * Callback fired when mouse leaves the trigger or popover.
   */
  onMouseLeave?: () => void;
  /**
   * Controlled open state. When provided, the component becomes controlled.
   */
  isOpen?: boolean;
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Additional CSS classes for the wrapper container.
   */
  wrapperClass?: string;
  /**
   * Accessible label for the popover dialog.
   */
  'aria-label'?: string;
  /**
   * How to handle background scroll when popover is open.
   * @default 'close'
   */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
}

/**
 * A popover component that displays floating content relative to a trigger element.
 * Supports both click and hover triggers, keyboard navigation, and full accessibility.
 *
 * @example
 * ```tsx
 * <Popover content={<div>Popover content</div>}>
 *   <Button>Open Popover</Button>
 * </Popover>
 * ```
 */
const Popover: ParentComponent<PopoverProps> = (props): JSX.Element => {
  const merged = defaultProps(
    {
      onHover: false,
      hidden: false,
    },
    props,
  );

  const popoverId = createUniqueId();
  const [internalOpen, setInternalOpen] = createSignal(false);
  let triggerRef: HTMLDivElement | undefined;
  let wasEverOpened = false;

  // Determine if controlled or uncontrolled
  const isControlled = () => props.isOpen !== undefined;
  const isPopoverVisible = () => (isControlled() ? props.isOpen! : internalOpen());

  const setOpen = (open: boolean) => {
    if (open) {
      wasEverOpened = true;
    }
    if (!isControlled()) {
      setInternalOpen(open);
    }
    props.onOpenChange?.(open);
    if (!open) {
      props.onClose?.();
    }
  };

  const { isVisible, isMounted } = createPresence(() => isPopoverVisible(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, container } = useFloating({
    isOpen: isMounted,
    get placement() {
      return merged.position || undefined;
    },
    offset: merged.offset ?? 8,
    get backgroundScrollBehavior() {
      return props.backgroundScrollBehavior;
    },
    onClose: () => setOpen(false),
  });

  // Close when hidden prop becomes true
  createEffect(() => {
    if (merged.hidden === true && isPopoverVisible()) {
      setOpen(false);
    }
  });

  // Focus management: focus first focusable element when opened
  createEffect((prev: boolean) => {
    const current = isPopoverVisible();

    if (current && !prev) {
      // Opening: focus first focusable element in popover
      queueMicrotask(() => {
        const floatingEl = refs.floating();
        if (floatingEl) {
          const focusable = floatingEl.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable) {
            focusable.focus();
          }
        }
      });
    } else if (!current && prev) {
      // Closing: return focus to trigger
      triggerRef?.focus();
    }

    return current;
  }, false);

  // Click outside handler
  createEffect(() => {
    if (!isMounted()) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const floatingEl = refs.floating();
      const referenceEl = refs.reference();

      // Click inside trigger or popover - do nothing
      if (floatingEl?.contains(target) || referenceEl?.contains(target)) {
        return;
      }

      // Click outside - close popover
      setOpen(false);
    };

    document.addEventListener('pointerdown', handleClickOutside);
    onCleanup(() => document.removeEventListener('pointerdown', handleClickOutside));
  });

  // Escape key handler
  createEffect(() => {
    if (!isMounted()) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  // Cleanup on unmount
  onCleanup(() => {
    if (wasEverOpened && isMounted()) {
      props.onClose?.();
    }
  });

  const handleTriggerClick = () => {
    if (merged.hidden || merged.onHover) return;
    setOpen(!isPopoverVisible());
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (merged.hidden || merged.onHover) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!isPopoverVisible());
    }
  };

  const handleMouseEnter = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(true);
      props.onMouseEnter?.();
    }
  };

  const handleMouseLeave = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(false);
      props.onMouseLeave?.();
    }
  };

  const handleTouchStart = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(true);
      props.onMouseEnter?.();
    }
  };

  const handleTouchEnd = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(false);
      props.onMouseLeave?.();
    }
  };

  const handleFocusIn = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(true);
    }
  };

  const handleFocusOut = () => {
    if (!merged.hidden && merged.onHover) {
      setOpen(false);
    }
  };

  return (
    <div class={twMerge('relative', props.wrapperClass)}>
      <div
        ref={(el) => {
          triggerRef = el;
          refs.setReference(el);
        }}
        class="w-full"
        tabindex={merged.onHover ? undefined : 0}
        role={merged.onHover ? undefined : 'button'}
        aria-haspopup="dialog"
        aria-expanded={isPopoverVisible()}
        aria-controls={isPopoverVisible() ? popoverId : undefined}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onFocusIn={handleFocusIn}
        onFocusOut={handleFocusOut}
      >
        {merged.children}
      </div>
      <Show when={isMounted()}>
        <Portal mount={container() ?? undefined}>
          <div
            ref={refs.setFloating}
            id={popoverId}
            role="dialog"
            aria-modal="false"
            aria-label={props['aria-label']}
            class={twMerge('z-50', merged.floatingClass)}
            style={
              {
                ...floatingStyles(),
                opacity: isVisible() ? '1' : '0',
                transform: isVisible() ? 'scale(1)' : 'scale(0.8)',
                'transition-property': 'opacity, transform',
                'transition-duration': '.2s',
                'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
              } as JSX.CSSProperties
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              class={twMerge(
                'w-fit rounded-md border border-gray-200 bg-white shadow dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none',
                props.class,
              )}
            >
              {typeof merged.content === 'function' ? merged.content() : merged.content}
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

export default Popover;
