import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

/**
 * Color variants for the HelperText component.
 */
export type HelperTextColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

/**
 * Props for the HelperText component.
 */
export interface HelperTextProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /**
   * The helper text content to display.
   */
  content: string;
  class?: string;
  /**
   * Color variant of the helper text.
   * @default 'gray'
   */
  color?: HelperTextColor;
}

const helperTextTheme = {
  content: 'text-xs font-normal',
  colors: {
    failure: 'text-red-600 dark:text-red-500',
    gray: 'text-neutral-500 dark:text-neutral-400',
    info: 'text-blue-600 dark:text-blue-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
    success: 'text-green-600 dark:text-green-500',
  },
};

/**
 * HelperText component for displaying form field hints or error messages.
 */
const HelperText = (props: HelperTextProps): JSX.Element => {
  const [local, otherProps] = splitProps(props, ['color', 'class', 'content']);
  const color = createMemo(() => local.color || 'gray');

  return (
    <Show when={local.content}>
      <span
        class={twMerge(
          'mt-0.5 block',
          helperTextTheme.colors[color()],
          helperTextTheme.content,
          local.class,
          otherProps.onClick ? 'cursor-pointer' : '',
        )}
        {...otherProps}
      >
        {local.content}
      </span>
    </Show>
  );
};

export default HelperText;
