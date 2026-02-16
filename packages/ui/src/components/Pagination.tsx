import {
  Component,
  JSX,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
} from 'solid-js';

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
export interface PaginationProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

const NavigationButton = (props: {
  onClick: () => void;
  disabled: boolean;
  content: JSX.Element;
  tooltip: string;
  ariaLabel: string;
}) => (
  <Tooltip hidden={props.disabled} content={props.tooltip}>
    <Button
      color="transparent"
      onClick={props.onClick}
      disabled={props.disabled}
      class="size-8"
      aria-label={props.ariaLabel}
    >
      {props.content}
    </Button>
  </Tooltip>
);

/**
 * Pagination component for navigating between pages.
 */
const Pagination: Component<PaginationProps> = (props): JSX.Element => {
  const [local, divProps] = splitProps(props, [
    'total',
    'page',
    'onChange',
    'labels',
    'ariaLabels',
    'class',
  ]);

  const l = createMemo(() => ({ ...DEFAULT_PAGINATION_LABELS, ...local.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_PAGINATION_ARIA_LABELS,
    ...local.ariaLabels,
  }));
  const [pageValue, setPageValue] = createSignal(1);
  const total = () => Math.max(0, local.total);
  const allDisabled = () => total() <= 0;

  createEffect(() => setPageValue(local.page));

  const setPage = (page: number) => {
    local.onChange(page);
    setPageValue(page);
  };

  return (
    <div {...divProps} class={`flex items-center gap-6 ${local.class ?? ''}`}>
      <div class="flex items-center gap-1 italic dark:text-white" aria-current="page">
        <p>{l().page}</p>
        <NumberInput
          type="integer"
          showArrows={false}
          sizing="xs"
          value={pageValue()}
          onInput={(e) => {
            const v = parseInt(e.target.value);
            if (!isNaN(v)) setPageValue(v);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
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
          max={total()}
          disabled={allDisabled()}
        />
        <p class="text-nowrap">
          {l().of} {total()}
        </p>
      </div>
      <nav aria-label={a().page} class="flex items-center gap-1">
        <NavigationButton
          onClick={() => setPage(1)}
          disabled={allDisabled() || local.page <= 1}
          content={<ChevronLeftDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(1)}
          ariaLabel={a().goToFirst}
        />
        <NavigationButton
          onClick={() => setPage(Math.max(1, local.page - 1))}
          disabled={allDisabled() || local.page <= 1}
          content={<ChevronLeftIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(Math.max(1, local.page - 1))}
          ariaLabel={a().goToPrevious}
        />
        <NavigationButton
          onClick={() => setPage(Math.min(total(), local.page + 1))}
          disabled={allDisabled() || local.page >= total()}
          content={<ChevronRightIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(Math.min(total(), local.page + 1))}
          ariaLabel={a().goToNext}
        />
        <NavigationButton
          onClick={() => setPage(total())}
          disabled={allDisabled() || local.page >= total()}
          content={<ChevronRightDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip={l().pageN(total())}
          ariaLabel={a().goToLast}
        />
      </nav>
    </div>
  );
};

export default Pagination;
