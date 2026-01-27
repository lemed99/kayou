import { Component, JSX, ValidComponent, createMemo, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { ChevronRightIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

export interface BreadcrumbAriaLabels {
  breadcrumb: string;
}

export const DEFAULT_BREADCRUMB_ARIA_LABELS: BreadcrumbAriaLabels = {
  breadcrumb: 'Breadcrumb',
};

/**
 * Props for the Breadcrumb component.
 */
export interface BreadcrumbProps extends JSX.HTMLAttributes<HTMLElement> {
  children?: JSX.Element;
  /**
   * Labels for i18n support.
   */
  ariaLabels?: Partial<BreadcrumbAriaLabels>;
}

/**
 * Props for individual breadcrumb items.
 */
export interface BreadcrumbItemProps
  extends Omit<JSX.LiHTMLAttributes<HTMLLIElement>, 'ref'> {
  /**
   * URL for the breadcrumb link. If not provided, renders as text.
   */
  href?: string;
  children?: JSX.Element;
  ref?: HTMLLIElement;
  /**
   * Whether this item represents the current page.
   * @default false
   */
  isCurrent?: boolean;
  /**
   * Custom component to render the link (e.g., Router's Link component).
   * @default 'a'
   */
  as?:
    | ValidComponent
    | Component<{ href?: string; class?: string; children?: JSX.Element }>;
}

const theme = {
  base: 'group flex items-center',
  chevron: 'mx-1 size-4 text-gray-400 group-first:hidden md:mx-2',
  href: {
    off: 'flex items-center text-sm font-medium text-gray-500 dark:text-neutral-400',
    on: 'flex items-center text-sm text-gray-800 hover:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-400 cursor-pointer',
  },
};

/**
 * Breadcrumb navigation component for showing page hierarchy.
 */
const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  const [local, navProps] = splitProps(props, ['children', 'class', 'ariaLabels']);
  const a = createMemo(() => ({ ...DEFAULT_BREADCRUMB_ARIA_LABELS, ...local.ariaLabels }));

  return (
    <nav aria-label={a().breadcrumb} class={twMerge(local.class)} {...navProps}>
      <ol class="flex items-center">{local.children}</ol>
    </nav>
  );
};

/**
 * Individual breadcrumb item component.
 */
const BreadcrumbItem = (props: BreadcrumbItemProps): JSX.Element => {
  const [local, liProps] = splitProps(props, [
    'children',
    'class',
    'href',
    'ref',
    'isCurrent',
    'as',
  ]);

  const isLink = createMemo(() => typeof local.href !== 'undefined');
  const LinkComponent = createMemo(() => local.as || 'a');

  return (
    <li class={twMerge(theme.base, local.class)} ref={local.ref} {...liProps}>
      <ChevronRightIcon class={theme.chevron} aria-hidden="true" />
      {isLink() ? (
        <Dynamic
          component={LinkComponent()}
          href={local.href}
          class={theme.href.on}
          aria-current={local.isCurrent ? 'page' : undefined}
        >
          {local.children}
        </Dynamic>
      ) : (
        <span class={theme.href.off} aria-current={local.isCurrent ? 'page' : undefined}>
          {local.children}
        </span>
      )}
    </li>
  );
};

export default Object.assign(Breadcrumb, { Item: BreadcrumbItem });
