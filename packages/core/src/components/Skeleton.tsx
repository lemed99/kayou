import { createMemo, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { twMerge } from 'tailwind-merge';

/**
 * Props for the Skeleton component.
 */
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
  gray?: number;
  /**
   * Gray shade for dark mode (100-900).
   * @default 700
   */
  darkGray?: number;
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
  ]);

  const width = createMemo(() => local.width || 50);
  const height = createMemo(() => local.height || 10);
  const gray = createMemo(() => local.gray ?? 100);
  const darkGray = createMemo(() => local.darkGray ?? 700);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      class={twMerge('flex animate-pulse', local.class)}
      {...otherProps}
    >
      <div
        style={{
          width: typeof width() === 'number' ? `${width()}px` : (width() as string),
          height: typeof height() === 'number' ? `${height()}px` : (height() as string),
        }}
        class={`rounded-lg bg-gray-${gray()} dark:bg-gray-${darkGray()}`}
      />
    </div>
  );
};

export default Skeleton;
