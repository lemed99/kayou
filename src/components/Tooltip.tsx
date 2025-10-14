import { JSX, Show, catchError, createEffect, createSignal } from 'solid-js';

import { createPresence } from '@solid-primitives/presence';
import { Placement, arrow, createFloating, flip, offset, shift } from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';
import { useTheme } from '../hooks/useTheme';

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  placement?: 'top' | 'bottom';
  theme?: 'dark' | 'light' | 'auto';
  content: string | JSX.Element;
  positionning?: 'absolute' | 'fixed';
}

const theme = {
  animation: 'transition-opacity',
  arrow: {
    base: 'absolute z-10 h-2 w-2 rotate-45',
    theme: {
      dark: 'bg-gray-700 dark:bg-gray-700',
      light: 'bg-white',
    },
    placement: '-4px',
  },
  base: 'absolute inline-block z-10 rounded-lg py-2 px-3 text-sm w-max shadow-sm',
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
      theme: 'dark',
      class: '',
      positionning: 'absolute',
    },
    props,
  );

  const [showTooltip, setShowTooltip] = createSignal(false);
  const [reactiveMiddleware, setReactiveMiddleware] = createSignal([
    offset(8),
    shift({ padding: 8 }),
    flip({}),
  ]);
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

  const {
    refs,
    floatingStyles,
    placement: finalPlacement,
    middleware,
  } = createFloating({
    get placement() {
      return merged.placement as Placement;
    },
    isOpen: isMounted,
    middleware: reactiveMiddleware,
    strategy: merged.positionning,
  });

  return (
    <div class="relative">
      <div
        ref={refs.setReference}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {props.children}
      </div>

      <Show when={isMounted()}>
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles(),
            transition: 'all .2s cubic-bezier(.32, .72, 0, 1)',
            opacity: isVisible() ? '1' : '0',
            scale: isVisible() ? 1 : 0.8,
          }}
          class={twMerge(
            merged.class,
            theme.animation,
            theme.base,
            theme.theme[
              merged.theme === 'auto'
                ? getThemeOpposite(currentTheme())
                : getThemeOpposite(merged.theme)
            ],
          )}
        >
          <div
            ref={(node) =>
              setReactiveMiddleware((prev) => [...prev, arrow({ element: node })])
            }
            class={twMerge(
              theme.arrow.base,
              theme.arrow.theme[
                merged.theme === 'auto'
                  ? getThemeOpposite(currentTheme())
                  : getThemeOpposite(merged.theme)
              ],
              finalPlacement() === 'top' ? '-bottom-1' : '',
              finalPlacement() === 'bottom' ? '-top-1' : '',
            )}
            style={{
              position: 'absolute',
              left: `${middleware().arrow?.x || 0}px`,
            }}
          />
          <div class="relative z-20 normal-case">{merged.content}</div>
        </div>
      </Show>
    </div>
  );
};

export default Tooltip;
