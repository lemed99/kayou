import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Spinner from './Spinner';

/**
 * Colors for the Button component.
 */
export type ButtonColor = 'info' | 'danger' | 'theme' | 'anti-theme';

/**
 * Variants for the button component
 */
export type ButtonVariant = 'solid' | 'outline' | 'transparent';

/**
 * Size variants for the Button component.
 */
export type ButtonSize = 'xs' | 'sm' | 'md';

/**
 * Button color type excluding 'theme' color.
 * Used for variants that don't support the 'theme' color.
 */
type ColorWithoutThemeValue = Exclude<ButtonColor, 'theme'>;

/**
 * Base props for the Button component.
 * These props are shared across all button variants.
 */
type BaseButtonProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
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
};

/**
 * Props for the Button component.
 *
 * This type describes all the properties that can be passed to the Button component,
 * divided into three variants:
 *
 * - `solid` (default): Allows any `ButtonColor` via the `color` prop (default is 'info').
 * - `outline`: Disallows the 'theme' color, only allowing 'info', 'danger', and 'anti-theme'.
 * - `transparent`: Disallows the 'theme' color, only allowing 'info', 'danger', and 'anti-theme'.
 *
 * All variants extend `BaseButtonProps`.
 */
export type ButtonProps =
  /**
   * Solid button variant.
   * Takes all color values.
   */
  | (BaseButtonProps & {
      variant?: 'solid';

      color?: ButtonColor;
    })
  /**
   * Outline button variant.
   * Renders a button with a border and transparent background.
   * Restricts the color prop to exclude 'theme', only allowing 'info', 'danger', and 'anti-theme'.
   */
  | (BaseButtonProps & { variant: 'outline'; color?: Exclude<ButtonColor, 'theme'> })
  /**
   * Transparent button variant.
   * Renders a button with no background or border.
   * Restricts the color prop to exclude 'theme', only allowing 'info', 'danger', and 'anti-theme'.
   */
  | (BaseButtonProps & { variant: 'transparent'; color?: Exclude<ButtonColor, 'theme'> });

const theme = {
  base: 'group flex h-min items-center disabled:cursor-not-allowed justify-center text-center font-medium focus:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 cursor-pointer transition-all duration-200',
  variant: {
    solid: {
      info: 'text-white bg-blue-600 border border-transparent hover:bg-blue-700',
      danger: 'text-white bg-red-700 border border-transparent hover:bg-red-800',
      theme:
        'text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 dark:text-white dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-950',
      'anti-theme':
        'text-white bg-black border border-transparent hover:bg-neutral-900 dark:text-neutral-900 dark:bg-white dark:hover:bg-neutral-50',
    },
    outline: {
      info: 'text-blue-700 border border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-700/10',
      danger:
        'text-red-700 border border-red-700 hover:bg-red-50 dark:hover:bg-red-700/10',
      'anti-theme':
        'text-black border border-black hover:bg-neutral-100 dark:text-white dark:border-white dark:hover:bg-neutral-800/40',
    },
    transparent: {
      info: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      danger: 'text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20',
      'anti-theme':
        'text-black hover:bg-neutral-50 dark:text-white dark:hover:bg-neutral-800/40',
    },
  },
  size: {
    xs: 'text-xs px-2 py-1.5 rounded-md',
    sm: 'text-sm px-3 py-2 rounded-lg',
    md: 'text-sm px-4 py-2.5 rounded-lg',
  },
};

const Button = (props: ButtonProps): JSX.Element => {
  const [local, buttonProps] = splitProps(props, [
    'children',
    'type',
    'color',
    'variant',
    'size',
    'class',
    'disabled',
    'isLoading',
    'icon',
    'iconPlacement',
  ]);

  const type = createMemo(() => local.type || 'button');
  const color = createMemo(() => local.color || 'info');
  const variant = createMemo(() => local.variant || 'solid');
  const size = createMemo(() => local.size || 'md');
  const disabled = createMemo(() => local.disabled || local.isLoading);

  const removeThemeValueFromColor = (color: ButtonColor): ColorWithoutThemeValue =>
    color === 'theme' ? 'anti-theme' : color;

  const variantClasses = createMemo(() => {
    switch (variant()) {
      case 'solid':
        return theme.variant.solid[color()];
      case 'outline':
        return theme.variant.outline[removeThemeValueFromColor(color())];
      case 'transparent':
        return theme.variant.transparent[removeThemeValueFromColor(color())];
    }
  });

  return (
    <button
      {...buttonProps}
      type={type()}
      class={twMerge(
        theme.base,
        variantClasses(),
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
