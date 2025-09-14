import { createMemo, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';

import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  gray?: number;
  darkGray?: number;
}

const Skeleton = (props: SkeletonProps) => {
  const [local, otherProps] = splitProps(props, [
    'width',
    'height',
    'gray',
    'darkGray',
    'class',
  ]);

  const width = createMemo(() => local.width || 50);
  const height = createMemo(() => local.height || 10);
  const gray = createMemo(() => local.gray || 100);
  const darkGray = createMemo(() => local.darkGray || 700);

  return (
    <div class={twMerge('flex animate-pulse', local.class)} {...otherProps}>
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
