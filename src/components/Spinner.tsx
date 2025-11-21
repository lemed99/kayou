import { JSX } from 'solid-js/jsx-runtime';

import { twMerge } from 'tailwind-merge';

import { defaultProps } from '../helpers/defaultProps';

export interface SpinnerProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
  color?: 'gray' | 'dark' | 'failure' | 'info' | 'light' | 'success' | 'warning' | 'blue';
  size?: 'xs' | 'sm' | 'md';
}

const theme = {
  base: 'inline animate-spin text-gray-200',
  color: {
    failure: 'fill-red-600',
    gray: 'fill-gray-600',
    info: 'fill-blue-600',
    success: 'fill-green-700',
    dark: 'fill-gray-800',
    warning: 'fill-yellow-400',
    blue: 'fill-blue-600',
    light: 'fill-gray-600',
  },
  size: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
  },
};

const Spinner = (props: SpinnerProps) => {
  const merged = defaultProps({ color: 'info', size: 'sm' }, props);

  return (
    <span role="status" class="flex items-center justify-center">
      <svg
        fill="none"
        viewBox="0 0 100 100"
        class={twMerge(
          theme.base,
          theme.color[merged.color],
          theme.size[merged.size],
          merged.class,
        )}
      >
        <path
          d="M0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50H90C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90V100C22.3858 100 0 77.6142 0 50Z"
          fill="currentColor"
        />
        <path
          d="M100 50C100 77.6142 77.6142 100 50 100V90C72.0914 90 90 72.0914 90 50H100Z"
          fill="currentFill"
        />
      </svg>
    </span>
  );
};

export default Spinner;
