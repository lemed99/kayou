import { JSX, Show, catchError, createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';
import { useFloating } from '../hooks';
import { Placement } from '../hooks/useFloating/types';
import { useTheme } from '../hooks/useTheme';

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  placement?: 'top' | 'bottom' | 'right' | 'left';
  theme?: 'dark' | 'light' | 'auto';
  content: string | JSX.Element;
  hidden?: boolean;
}

const theme = {
  arrow: {
    base: 'absolute z-100',
    theme: {
      dark: 'text-gray-700 dark:text-gray-700',
      light: 'text-white',
    },
  },
  base: 'absolute inline-block z-100 rounded-lg py-2 px-3 text-sm w-max shadow-sm',
  hidden: 'invisible opacity-0',
  theme: {
    dark: 'bg-gray-700 text-white dark:bg-gray-700',
    light: 'border border-gray-200 bg-white text-gray-900',
  },
};

const Tooltip = (props: TooltipProps) => {
  const merged = defaultProps(
    {
      placement: 'top',
      theme: 'auto',
    },
    props,
  );

  const [showTooltip, setShowTooltip] = createSignal(false);
  const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark'>();

  catchError(
    () => {
      createEffect(() => {
        if (merged.theme === 'auto') {
          const { systemTheme, appTheme } = useTheme();
          setCurrentTheme(
            appTheme() === 'system' ? systemTheme() : (appTheme() as 'light' | 'dark'),
          );
        }
      });
    },
    (err) => {
      console.error(err);
    },
  );

  const getThemeOpposite = (theme: string | undefined) => {
    return theme === 'dark' ? 'light' : 'dark';
  };

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
  });

  return (
    <>
      <div
        class="w-fit"
        ref={refs.setReference}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {props.children}
      </div>

      <Show when={isMounted() && !props.hidden}>
        <Portal mount={container()}>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles(),
              opacity: isVisible() ? '1' : '0',
              scale: isVisible() ? 1 : 0.8,
              'transition-property': 'opacity, scale',
              'transition-duration': '.2s',
              'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
            }}
            class={twMerge(
              merged.class,
              theme.base,
              theme.theme[
                merged.theme === 'auto'
                  ? getThemeOpposite(currentTheme())
                  : getThemeOpposite(merged.theme)
              ],
            )}
          >
            <div
              ref={refs.setArrow}
              class={twMerge(
                theme.arrow.base,
                theme.arrow.theme[
                  merged.theme === 'auto'
                    ? getThemeOpposite(currentTheme())
                    : getThemeOpposite(merged.theme)
                ],
              )}
              style={arrowStyles()!}
            >
              <svg width="16" height="8" viewBox="0 0 16 8">
                <path d="M16 0H0L8 8L16 0Z" fill="currentColor" />
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
