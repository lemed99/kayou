import { Component, JSX, createEffect, createSignal } from 'solid-js';

import {
  ChevronLeftDoubleIcon,
  ChevronLeftIcon,
  ChevronRightDoubleIcon,
  ChevronRightIcon,
} from '../icons';
import Button from './Button';
import NumberInput from './NumberInput';
import Tooltip from './Tooltip';

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
}

/**
 * Pagination component for navigating between pages.
 */
const Pagination: Component<PaginationProps> = (props): JSX.Element => {
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
        <p>Page</p>
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
          onChange={(e) => setPage(parseInt(e.target.value))}
          min={1}
          max={props.total}
        />
        <p class="text-nowrap">sur {props.total}</p>
      </div>
      <nav aria-label="Pagination" class="flex items-center gap-1">
        <NavigationButton
          onClick={() => setPage(1)}
          disabled={props.page === 1}
          content={<ChevronLeftDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip="Page 1"
          ariaLabel="Go to first page"
        />
        <NavigationButton
          onClick={() => setPage(Math.max(1, props.page - 1))}
          disabled={props.page === 1}
          content={<ChevronLeftIcon class="size-2.5" strokeWidth={2} />}
          tooltip={`Page ${Math.max(1, props.page - 1)}`}
          ariaLabel="Go to previous page"
        />
        <NavigationButton
          onClick={() => setPage(Math.min(props.total, props.page + 1))}
          disabled={props.page === props.total}
          content={<ChevronRightIcon class="size-2.5" strokeWidth={2} />}
          tooltip={`Page ${Math.min(props.total, props.page + 1)}`}
          ariaLabel="Go to next page"
        />
        <NavigationButton
          onClick={() => setPage(props.total)}
          disabled={props.page === props.total}
          content={<ChevronRightDoubleIcon class="size-2.5" strokeWidth={2} />}
          tooltip={`Page ${props.total}`}
          ariaLabel="Go to last page"
        />
      </nav>
    </div>
  );
};

export default Pagination;
