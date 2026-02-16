import { createMemo, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { twMerge } from 'tailwind-merge';

// Static class maps to ensure Tailwind JIT compiles these classes
const GRAY_CLASSES: Record<number, string> = {
  100: 'bg-neutral-100',
  200: 'bg-neutral-200',
  300: 'bg-neutral-300',
  400: 'bg-neutral-400',
  500: 'bg-neutral-500',
  600: 'bg-neutral-600',
  700: 'bg-neutral-700',
  800: 'bg-neutral-800',
  900: 'bg-neutral-900',
};

const DARK_GRAY_CLASSES: Record<number, string> = {
  100: 'dark:bg-neutral-100',
  200: 'dark:bg-neutral-200',
  300: 'dark:bg-neutral-300',
  400: 'dark:bg-neutral-400',
  500: 'dark:bg-neutral-500',
  600: 'dark:bg-neutral-600',
  700: 'dark:bg-neutral-700',
  800: 'dark:bg-neutral-800',
  900: 'dark:bg-neutral-900',
};

export interface SkeletonAriaLabels {
  loading: string;
}

export const DEFAULT_SKELETON_ARIA_LABELS: SkeletonAriaLabels = {
  loading: 'Loading...',
};

/**
 * Props for the Skeleton component.
 */
export type GrayShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the skeleton. Can be a number (px) or string (e.g., '100%').
   * @default 50
   */
  width?: string | number;
  /**
   * Height of the skeleton. Can be a number (px) or string (e.g., '100%').
   * @default 10
   */
  height?: string | number;
  /**
   * Gray shade for light mode (100-900).
   * @default 100
   */
  gray?: GrayShade;
  /**
   * Gray shade for dark mode (100-900).
   * @default 700
   */
  darkGray?: GrayShade;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<SkeletonAriaLabels>;
}

/**
 * Skeleton component for loading placeholders.
 * Uses aria-busy and aria-label for accessibility.
 */
const Skeleton = (props: SkeletonProps): JSX.Element => {
  const [local, otherProps] = splitProps(props, [
    'width',
    'height',
    'gray',
    'darkGray',
    'class',
    'ariaLabels',
  ]);
  const a = createMemo(() => ({ ...DEFAULT_SKELETON_ARIA_LABELS, ...local.ariaLabels }));

  const width = createMemo(() => local.width ?? 50);
  const height = createMemo(() => local.height ?? 10);
  const gray = createMemo(() => local.gray ?? 100);
  const darkGray = createMemo(() => local.darkGray ?? 700);

  return (
    <div
      {...otherProps}
      role="status"
      aria-busy="true"
      aria-label={a().loading}
      class={twMerge('flex animate-pulse', local.class)}
    >
      <div
        style={{
          width: typeof width() === 'number' ? `${width()}px` : (width() as string),
          height: typeof height() === 'number' ? `${height()}px` : (height() as string),
        }}
        class={twMerge(
          'rounded-lg',
          GRAY_CLASSES[gray()] || 'bg-neutral-100',
          DARK_GRAY_CLASSES[darkGray()] || 'dark:bg-neutral-700',
        )}
      />
    </div>
  );
};

export default Skeleton;
