import { Show, createMemo } from 'solid-js';

import { twMerge } from 'tailwind-merge';

type HelperTextColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

export interface HelperTextProps {
  content: string;
  class?: string;
  color?: HelperTextColor;
  action?: () => void;
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
  const color = createMemo(() => props.color || 'gray');

  return (
    <Show when={props.content}>
      <span
        onClick={() => props.action ?? void(0)}
        class={twMerge(
          'mt-0.5 block',
          helperTextTheme.colors[color()],
          helperTextTheme.content,
          props.class,
          props.action ? 'cursor-pointer' : ''
        )}
      >
        {props.content}
      </span>
    </Show>
  );
};

export default HelperText;
