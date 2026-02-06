import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Spinner from './Spinner';

/**
 * Color variants for the Button component.
 */
export type ButtonColor =
  | 'gray'
  | 'dark'
  | 'failure'
  | 'info'
  | 'light'
  | 'success'
  | 'warning'
  | 'blue';

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
  base: 'group flex h-min items-center disabled:cursor-not-allowed justify-center text-center font-medium focus:z-10 rounded-lg cursor-pointer transition-all duration-200',
  color: {
    gray: 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-neutral-400 dark:border-neutral-600 dark:hover:text-white dark:hover:bg-neutral-700',
    dark: 'text-white bg-gray-800 border border-transparent hover:bg-gray-900  dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:border-neutral-800',
    failure:
      'text-white bg-red-700 border border-transparent hover:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600',
    info: 'text-white dark:text-neutral-800 bg-blue-600 border border-transparent hover:bg-blue-700 disabled:bg-blue-600 dark:bg-neutral-50 dark:hover:bg-neutral-200',
    light:
      'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-neutral-600 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-700',
    success:
      'text-white bg-green-700 border border-transparent hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700',
    warning: 'text-white bg-yellow-400 border border-transparent hover:bg-yellow-500',
    blue: 'text-blue-900 bg-white border border-blue-300 hover:bg-blue-100 dark:bg-blue-600 dark:text-white dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700',
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
      type={type()}
      class={twMerge(
        theme.base,
        theme.color[color()],
        theme.size[size()],
        local.class,
        local.disabled ? 'opacity-50' : '',
      )}
      disabled={disabled()}
      aria-busy={local.isLoading}
      {...buttonProps}
    >
      <div class="relative flex items-center">
        <div
          class={twMerge('flex items-center gap-2', local.isLoading ? 'opacity-5' : '')}
        >
          <Show when={local.icon && local.iconPlacement !== 'right'}>
            {local.icon!({})}
          </Show>
          {local.children}
          <Show when={local.icon && local.iconPlacement === 'right'}>
            {local.icon!({})}
          </Show>
        </div>
        <Show when={local.isLoading}>
          <div class="z-5 absolute inset-0 flex h-full w-full items-center justify-center">
            <Spinner size="sm" color={color()} />
          </div>
        </Show>
      </div>
    </button>
  );
};

export default Button;
