import {
  JSX,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';
import { useFloating } from '../hooks';
import { Placement } from '../hooks/useFloating/types';
import { useTheme } from '../hooks/useTheme';

/**
 * Placement options for the Tooltip.
 */
export type TooltipPlacement = 'top' | 'bottom' | 'right' | 'left';

/**
 * Theme options for the Tooltip.
 */
export type TooltipTheme = 'dark' | 'light' | 'auto';

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
}

const theme = {
  arrow: {
    base: 'absolute z-100',
    theme: {
      dark: 'text-gray-700 dark:text-gray-700',
      light: 'text-white',
    },
  },
  base: 'inline-block z-100 rounded-lg py-2 px-3 text-sm w-max outline shadow-sm',
  hidden: 'invisible opacity-0',
  theme: {
    dark: 'outline-gray-200 dark:outline-gray-600 bg-gray-700 text-white dark:bg-gray-700',
    light: 'outline-gray-200 dark:outline-gray-600 bg-white text-gray-900',
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
  const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark'>('dark');

  const tooltipId = createUniqueId();
  let showTimeoutId: number | undefined;
  let hideTimeoutId: number | undefined;

  // Standalone theme detection (works without ThemeProvider)
  const detectThemeFromDOM = (): 'light' | 'dark' => {
    // Check for dark class on document (Tailwind convention)
    if (document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    // Check system preference
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Theme detection: try ThemeProvider first, fall back to DOM/system detection
  createEffect(() => {
    if (merged.theme !== 'auto') return;

    let themeContextAvailable = false;
    try {
      const { systemTheme, appTheme } = useTheme();
      themeContextAvailable = true;
      setCurrentTheme(
        appTheme() === 'system' ? systemTheme() : (appTheme() as 'light' | 'dark'),
      );
    } catch {
      // No ThemeProvider available
    }

    if (!themeContextAvailable) {
      // Use standalone detection
      setCurrentTheme(detectThemeFromDOM());

      // Watch for dark class changes on document
      const observer = new MutationObserver(() => {
        setCurrentTheme(detectThemeFromDOM());
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      // Watch for system preference changes
      const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
      const handleChange = () => setCurrentTheme(detectThemeFromDOM());
      mediaQuery?.addEventListener('change', handleChange);

      onCleanup(() => {
        observer.disconnect();
        mediaQuery?.removeEventListener('change', handleChange);
      });
    }
  });

  const getThemeOpposite = (themeValue: 'light' | 'dark') => {
    return themeValue === 'dark' ? 'light' : 'dark';
  };

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

  const { isVisible, isMounted } = createPresence(() => showTooltip(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, arrowStyles, container } = useFloating({
    get placement() {
      return merged.placement as Placement;
    },
    offset: 2,
    isOpen: isMounted,
    renderArrow: true,
    arrowInset: 2.3,
  });

  const resolvedTheme = () =>
    merged.theme === 'auto' ? getThemeOpposite(currentTheme()) : merged.theme;

  return (
    <>
      <div
        class={twMerge('w-fit', merged.wrapperClass)}
        ref={refs.setReference}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        aria-describedby={showTooltip() && !props.hidden ? tooltipId : undefined}
      >
        {props.children}
      </div>

      <Show when={isMounted() && !props.hidden}>
        <Portal mount={container()}>
          <div
            ref={refs.setFloating}
            role="tooltip"
            id={tooltipId}
            style={{
              ...floatingStyles(),
              opacity: isVisible() ? '1' : '0',
              scale: isVisible() ? 1 : 0.8,
              'transition-property': 'opacity, scale',
              'transition-duration': '.2s',
              'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
            }}
            class={twMerge(merged.class, theme.base, theme.theme[resolvedTheme()])}
          >
            <div
              ref={refs.setArrow}
              class={twMerge(theme.arrow.base, theme.arrow.theme[resolvedTheme()])}
              style={arrowStyles()!}
              aria-hidden="true"
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path
                  d="M10.3356 7.39808L15.1924 3.02697C15.9269 2.36592 16.8801 2.00015 17.8683 2.00015H20V0.000148773H0V2.00015H1.4651C2.4532 2.00015 3.4064 2.36592 4.1409 3.02697L8.9977 7.39808C9.378 7.74035 9.9553 7.74036 10.3356 7.39808Z"
                  fill="currentColor"
                />
                <path
                  d="M11.0045 8.14139C10.2438 8.8259 9.08927 8.82593 8.32857 8.14137L3.47178 3.77026C2.92098 3.27447 2.20607 3.00014 1.46497 3.00014L4.10987 3.00015L8.99757 7.39808C9.37787 7.74035 9.95517 7.74035 10.3355 7.39808L15.2225 3.00015L17.8682 3.00014C17.127 3.00014 16.4121 3.27447 15.8613 3.77026L11.0045 8.14139Z"
                  class="fill-gray-200 dark:fill-gray-600"
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
