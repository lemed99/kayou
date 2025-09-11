import { JSX, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

export type ButtonColor =
  | 'gray'
  | 'dark'
  | 'failure'
  | 'info'
  | 'light'
  | 'success'
  | 'warning'
  | 'blue';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
}

const theme = {
  base: 'group flex h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg cursor-pointer',
  color: {
    gray: 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 disabled:hover:bg-white focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:disabled:hover:bg-gray-800',
    dark: 'text-white bg-gray-800 border border-transparent hover:bg-gray-900 disabled:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:disabled:hover:bg-gray-800',
    failure:
      'text-white bg-red-700 border border-transparent hover:bg-red-800 disabled:hover:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:hover:bg-red-500',
    info: 'text-white dark:text-gray-800 bg-blue-600 border border-transparent hover:bg-blue-700 disabled:opacity-50 dark:bg-gray-50 dark:hover:bg-gray-200',
    light:
      'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 disabled:hover:bg-white dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700',
    success:
      'text-white bg-green-700 border border-transparent hover:bg-green-800 disabled:hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:disabled:hover:bg-green-600',
    warning:
      'text-white bg-yellow-400 border border-transparent hover:bg-yellow-500 disabled:hover:bg-yellow-400 dark:disabled:hover:bg-yellow-400',
    blue: 'text-blue-900 bg-white border border-blue-300 hover:bg-blue-100 disabled:hover:bg-white dark:bg-blue-600 dark:text-white dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700',
  },
  disabled: 'cursor-not-allowed opacity-50',
  size: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-base px-6 py-3',
  },
};

const Button = (props: ButtonProps) => {
  const [local, buttonProps] = splitProps(props, [
    'children',
    'type',
    'color',
    'size',
    'class',
    'disabled',
  ]);

  const type = createMemo(() => local.type || 'button');
  const color = createMemo(() => local.color || 'info');
  const size = createMemo(() => local.size || 'md');
  const disabled = createMemo(() => local.disabled || false);

  return (
    <button
      type={type()}
      class={twMerge(
        theme.base,
        theme.color[color()],
        local.class,
        disabled() ? theme.disabled : '',
      )}
      disabled={disabled()}
      {...buttonProps}
    >
      <span
        class={twMerge(
          'flex items-center rounded-md transition-all duration-200',
          theme.size[size()],
        )}
      >
        {local.children}
      </span>
    </button>
  );
};

export default Button;
