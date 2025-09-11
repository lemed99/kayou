import { JSX, Show, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  color?: 'gray' | 'failure' | 'warning' | 'success' | 'dark' | 'default';
  size?: 'xs' | 'sm';
}

const theme = {
  root: {
    base: 'flex h-fit items-center gap-1 rounded px-2 py-0.5',
    color: {
      default:
        'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600',
      failure:
        'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900 group-hover:bg-red-200 dark:group-hover:bg-red-300',
      success:
        'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-300',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-300',
      dark: 'bg-gray-700 text-gray-100 group-hover:bg-gray-500 dark:group-hover:bg-gray-700',
    },
    href: 'group',
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
    },
  },
};

const Badge = (props: BadgeProps) => {
  const [local, otherProps] = splitProps(props, ['color', 'size', 'class', 'children']);

  const color = createMemo(() => local.color || 'default');
  const size = createMemo(() => local.size || 'xs');

  return (
    <div
      class={twMerge(
        theme.root.base,
        theme.root.color[color()],
        theme.root.size[size()],
        local.class,
      )}
      {...otherProps}
    >
      <Show when={local.children}>
        <span>{local.children}</span>
      </Show>
    </div>
  );
};

export default Badge;
