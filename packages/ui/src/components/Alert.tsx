import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { type IconProps } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

/**
 * Color variants for the Alert component.
 */
export type AlertColor = 'info' | 'failure' | 'success' | 'warning' | 'dark';

/**
 * Props for the Alert component.
 */
export interface AlertProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The color variant of the alert.
   * @default 'info'
   */
  color?: AlertColor;
  /**
   * Optional icon to display in the alert.
   */
  icon?: (props: IconProps) => JSX.Element;
  /**
   * Additional content to display below the main alert message.
   */
  additionalContent?: JSX.Element;
}

const theme = {
  base: 'flex flex-col gap-2 p-4 text-sm relative',
  color: {
    info: 'text-blue-700 bg-blue-100 border-blue-500 dark:bg-blue-200 dark:text-blue-800',
    failure: 'text-red-700 bg-red-100 border-red-500 dark:bg-red-200 dark:text-red-800',
    success:
      'text-green-700 bg-green-100 border-green-500 dark:bg-green-200 dark:text-green-800',
    warning:
      'text-yellow-700 bg-yellow-100 border-yellow-500 dark:bg-yellow-200 dark:text-yellow-800',
    dark: 'text-gray-200 bg-gray-800 border-gray-600 dark:bg-neutral-900 dark:text-neutral-300',
  },
  icon: 'size-4',
  iconWrapper: 'absolute -top-1.5 -left-1.5 rounded-full p-0.5',
  rounded: 'rounded-lg',
};

/**
 * Alert component for displaying important messages to users.
 * Uses role="alert" for screen reader accessibility.
 */
const Alert = (props: AlertProps): JSX.Element => {
  const [local, otherProps] = splitProps(props, [
    'color',
    'icon',
    'class',
    'children',
    'additionalContent',
  ]);

  const color = createMemo(() => local.color || 'info');

  return (
    <div
      role="alert"
      class={twMerge(theme.base, theme.color[color()], theme.rounded, local.class)}
      {...otherProps}
    >
      <div>
        <Show when={local.icon}>
          <div class={twMerge(theme.iconWrapper, theme.color[color()])}>
            {local.icon?.({ class: theme.icon })}
          </div>
        </Show>
        <div>{local.children}</div>
      </div>
      <Show when={local.additionalContent}>
        <div>{local.additionalContent}</div>
      </Show>
    </div>
  );
};

export default Alert;
