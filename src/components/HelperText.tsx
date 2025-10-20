import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

type HelperTextColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

export interface HelperTextProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
  content: string;
  class?: string;
  color?: HelperTextColor;
}

const helperTextTheme = {
  content: 'text-xs font-normal',
  colors: {
    failure: 'text-red-600 dark:text-red-500',
    gray: 'text-gray-500 dark:text-gray-400',
    info: 'text-blue-600 dark:text-blue-500',
    warning: 'text-yellow-600 dark:text-yellow-500',
    success: 'text-green-600 dark:text-green-500',
  },
};

const HelperText = (props: HelperTextProps) => {
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
        {props.content}
      </span>
    </Show>
  );
};

export default HelperText;
