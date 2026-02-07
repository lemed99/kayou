import { Component, For, JSX, Show, ValidComponent, createMemo } from 'solid-js';
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
 * Data structure for each breadcrumb item.
 */
export interface BreadcrumbItemData {
  /** Text or JSX content displayed for this breadcrumb item. */
  label: JSX.Element;
  /** URL for the breadcrumb link. If omitted or if isCurrent is true, renders as a span. */
  href?: string;
  /**
   * Whether this item represents the current page.
   * When true, renders as a span with aria-current="page" regardless of href.
   * @default false
   */
  isCurrent?: boolean;
  /** Additional CSS classes for the <li> element. */
  class?: string;
}

/**
 * Props for the Breadcrumb component.
 */
export interface BreadcrumbProps {
  /** Array of breadcrumb items to render. */
  items?: BreadcrumbItemData[];
  /**
   * Custom component to render links (e.g., a Router Link component).
   * Applied to all items that have an href and are not isCurrent.
   * @default 'a'
   */
  as?:
    | ValidComponent
    | Component<{ href?: string; class?: string; children?: JSX.Element }>;
  /** Additional CSS classes for the <nav> element. */
  class?: string;
  /** Labels for i18n support. */
  ariaLabels?: Partial<BreadcrumbAriaLabels>;
}

const theme = {
  base: 'group flex items-center',
  chevron: 'mx-1 size-4 text-gray-400 group-first:hidden md:mx-2',
  href: {
    off: 'flex items-center text-sm font-medium text-gray-500 dark:text-neutral-400',
    on: 'flex items-center text-sm text-gray-800 hover:text-blue-600 dark:text-neutral-200 dark:hover:text-blue-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded',
  },
};

/**
 * Breadcrumb navigation component for showing page hierarchy.
 */
const Breadcrumb = (props: BreadcrumbProps): JSX.Element => {
  const a = createMemo(() => ({
    ...DEFAULT_BREADCRUMB_ARIA_LABELS,
    ...props.ariaLabels,
  }));

  const items = createMemo(() => props.items ?? []);
  const LinkComponent = createMemo(() => props.as ?? 'a');

  return (
    <nav aria-label={a().breadcrumb} class={twMerge(props.class)}>
      <ol class="flex flex-wrap items-center">
        <For each={items()}>
          {(item) => {
            const isLink = createMemo(() => !!item.href && !item.isCurrent);

            return (
              <li class={twMerge(theme.base, item.class)}>
                <ChevronRightIcon class={theme.chevron} aria-hidden="true" />
                <Show
                  when={isLink()}
                  fallback={
                    <span
                      class={theme.href.off}
                      aria-current={item.isCurrent ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  }
                >
                  <Dynamic
                    component={LinkComponent()}
                    href={item.href}
                    class={theme.href.on}
                  >
                    {item.label}
                  </Dynamic>
                </Show>
              </li>
            );
          }}
        </For>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
