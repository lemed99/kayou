import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Spinner from './Spinner';

/**
 * Color variants for the Button component.
 */
export type ButtonColor = 'info' | 'danger' | 'black' | 'white' | 'transparent';

/**
 * Size variants for the Button component.
 */
export type ButtonSize = 'xs' | 'sm' | 'md';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The color variant of the button.
   * @default 'info'
   */
  color?: ButtonColor;
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Shows a loading spinner and disables interactions.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Icon component to display alongside the button content.
   */
  icon?: (props: IconProps) => JSX.Element;
  /**
   * Placement of the icon relative to the button content.
   * @default 'left'
   */
  iconPlacement?: 'left' | 'right';
}

const theme = {
  base: 'group flex h-min items-center disabled:cursor-not-allowed justify-center text-center font-medium focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 rounded-lg cursor-pointer transition-all duration-200',
  color: {
    info: 'text-white bg-blue-600 border border-transparent hover:bg-blue-700',
    danger: 'text-white bg-red-700 border border-transparent hover:bg-red-800',
    black:
      'text-white bg-black border border-transparent hover:bg-neutral-900 dark:border-neutral-800',
    white:
      'text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 dark:border-transparent',
    transparent:
      'text-neutral-900 dark:text-neutral-100 bg-transparent border border-neutral-300 dark:border-neutral-700',
  },
  size: {
    xs: 'text-xs px-2 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2.5',
  },
};

const Button = (props: ButtonProps): JSX.Element => {
  const [local, buttonProps] = splitProps(props, [
    'children',
    'type',
    'color',
    'size',
    'class',
    'disabled',
    'isLoading',
    'icon',
    'iconPlacement',
  ]);

  const type = createMemo(() => local.type || 'button');
  const color = createMemo(() => local.color || 'info');
  const size = createMemo(() => local.size || 'md');
  const disabled = createMemo(() => local.disabled || local.isLoading);

  return (
    <button
      {...buttonProps}
      type={type()}
      class={twMerge(
        theme.base,
        theme.color[color()],
        theme.size[size()],
        local.class,
        local.disabled ? 'opacity-60' : '',
      )}
      disabled={disabled()}
      aria-busy={local.isLoading}
    >
      <div class="relative flex items-center">
        <div
          class={twMerge('flex items-center gap-2', local.isLoading ? 'opacity-5' : '')}
        >
          <Show when={local.icon && local.iconPlacement !== 'right'}>
            {local.icon?.({})}
          </Show>
          {local.children}
          <Show when={local.icon && local.iconPlacement === 'right'}>
            {local.icon?.({})}
          </Show>
        </div>
        <Show when={local.isLoading}>
          <div class="absolute inset-0 z-10 flex h-full w-full items-center justify-center">
            <Spinner size="sm" color={color()} />
          </div>
        </Show>
      </div>
    </button>
  );
};

export default Button;
