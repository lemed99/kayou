import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

/**
 * Color variants for the Badge component.
 */
export type BadgeColor = 'gray' | 'failure' | 'warning' | 'success' | 'dark' | 'default';

/**
 * Size variants for the Badge component.
 */
export type BadgeSize = 'xs' | 'sm';

/**
 * Props for the Badge component.
 */
export interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /**
   * The color variant of the badge.
   * @default 'default'
   */
  color?: BadgeColor;
  /**
   * The size of the badge.
   * @default 'xs'
   */
  size?: BadgeSize;
}

const theme = {
  root: {
    base: 'flex h-fit items-center gap-1 rounded px-2 py-0.5',
    color: {
      default:
        'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300',
      gray: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-600',
      failure:
        'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-300',
      success:
        'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-300',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-300',
      dark: 'bg-neutral-700 text-neutral-100 group-hover:bg-neutral-500 dark:group-hover:bg-neutral-700',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
    },
  },
};

/**
 * Badge component for displaying small status indicators or labels.
 */
const Badge = (props: BadgeProps): JSX.Element => {
  const [local, otherProps] = splitProps(props, ['color', 'size', 'class', 'children']);

  const color = createMemo(() => local.color ?? 'default');
  const size = createMemo(() => local.size ?? 'xs');

  return (
    <div
      {...otherProps}
      class={twMerge(
        theme.root.base,
        theme.root.color[color()],
        theme.root.size[size()],
        local.class,
      )}
    >
      <Show when={local.children}>
        <span>{local.children}</span>
      </Show>
    </div>
  );
};

export default Badge;
