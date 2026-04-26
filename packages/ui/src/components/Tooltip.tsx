import {
  JSX,
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
 * Placement options for the Tooltip.
 */
export type TooltipPlacement = 'top' | 'bottom' | 'right' | 'left';

/**
 * Theme options for the Tooltip.
 */
export type TooltipTheme = 'dark' | 'light' | 'auto' | 'invert';

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Position of the tooltip relative to the trigger element.
   * @default 'top'
   */
  placement?: TooltipPlacement;
  /**
   * Theme variant of the tooltip.
   * - 'auto': follows the current theme
   * - 'invert': inverts the current theme (dark becomes light, light becomes dark)
   * - 'dark': always dark
   * - 'light': always light
   * @default 'auto'
   */
  theme?: TooltipTheme;
  /**
   * Content to display inside the tooltip.
   */
  content: string | JSX.Element;
  /**
   * Whether to hide the tooltip.
   * @default false
   */
  hidden?: boolean;
  /**
   * Delay in milliseconds before showing the tooltip.
   * @default 0
   */
  showDelay?: number;
  /**
   * Delay in milliseconds before hiding the tooltip.
   * @default 0
   */
  hideDelay?: number;
  /**
   * Additional CSS classes for the trigger wrapper element.
   */
  wrapperClass?: string;
  /**
   * How to handle background scroll when tooltip is visible.
   * @default 'close'
   */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
}

const theme = {
  base: 'inline-block z-100 rounded-lg py-2 px-3 text-sm w-max outline shadow-sm',
  tooltip: {
    auto: 'outline-neutral-200 bg-white text-neutral-900 dark:outline-neutral-600 dark:bg-neutral-700 dark:text-white',
    invert:
      'outline-neutral-600 bg-neutral-700 text-white dark:outline-neutral-200 dark:bg-white dark:text-neutral-900',
    dark: 'outline-neutral-600 bg-neutral-700 text-white',
    light: 'outline-neutral-200 bg-white text-neutral-900',
  },
  arrow: {
    base: 'absolute z-100',
    auto: 'text-white dark:text-neutral-700',
    invert: 'text-neutral-700 dark:text-white',
    dark: 'text-neutral-700',
    light: 'text-white',
  },
  arrowBorder: {
    auto: 'fill-neutral-200 dark:fill-neutral-600',
    invert: 'fill-neutral-600 dark:fill-neutral-200',
    dark: 'fill-neutral-600',
    light: 'fill-neutral-200',
  },
};

/**
 * Tooltip component for displaying contextual information on hover or focus.
 * Supports keyboard navigation and screen readers.
 */
const Tooltip = (props: TooltipProps): JSX.Element => {
  const merged = defaultProps(
    {
      placement: 'top',
      theme: 'auto',
      showDelay: 0,
      hideDelay: 0,
    },
    props,
  );

  const [showTooltip, setShowTooltip] = createSignal(false);

  const tooltipId = createUniqueId();
  let showTimeoutId: number | undefined;
  let hideTimeoutId: number | undefined;

  const handleShow = () => {
    clearTimeout(hideTimeoutId);
    if (merged.showDelay > 0) {
      showTimeoutId = window.setTimeout(() => setShowTooltip(true), merged.showDelay);
    } else {
      setShowTooltip(true);
    }
  };

  const handleHide = () => {
    clearTimeout(showTimeoutId);
    if (merged.hideDelay > 0) {
      hideTimeoutId = window.setTimeout(() => setShowTooltip(false), merged.hideDelay);
    } else {
      setShowTooltip(false);
    }
  };

  onCleanup(() => {
    clearTimeout(showTimeoutId);
    clearTimeout(hideTimeoutId);
  });

  // Dismiss tooltip on Escape key (WAI-ARIA tooltip pattern)
  createEffect(() => {
    if (showTooltip() && !props.hidden) {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          clearTimeout(showTimeoutId);
          setShowTooltip(false);
        }
      };
      document.addEventListener('keydown', handleEscapeKey);
      onCleanup(() => document.removeEventListener('keydown', handleEscapeKey));
    }
  });

  const { isVisible, isMounted } = createPresence(() => showTooltip(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, arrowStyles, container } = useFloating({
    get placement() {
      return merged.placement as Placement;
    },
    offset: 0,
    isOpen: isMounted,
    renderArrow: true,
    arrowInset: 2.3, // due to the svg used for the arrow
    get backgroundScrollBehavior() {
      return props.backgroundScrollBehavior;
    },
    onClose: () => setShowTooltip(false),
  });

  return (
    <>
      <div
        class={twMerge('w-fit', merged.wrapperClass)}
        ref={refs.setReference}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocusIn={handleShow}
        onFocusOut={handleHide}
        aria-describedby={showTooltip() && !props.hidden ? tooltipId : undefined}
      >
        {props.children}
      </div>

      <Show when={isMounted() && !props.hidden}>
        <Portal mount={container() ?? undefined}>
          <div
            ref={refs.setFloating}
            role="tooltip"
            id={tooltipId}
            style={{
              ...floatingStyles(),
              opacity: isVisible() ? '1' : '0',
              transform: isVisible() ? 'scale(1)' : 'scale(0.8)',
              'transition-property': 'opacity, transform',
              'transition-duration': '.2s',
              'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
            }}
            class={twMerge(merged.class, theme.base, theme.tooltip[merged.theme])}
          >
            <div
              ref={refs.setArrow}
              class={twMerge(theme.arrow.base, theme.arrow[merged.theme])}
              style={arrowStyles() as JSX.CSSProperties}
              aria-hidden="true"
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M10.3356 7.39808L15.1924 3.02697C15.9269 2.36592 16.8801 2.00015 17.8683 2.00015H20V0.000148773H0V2.00015H1.4651C2.4532 2.00015 3.4064 2.36592 4.1409 3.02697L8.9977 7.39808C9.378 7.74035 9.9553 7.74036 10.3356 7.39808Z"
                  fill="currentColor"
                />
                <path
                  d="M11.0045 8.14139C10.2438 8.8259 9.08927 8.82593 8.32857 8.14137L3.47178 3.77026C2.92098 3.27447 2.20607 3.00014 1.46497 3.00014L4.10987 3.00015L8.99757 7.39808C9.37787 7.74035 9.95517 7.74035 10.3355 7.39808L15.2225 3.00015L17.8682 3.00014C17.127 3.00014 16.4121 3.27447 15.8613 3.77026L11.0045 8.14139Z"
                  class={theme.arrowBorder[merged.theme]}
                />
              </svg>
            </div>
            <div class="relative z-20 normal-case">{merged.content}</div>
          </div>
        </Portal>
      </Show>
    </>
  );
};

export default Tooltip;
