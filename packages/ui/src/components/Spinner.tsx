import { createMemo, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { twMerge } from 'tailwind-merge';

export interface SpinnerAriaLabels {
  loading: string;
}

export const DEFAULT_SPINNER_ARIA_LABELS: SpinnerAriaLabels = {
  loading: 'Loading...',
};

/**
 * Color variants for the Spinner component.
 */
export type SpinnerColor = 'info' | 'danger' | 'theme' | 'anti-theme' | 'transparent';

/**
 * Size variants for the Spinner component.
 */
export type SpinnerSize = 'xs' | 'sm' | 'md';

/**
 * Props for the Spinner component.
 */
export interface SpinnerProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /**
   * Color variant of the spinner.
   * @default 'info'
   */
  color?: SpinnerColor;
  /**
   * Size of the spinner.
   * @default 'sm'
   */
  size?: SpinnerSize;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<SpinnerAriaLabels>;
}

const theme = {
  base: 'inline animate-spin text-neutral-300',
  color: {
    danger: 'fill-red-700',
    info: 'fill-blue-600',
    theme: 'fill-black dark:fill-white',
    'anti-theme': 'fill-white dark:fill-black',
    transparent: 'fill-transparent',
  },
  size: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
  },
};

/**
 * Spinner component for loading indicators.
 * Includes screen reader text for accessibility.
 */
const Spinner = (props: SpinnerProps): JSX.Element => {
  const [local, spanProps] = splitProps(props, ['color', 'size', 'class', 'ariaLabels']);

  const color = createMemo(() => local.color || 'info');
  const size = createMemo(() => local.size || 'sm');
  const labels = createMemo(() => ({
    ...DEFAULT_SPINNER_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  return (
    <span {...spanProps} role="status" class="flex items-center justify-center">
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 100 100"
        class={twMerge(theme.base, theme.color[color()], theme.size[size()], local.class)}
      >
        <path
          d="M0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50H90C90 27.9086 72.0914 10 50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90V100C22.3858 100 0 77.6142 0 50Z"
          fill="currentColor"
        />
        <path d="M100 50C100 77.6142 77.6142 100 50 100V90C72.0914 90 90 72.0914 90 50H100Z" />
      </svg>
      <span class="sr-only">{labels().loading}</span>
    </span>
  );
};

export default Spinner;
