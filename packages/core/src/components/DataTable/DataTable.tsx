import {
  Accessor,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';

import {
  Columns03Icon,
  FilterFunnel01Icon,
  InfoCircleIcon,
  Maximize01Icon,
  SearchRefractionIcon,
  XCloseIcon,
} from '@exowpee/solidly-icons';
import { twMerge } from 'tailwind-merge';

import { getScrollableAncestor } from '../../hooks';
import { useDataTableFilters } from '../../hooks/useDataTableFilters';
import Button from '../Button';
import Checkbox from '../Checkbox';
import { DynamicVirtualList } from '../DynamicVirtualList';
import Modal from '../Modal';
import MultiSelect from '../MultiSelect';
import Pagination from '../Pagination';
import Select from '../Select';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
import { VirtualList } from '../VirtualList';
import { DataTableFilters } from './DataTableFilters';
import { FilterConfig, FilterState } from './types';

/**
 * Column configuration for the DataTable component.
 */
export interface DataTableColumnProps<T> {
  /** Column header label. */
  label: string;
  /** Key to access the column data from row objects. */
  key: string;
  /** Custom render function for cell content. */
  render?: (value?: unknown, record?: T, index?: number) => JSX.Element;
  /** Column width as percentage of table width. */
  width: number;
  /** Tooltip text for the column header. */
  tooltip?: string;
}

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<T> {
  /** Array of data rows to display. */
  data: T[];
  /** Whether the table is in a loading state. */
  loading: boolean;
  /** Whether the table is validating/refreshing data. */
  validating?: boolean;
  /** Default visible column keys. */
  defaultColumns?: string[];
  /** Default number of rows to show when not expanded. @default 5 */
  defaultRowsCount?: number;
  /** Column configurations. */
  columns: DataTableColumnProps<T>[];
  /** Total number of pages for pagination. */
  pageTotal?: number;
  /** Whether row selection is enabled. */
  rowSelection?: boolean;
  /** Error state for the table. */
  error: unknown;
  /** Callback fired when page changes. */
  onPageChange?: (page: number) => void;
  /** Whether to show the search bar. */
  searchBar?: boolean;
  /** Whether to allow column configuration. */
  configureColumns?: boolean;
  /** Whether the table can be expanded to full view. */
  expandable?: boolean;
  /** Custom filter components. */
  filters?: JSX.Element;
  /** Number of active filters to display (for custom filters). @default 0 */
  activeFilterCount?: number;
  /** Whether to show per-page control. */
  perPageControl?: boolean;
  /** Fixed row height for virtualization. */
  rowHeight?: number;
  /** Estimated row height for dynamic virtualization. */
  estimatedRowHeight?: number;
  /** Message to display on error. */
  errorMessage: string;
  /** Message to display when no data. */
  noDataMessage: string;
  /** Text for the "see more" expand button. */
  seeMoreText: string;
  /** Text for the filter button. */
  filterButtonText?: string;
  /** Text label for elements per page control. */
  elementsPerPageText: string;
  /** Function to format selected elements text. */
  selectedElementsText: (count: number, total: number) => string;
  /** Whether to show the footer. @default true */
  footer?: boolean;

  // Filter system props
  /** Filter configurations for automatic filter UI generation. */
  filterConfigs?: FilterConfig<T>[];
  /** Controlled filter state (for external mode). */
  filterState?: FilterState;
  /** Callback when filters change (for controlled mode). */
  onFiltersChange?: (filters: FilterState) => void;
  /** Filter mode: 'internal' applies filters locally, 'external' for server-side filtering. @default 'internal' */
  filterMode?: 'internal' | 'external';
  /** Text for the "Add filter" link. */
  addFilterText?: string;
  /** Text for the "Reset" button. */
  resetText?: string;
  /** Text for the "Apply" button. */
  applyText?: string;
  /** Text when no filters are applied. */
  noFiltersText?: string;
}

/**
 * DataTable component for displaying tabular data with virtualization,
 * pagination, sorting, filtering, and row selection.
 */
export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
): JSX.Element {
  const [searchKey, setSearchKey] = createSignal('');
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = createSignal(1);
  const [perPage, setPerPage] = createSignal(10);
  const [columns, setColumns] = createSignal<DataTableColumnProps<T>[]>([]);
  const [tableRef, setTableRef] = createSignal<HTMLDivElement | undefined>();
  const [tableWidth, setTableWidth] = createSignal(0);
  const [searchRef, setSearchRef] = createSignal<HTMLInputElement | undefined>();
  const [tableBodyContainerRef, setTableBodyContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();
  const [tableRowsContainerRef, setTableRowsContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();
  const [fullView, setFullView] = createSignal(false);
  const [hasScrolled, setHasScrolled] = createSignal(false);
  const [rowGridStyle, setRowGridStyle] = createSignal('');
  const [pageScroll, setPageScroll] = createSignal(0);
  const [tableBodyHeight, setTableBodyHeight] = createSignal(0);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [averageRowHeight, setAverageRowHeight] = createSignal(0);

  // Filter system integration
  const filterHook = createMemo(() => {
    if (!props.filterConfigs || props.filterConfigs.length === 0) return null;
    return useDataTableFilters<T>({
      data: () => props.data,
      filterConfigs: props.filterConfigs,
      filters: props.filterState,
      onFiltersChange: props.onFiltersChange,
      filterMode: props.filterMode ?? 'internal',
    });
  });

  // Base data after filter system is applied
  const baseData = createMemo(() => {
    const hook = filterHook();
    if (hook) return hook.filteredData();
    return props.data;
  });

  const allSelected = createMemo(() => {
    if (baseData().length === 0) return false;
    return baseData().every((_, idx) => selectedRows().has(idx));
  });

  const ancestor = () => getScrollableAncestor(tableRef() || null) || window;

  createEffect(() => {
    setColumns(
      props.defaultColumns
        ? props.columns.filter((c) => props.defaultColumns?.includes(c.key))
        : props.columns,
    );
  });

  const toggleSelectAll = () => {
    if (allSelected()) {
      setSelectedRows(new Set<number>());
    } else {
      setSelectedRows(new Set(baseData().map((_, idx) => idx)));
    }
  };

  const toggleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows());
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange?.(page);
  };

  const defaultRowsCount = createMemo(() => props.defaultRowsCount ?? 5);

  const filteredData = createMemo(() => {
    const filtered = baseData();
    if (fullView()) return filtered;
    if (props.expandable && baseData().length > defaultRowsCount())
      return filtered.slice(0, defaultRowsCount());
    return filtered;
  });

  const sharedPercentage = () => {
    const allColumnsPercentage = props.columns.reduce((acc, v) => acc + v.width, 0);
    const displayedColumnsPercentage = columns().reduce((acc, v) => acc + v.width, 0);
    return (allColumnsPercentage - displayedColumnsPercentage) / columns().length;
  };

  createEffect(() => {
    const table = tableRef();
    setRowGridStyle(
      `${props.rowSelection ? '40px ' : ''}${columns()
        .map((col, i) => {
          const minWidth = Math.max(
            0,
            ...Array.from(
              table?.querySelectorAll(`[data-column="${col.key}"]`) || [],
            ).map((e) => (e as HTMLElement).offsetWidth),
          );
          return `minmax(${Math.max(0, minWidth + 48)}px, ${Math.max(0, (tableWidth() * (col.width + sharedPercentage())) / 100 - (i === 0 ? (props.rowSelection ? 40 : 0) : 0))}px)`; // +48 because of px-6
        })
        .join(' ')}`,
    );
  });

  createEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    if (tableRef()) {
      resizeObserver = new ResizeObserver(() => {
        setTableWidth(tableRef()!.offsetWidth);
        if (tableBodyContainerRef())
          setTableBodyHeight(tableBodyContainerRef()!.offsetHeight);
      });
      resizeObserver.observe(tableRef()!);
    }
    onCleanup(() => resizeObserver?.disconnect());
  });

  createEffect(() => {
    const container = tableRowsContainerRef();
    if (!container || !fullView() || hasScrolled()) return;
    if (props.rowHeight) {
      container.scrollTop = scrollTop();
    } else if (props.estimatedRowHeight) {
      container.scrollTo({
        top: scrollTop(),
        left: 0,
        behavior: 'smooth',
      });
      const st = setTimeout(() => setHasScrolled(true), 10);
      onCleanup(() => clearTimeout(st));
    }
  });

  const List = (row: T, index: Accessor<number>) => (
    <div
      class={twMerge(
        'grid w-fit bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700',
        fullView() ? '' : 'border-b border-gray-200 last:border-b-0 dark:border-gray-700',
        selectedRows().has(index()) ? 'bg-neutral-100 dark:bg-gray-800' : '',
      )}
      style={{
        'grid-template-columns': rowGridStyle(),
      }}
    >
      <Show when={props.rowSelection}>
        <div class="flex items-center py-3 pl-6">
          <Checkbox
            checked={selectedRows().has(index())}
            onChange={() => toggleSelectRow(index())}
            aria-label={`Select row ${index() + 1}`}
          />
        </div>
      </Show>

      <For each={columns()}>
        {(column) => (
          <div class="flex items-center truncate px-6 py-4 text-gray-900 dark:text-white">
            <Show
              when={column.render}
              fallback={<span data-column={column.key}>{String(row[column.key])}</span>}
            >
              <span data-column={column.key}>
                {column.render!(row[column.key], row, index())}
              </span>
            </Show>
          </div>
        )}
      </For>
    </div>
  );

  const NoItemsComponent = () => (
    <div class="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
      {props.noDataMessage}
    </div>
  );

  const VProps = () => ({
    items: filteredData,
    rootHeight: tableBodyHeight(),
    overscanCount: 3,
    containerPadding: 0,
    containerWidth: '100%',
    setContainerRef: setTableRowsContainerRef,
    setScrollPosition: setScrollTop,
    fallback: <NoItemsComponent />,
    rowClass: 'border-b border-gray-200 last:border-b-0 dark:border-gray-700',
  });

  const Table = () => {
    return (
      <div
        ref={setTableRef}
        class={twMerge(
          'flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
          fullView() ? 'mt-2 h-[calc(100%-8px)]' : 'h-auto',
        )}
      >
        {/* Search Section */}
        <Show when={props.searchBar}>
          <div class="flex w-full shrink-0 border-b border-gray-200 px-6 dark:border-gray-700">
            <div class="relative flex w-full max-w-md items-center">
              <SearchRefractionIcon class="size-5 text-gray-400 dark:text-gray-500" />
              <input
                ref={setSearchRef}
                value={searchKey()}
                onInput={(e) => setSearchKey(e.target.value)}
                placeholder="Search"
                aria-label="Search table data"
                onFocus={(e) => e.target.select()}
                class="w-full bg-transparent py-3 pl-2 text-sm outline-none dark:text-white"
              />
              <Show when={searchKey()}>
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchKey('');
                    searchRef()?.focus();
                  }}
                  class="absolute right-0 top-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <XCloseIcon class="size-4" aria-hidden="true" />
                </button>
              </Show>
            </div>
          </div>
        </Show>

        {/* Filter System Section (when filterConfigs is provided) */}
        <Show when={filterHook()}>
          {(hook) => (
            <DataTableFilters
              filterConfigs={props.filterConfigs!}
              activeFilters={hook().activeFilters}
              setFilter={hook().setFilter}
              removeFilter={hook().removeFilter}
              clearFilters={hook().clearFilters}
              getOperators={hook().getOperators}
              filterButtonText={props.filterButtonText}
              addFilterText={props.addFilterText}
              resetText={props.resetText}
              applyText={props.applyText}
              noFiltersText={props.noFiltersText}
              class={!props.searchBar ? 'rounded-t-lg' : ''}
            />
          )}
        </Show>

        {/* Custom Filters Section (legacy, when filters JSX is provided) */}
        <Show when={props.filters && !filterHook()}>
          <div
            class={twMerge(
              'flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-2 dark:border-gray-700',
              !props.searchBar ? 'rounded-t-lg' : '',
            )}
          >
            <div class="flex items-center">
              <div class="flex items-center border-r border-gray-200 py-3 pr-6 dark:border-gray-700">
                <FilterFunnel01Icon class="mr-2 size-5" />
                <p>{props.filterButtonText || 'Filter'}</p>
                <span class="ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 p-2.5 text-xs font-medium text-white dark:bg-white dark:text-gray-600">
                  {props.activeFilterCount ?? 0}
                </span>
              </div>
              <div />
            </div>
            <Show when={props.configureColumns || props.expandable}>
              <div class="flex items-center gap-2">
                <Show when={props.configureColumns}>
                  <MultiSelect
                    sizing="sm"
                    options={props.columns.map((c) => ({
                      label: c.label,
                      value: c.key,
                    }))}
                    onMultiSelect={(options) => {
                      setColumns(
                        props.columns.filter((c) =>
                          options?.map((o) => o.value).includes(c.key),
                        ),
                      );
                    }}
                    values={columns().map((c) => c.key)}
                    displayValue="Colonnes"
                    icon={() => <Columns03Icon class="size-5" />}
                    fitContent={true}
                  />
                </Show>
              </div>
            </Show>
          </div>
        </Show>

        {/* Selected Items Section */}
        <Show when={props.rowSelection && selectedRows().size > 0}>
          <div
            class={twMerge(
              'flex shrink-0 items-center border-b border-gray-200 px-6 py-3 dark:border-gray-700',
              !props.searchBar && !props.filters ? 'rounded-t-lg' : '',
            )}
          >
            <div class="flex items-center gap-3">
              <Button size="xs" color="light">
                ···
              </Button>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {props.selectedElementsText(selectedRows().size, baseData().length)}
              </span>
            </div>
          </div>
        </Show>

        {/* Table Header */}
        <div
          class={twMerge(
            'grid w-fit border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400',
            !props.searchBar &&
              !props.filters &&
              !(props.rowSelection && selectedRows().size > 0)
              ? 'rounded-t-lg'
              : '',
          )}
          style={{
            'grid-template-columns': rowGridStyle(),
          }}
        >
          <Show when={props.rowSelection}>
            <div class="flex items-center py-3 pl-6">
              <Checkbox
                checked={allSelected()}
                onChange={toggleSelectAll}
                aria-label="Select all rows"
              />
            </div>
          </Show>

          <For each={columns()}>
            {(column) => (
              <div
                class="flex items-center gap-1 whitespace-nowrap px-6 py-3"
                title={column.tooltip || column.label}
              >
                <span>{column.label}</span>
                <Show when={column.tooltip}>
                  <Tooltip
                    content={column.tooltip}
                    theme="auto"
                    placement="top"
                    class="capitalize"
                  >
                    <InfoCircleIcon />
                  </Tooltip>
                </Show>
              </div>
            )}
          </For>
        </div>

        {/* Table Body */}
        <div
          ref={(el) => (fullView() ? setTableBodyContainerRef(el) : void 0)}
          class={twMerge('relative flex flex-col', fullView() ? 'grow' : '')}
        >
          <Show
            when={!props.loading && !props.error}
            fallback={
              <div>
                <Show when={props.loading}>
                  <div
                    role="status"
                    aria-live="polite"
                    aria-label="Loading table data"
                    class={twMerge('grid bg-white dark:bg-gray-900')}
                    style={{
                      'grid-template-columns': rowGridStyle(),
                    }}
                  >
                    <Show when={props.rowSelection}>
                      <div class="flex items-center pl-6">
                        <Skeleton width={16} height={16} />
                      </div>
                    </Show>
                    <For each={columns()}>
                      {() => (
                        <div class="px-6 py-5">
                          <Skeleton width={100} height={10} />
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                <Show when={props.error}>
                  <div
                    role="alert"
                    class="whitespace-nowrap px-6 py-4 text-center font-medium text-red-600 dark:text-red-400"
                  >
                    {props.errorMessage}
                  </div>
                </Show>
              </div>
            }
          >
            <Show when={props.validating}>
              <div
                role="status"
                aria-live="polite"
                aria-label="Refreshing data"
                class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/60 dark:bg-gray-900/60"
              >
                <Spinner />
              </div>
            </Show>
            <Show when={props.rowHeight && fullView() && tableBodyHeight()}>
              <VirtualList rowHeight={props.rowHeight!} {...VProps()}>
                {List}
              </VirtualList>
            </Show>
            <Show when={props.estimatedRowHeight && fullView() && tableBodyHeight()}>
              <DynamicVirtualList
                estimatedRowHeight={averageRowHeight() ?? props.estimatedRowHeight!}
                setAverageRowHeight={setAverageRowHeight}
                {...VProps()}
              >
                {List}
              </DynamicVirtualList>
            </Show>
            <Show when={fullView() === false}>
              <div>
                <For each={filteredData()} fallback={<NoItemsComponent />}>
                  {List}
                </For>
              </div>
            </Show>
          </Show>
        </div>

        {/* FullView trigger */}
        <Show when={!props.validating && !props.loading}>
          <Show
            when={
              props.expandable && baseData().length > defaultRowsCount() && !fullView()
            }
          >
            <button
              type="button"
              onClick={() => {
                setPageScroll((ancestor() as Element).scrollTop);
                setFullView(true);
              }}
              class="group flex w-full cursor-pointer items-center justify-center gap-2 border-t border-gray-200 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            >
              <span>{props.seeMoreText}</span>
              <Maximize01Icon
                class="size-3 transition-all group-hover:size-4"
                aria-hidden="true"
              />
            </button>
          </Show>
        </Show>

        {/* Table Footer */}
        <Show when={props.expandable && !fullView() ? false : (props.footer ?? true)}>
          <div class="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row dark:border-gray-700">
            <div class="flex items-center gap-4">
              <Show when={props.perPageControl}>
                <div class="flex items-center gap-2">
                  <Select
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: '100', label: '100' },
                    ]}
                    sizing="xs"
                    value={String(perPage())}
                    onSelect={(option) => setPerPage(Number(option?.value || 10))}
                    fitContent={true}
                  />
                  <span class="whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {props.elementsPerPageText}
                  </span>
                </div>
              </Show>
            </div>

            <Show when={props.pageTotal && props.pageTotal > 1}>
              <Pagination
                total={props.pageTotal!}
                page={currentPage()}
                onChange={handlePageChange}
              />
            </Show>
          </div>
        </Show>
      </div>
    );
  };

  const FullView = () => {
    return (
      <Modal
        show={fullView()}
        size="screen"
        onClose={() => {
          setFullView(false);
          setHasScrolled(false);
          ancestor().scroll(0, pageScroll());
        }}
      >
        <Table />
      </Modal>
    );
  };

  return (
    <Show when={fullView()} fallback={<Table />}>
      <FullView />
    </Show>
  );
}
