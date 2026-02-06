import { Component, JSX, createEffect, createMemo, createSignal } from 'solid-js';

import {
  ChevronLeftDoubleIcon,
  ChevronLeftIcon,
  ChevronRightDoubleIcon,
  ChevronRightIcon,
} from '@kayou/icons';

import Button from './Button';
import NumberInput from './NumberInput';
import Tooltip from './Tooltip';

export interface PaginationLabels {
  page: string;
  of: string;
  pageN: (n: number) => string;
}

export const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  page: 'Page',
  of: 'of',
  pageN: (n: number) => `Page ${n}`,
};

export interface PaginationAriaLabels {
  goToFirst: string;
  goToPrevious: string;
  goToNext: string;
  goToLast: string;
  page: string;
}

export const DEFAULT_PAGINATION_ARIA_LABELS: PaginationAriaLabels = {
  goToFirst: 'Go to first page',
  goToPrevious: 'Go to previous page',
  goToNext: 'Go to next page',
  goToLast: 'Go to last page',
  page: 'Page',
};

/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
  /**
   * Total number of pages.
   */
  total: number;
  /**
   * Current page number (1-indexed).
   */
  page: number;
  /**
   * Callback fired when the page changes.
   */
  onChange: (page: number) => void;
  /**
   * Labels for i18n support (visible text).
   */
  labels?: Partial<PaginationLabels>;
  /**
   * Aria labels for i18n support (screen reader text).
   */
  ariaLabels?: Partial<PaginationAriaLabels>;
}

/**
 * Pagination component for navigating between pages.
 */
const Pagination: Component<PaginationProps> = (props): JSX.Element => {
  const l = createMemo(() => ({ ...DEFAULT_PAGINATION_LABELS, ...props.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_PAGINATION_ARIA_LABELS,
    ...props.ariaLabels,
  }));
  const [pageValue, setPageValue] = createSignal(1);

  createEffect(() => setPageValue(props.page));

  const setPage = (page: number) => {
    props.onChange(page);
    setPageValue(page);
  };

  const NavigationButton = (navProps: {
    onClick: () => void;
    disabled: boolean;
    content: JSX.Element;
    tooltip: string;
    ariaLabel: string;
  }) => (
    <Tooltip hidden={navProps.disabled} content={navProps.tooltip} theme="auto">
      <Button
        color="gray"
        onClick={navProps.onClick}
        disabled={navProps.disabled}
        class="size-8"
        aria-label={navProps.ariaLabel}
      >
        {navProps.content}
      </Button>
    </Tooltip>
  );

  return (
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-1 italic dark:text-white">
        <p>{l().page}</p>
        <NumberInput
          type="integer"
          showArrows={false}
          sizing="xs"
          value={pageValue()}
          onInput={(e) => setPageValue(parseInt(e.target.value))}
          fitContent={true}
          style={{
            'text-align': 'center',
            'font-style': 'normal',
            'min-width': '25px',
          }}
          onValueChange={(v) => {
            if (v !== null) setPage(v);
          }}
          min={1}
          max={props.total}
        />
        <p class="text-nowrap">
          {l().of} {props.total}
        </p>
      </div>
      <nav aria-label={a().page} class="flex items-center gap-1">
        <NavigationButton
          onClick={() => setPage(1)}
          disabled={props.page === 1}
          content={<ChevronLeftDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(1)}
          ariaLabel={a().goToFirst}
        />
        <NavigationButton
          onClick={() => setPage(Math.max(1, props.page - 1))}
          disabled={props.page === 1}
          content={<ChevronLeftIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(Math.max(1, props.page - 1))}
          ariaLabel={a().goToPrevious}
        />
        <NavigationButton
          onClick={() => setPage(Math.min(props.total, props.page + 1))}
          disabled={props.page === props.total}
          content={<ChevronRightIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(Math.min(props.total, props.page + 1))}
          ariaLabel={a().goToNext}
        />
        <NavigationButton
          onClick={() => setPage(props.total)}
          disabled={props.page === props.total}
          content={<ChevronRightDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(props.total)}
          ariaLabel={a().goToLast}
        />
      </nav>
    </div>
  );
};

export default Pagination;
