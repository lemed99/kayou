import { JSX, createMemo, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import { ChevronRightIcon } from '../icons';

export interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {
  children?: JSX.Element;
}

export interface BreadcrumbItemProps
  extends Omit<JSX.LiHTMLAttributes<HTMLLIElement>, 'ref'> {
  href?: string;
  children?: JSX.Element;
  ref?: HTMLLIElement;
}

const theme = {
  base: 'group flex items-center',
  chevron: 'mx-1 size-4 text-gray-400 group-first:hidden md:mx-2',
  href: {
    off: 'flex items-center text-sm font-medium text-gray-500 dark:text-gray-400',
    on: 'flex items-center text-sm text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 cursor-pointer',
  },
};

const Breadcrumb = (props: BreadcrumbProps) => {
  const [local, navProps] = splitProps(props, ['children', 'class']);

  return (
    <nav class={twMerge(local.class)} {...navProps}>
      <ol class="flex items-center">{local.children}</ol>
    </nav>
  );
};

const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const [local, liProps] = splitProps(props, ['children', 'class', 'href', 'ref']);

  const isLink = createMemo(() => typeof local.href !== 'undefined');

  return (
    <li class={twMerge(theme.base, local.class)} ref={local.ref} {...liProps}>
      <ChevronRightIcon class={theme.chevron} />
      <span class={theme.href[isLink() ? 'on' : 'off']}>{local.children}</span>
    </li>
  );
};

export default Object.assign(Breadcrumb, { Item: BreadcrumbItem });
