import {
  Accessor,
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import {
  Columns03Icon,
  Expand01Icon,
  FilterFunnel01Icon,
  InfoCircleIcon,
  Minimize01Icon,
  SearchRefractionIcon,
  XCloseIcon,
} from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Button from '../Button';
import Checkbox from '../Checkbox';
import { DynamicVirtualList } from '../DynamicVirtualList';
import Pagination from '../Pagination';
import Select, { MultiSelect } from '../Select';
import Skeleton from '../Skeleton';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
import { VirtualList } from '../VirtualList';
import { useDataTableState } from './DataTableContext';
import { DataTableFilters } from './DataTableFilters';
import { FilterConfig, FilterState } from './types';
import { useDataTableFilters } from './useDataTableFilters';

export interface DataTableLabels {
  searchPlaceholder: string;
  filter: string;
  columns: string;
}

export const DEFAULT_DATA_TABLE_LABELS: DataTableLabels = {
  searchPlaceholder: 'Search...',
  filter: 'Filter',
  columns: 'Columns',
};

export interface DataTableAriaLabels {
  search: string;
  clearSearch: string;
  loadingData: string;
  refreshingData: string;
}

export const DEFAULT_DATA_TABLE_ARIA_LABELS: DataTableAriaLabels = {
  search: 'Search',
  clearSearch: 'Clear search',
  loadingData: 'Loading data',
  refreshingData: 'Refreshing data',
};

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
  /** Minimum column width in pixels. Defaults to 120. */
  minWidth?: number;
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
  /** Whether the table can be expanded to show all rows inline. */
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
  /** Whether more data is being loaded (infinite scroll). */
  isLoadingMore?: boolean;
  /** Callback fired when scrolling past 80% of the list (infinite scroll). Requires virtualization. */
  onLoadMore?: (scrollProgress: number) => void;
  /** Message to display on error. */
  errorMessage: string;
  /** Message to display when no data. */
  noDataMessage: string;
  /** Text for the "see more" expand button. */
  seeMoreText: string;
  /** Text for the collapse button when expanded. Defaults to seeMoreText. */
  collapseText?: string;
  /** Text for the filter button. */
  filterButtonText?: string;
  /** Text label for elements per page control. */
  elementsPerPageText: string;
  /** Function to format selected elements text. */
  selectedElementsText: (count: number, total: number) => string;
  /** Whether to show the footer. @default true */
  footer?: boolean;
  /** i18n labels for visible text in the DataTable UI. */
  labels?: Partial<DataTableLabels>;
  /** i18n aria-labels for the DataTable UI. */
  ariaLabels?: Partial<DataTableAriaLabels>;

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
  /** Unique key for persisting table state to session storage. Requires DataTableProvider. */
  storageKey?: string;
}

/**
 * DataTable component for displaying tabular data with virtualization,
 * pagination, sorting, filtering, and row selection.
 */
export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
): JSX.Element {
  const l = createMemo(() => ({ ...DEFAULT_DATA_TABLE_LABELS, ...props.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_DATA_TABLE_ARIA_LABELS,
    ...props.ariaLabels,
  }));

  // State persistence (storageKey is a static identifier, won't change)
  const storageKey = untrack(() => props.storageKey);
  const { restoredState, isRestored, saveState } = useDataTableState(storageKey);

  const [searchKey, setSearchKey] = createSignal('');
  const [selectedRows, setSelectedRows] = createSignal<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = createSignal(1);
  const [perPage, setPerPage] = createSignal(10);
  const [columns, setColumns] = createSignal<DataTableColumnProps<T>[]>([]);
  const [tableRef, setTableRef] = createSignal<HTMLDivElement | undefined>();
  const [tableWidth, setTableWidth] = createSignal(0);
  const [searchRef, setSearchRef] = createSignal<HTMLInputElement | undefined>();
  const [virtualContainerRef, setVirtualContainerRef] = createSignal<
    HTMLElement | undefined
  >();
  const [expanded, setExpanded] = createSignal(false);
  const [rowGridStyle, setRowGridStyle] = createSignal('');
  const [headerRef, setHeaderRef] = createSignal<HTMLDivElement | undefined>();
  const [rowWidth, setRowWidth] = createSignal(0);
  // Compute a fixed rootHeight for virtualization when expanded
  const expandedHeight = createMemo(() => {
    const rh = props.rowHeight ?? props.estimatedRowHeight ?? 0;
    if (rh === 0) return 400; // fallback
    // Show ~10 rows worth of height, capped at 70vh equivalent (~600px)
    return Math.min(rh * 10, 600);
  });

  const useVirtualization = createMemo(
    () => expanded() && (!!props.rowHeight || !!props.estimatedRowHeight),
  );

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

  // Restore state from session storage
  createEffect(() => {
    if (!isRestored()) return;
    const state = restoredState();
    if (!state) return;

    if (state.searchKey !== undefined) setSearchKey(state.searchKey);
    if (state.expanded !== undefined) setExpanded(state.expanded);
    if (state.currentPage !== undefined) setCurrentPage(state.currentPage);
    if (state.perPage !== undefined) setPerPage(state.perPage);
    if (state.selectedColumns !== undefined) {
      setColumns(props.columns.filter((c) => state.selectedColumns!.includes(c.key)));
    }
  });

  // Save state changes to session storage (debounced for scroll)
  createEffect(() => {
    if (!isRestored()) return;
    saveState({
      searchKey: searchKey(),
      expanded: expanded(),
      currentPage: currentPage(),
      perPage: perPage(),
      selectedColumns: columns().map((c) => c.key),
    });
  });

  // Base data after filter system is applied
  const baseData = createMemo(() => {
    const hook = filterHook();
    if (hook) return hook.filteredData();
    return props.data;
  });

  const allSelected = createMemo(() => {
    const len = baseData().length;
    if (len === 0) return false;
    return selectedRows().size === len;
  });

  createEffect(() => {
    // Track props.columns and props.defaultColumns as dependencies
    const propsColumns = props.columns;
    const defaultCols = props.defaultColumns;
    // Read current columns without creating a dependency to avoid infinite loop
    const currentKeys = untrack(() => columns().map((c) => c.key));
    if (currentKeys.length === 0) {
      setColumns(
        defaultCols
          ? propsColumns.filter((c) => defaultCols.includes(c.key))
          : propsColumns,
      );
    } else {
      const updated = propsColumns.filter((c) => currentKeys.includes(c.key));
      setColumns(updated.length > 0 ? updated : propsColumns);
    }
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
    if (expanded()) return filtered;
    if (props.expandable && baseData().length > defaultRowsCount())
      return filtered.slice(0, defaultRowsCount());
    return filtered;
  });

  const sharedPercentage = () => {
    if (columns().length === 0) return 0;
    const allColumnsPercentage = props.columns.reduce((acc, v) => acc + v.width, 0);
    const displayedColumnsPercentage = columns().reduce((acc, v) => acc + v.width, 0);
    return (allColumnsPercentage - displayedColumnsPercentage) / columns().length;
  };

  createEffect(() => {
    if (tableWidth() === 0) return;

    setRowGridStyle(
      `${props.rowSelection ? '40px ' : ''}${columns()
        .map((col, i) => {
          const scope = tableRef();
          const minWidth = scope
            ? Math.max(
                ...Array.from(scope.querySelectorAll(`[data-column="${col.key}"]`)).map(
                  (e) => (e as HTMLElement).offsetWidth,
                ),
              )
            : 0;
          return `minmax(${Math.max(0, minWidth + 48)}px, ${Math.max(0, (tableWidth() * (col.width + sharedPercentage())) / 100 - (i === 0 ? (props.rowSelection ? 40 : 0) : 0))}px)`;
        })
        .join(' ')}`,
    );
  });

  createEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    let rafId: number | undefined;
    if (tableRef()) {
      resizeObserver = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setTableWidth(tableRef()!.offsetWidth);
        });
      });
      resizeObserver.observe(tableRef()!);
    }
    onCleanup(() => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    });
  });

  // Track header row width for body container
  createEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    let rafId: number | undefined;
    if (headerRef()) {
      resizeObserver = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setRowWidth(headerRef()!.offsetWidth);
        });
      });
      resizeObserver.observe(headerRef()!);
    }
    onCleanup(() => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    });
  });

  // Save and restore scroll position for virtualized lists
  createEffect(() => {
    const el = virtualContainerRef();
    if (!el || !isRestored()) return;

    // Restore scroll position
    const state = restoredState();
    if (state?.scrollTop !== undefined) {
      el.scrollTop = state.scrollTop;
    }

    // Save scroll position on scroll (debounced)
    let scrollSaveTimeout: ReturnType<typeof setTimeout> | undefined;
    const handleScrollSave = () => {
      if (scrollSaveTimeout) clearTimeout(scrollSaveTimeout);
      scrollSaveTimeout = setTimeout(() => {
        saveState({ scrollTop: el.scrollTop });
      }, 200);
    };

    el.addEventListener('scroll', handleScrollSave, { passive: true });
    onCleanup(() => {
      if (scrollSaveTimeout) clearTimeout(scrollSaveTimeout);
      el.removeEventListener('scroll', handleScrollSave);
    });
  });

  // Infinite scroll for virtualized lists
  createEffect(() => {
    if (!useVirtualization() || !props.onLoadMore) return;

    const el = virtualContainerRef();
    if (!el) return;

    let lastScrollTop = el.scrollTop;
    let ticking = false;

    const getScrollProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const scrollable = scrollHeight - clientHeight;
      if (scrollable <= 0) return 100;
      return Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
    };

    const handleInfiniteScroll = () => {
      const current = el.scrollTop;
      const isScrollingDown = current > lastScrollTop;
      lastScrollTop = current <= 0 ? 0 : current;

      if (!isScrollingDown || ticking) return;

      const progress = getScrollProgress();
      if (progress < 80) return;

      ticking = true;
      requestAnimationFrame(() => {
        if (!props.isLoadingMore) {
          props.onLoadMore?.(progress);
        }
        ticking = false;
      });
    };

    el.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    onCleanup(() => el.removeEventListener('scroll', handleInfiniteScroll));
  });

  const baseRowClass = createMemo(() =>
    twMerge(
      'grid w-fit bg-white hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/50',
      'border-b border-gray-200 last:border-b-0 dark:border-neutral-800',
    ),
  );

  const List = (row: T, index: Accessor<number>) => (
    <div
      role="row"
      class={
        selectedRows().has(index())
          ? `${baseRowClass()} bg-neutral-100 dark:bg-neutral-800`
          : baseRowClass()
      }
      style={{
        'grid-template-columns': rowGridStyle(),
      }}
    >
      <Show when={props.rowSelection}>
        <div role="cell" class="flex items-center py-3 pl-6">
          <Checkbox
            checked={selectedRows().has(index())}
            onChange={() => toggleSelectRow(index())}
            aria-label={`Select row ${index() + 1}`}
          />
        </div>
      </Show>

      <For each={columns()}>
        {(column) => (
          <div
            role="cell"
            class="flex shrink-0 items-center px-6 py-4 text-gray-900 dark:text-white"
          >
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

  const LoadingMoreSpinner = () => (
    <Show when={props.isLoadingMore}>
      <div class="flex items-center justify-center py-3">
        <Spinner color="gray" size="sm" />
      </div>
    </Show>
  );

  const VirtualizedList = () => (
    <Dynamic
      component={props.rowHeight ? VirtualList : DynamicVirtualList}
      items={() => filteredData() as unknown as readonly unknown[]}
      rootHeight={expandedHeight()}
      rowHeight={props.rowHeight ? props.rowHeight + 1 : undefined!} // +1 because of rowClass border-b
      estimatedRowHeight={
        props.estimatedRowHeight ? props.estimatedRowHeight + 1 : undefined!
      }
      containerWidth="100%"
      containerPadding={0}
      fallback={<NoItemsComponent />}
      setContainerRef={setVirtualContainerRef}
      loading={<LoadingMoreSpinner />}
      rowClass="border-b border-gray-200 last:border-b-0 dark:border-neutral-800"
    >
      {(item: unknown, index: Accessor<number>) => List(item as T, index)}
    </Dynamic>
  );

  const hasToolbar = createMemo(
    () =>
      !!filterHook() || !!(props.filters && !filterHook()) || !!props.configureColumns,
  );

  return (
    <div class="w-full min-w-0">
      <div
        ref={setTableRef}
        role="table"
        class="flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Search Section */}
        <Show when={props.searchBar}>
          <div class="flex w-full shrink-0 border-b border-gray-200 px-6 dark:border-neutral-800">
            <div class="relative flex w-full max-w-md items-center">
              <SearchRefractionIcon class="size-5 text-gray-400 dark:text-neutral-500" />
              <input
                ref={setSearchRef}
                value={searchKey()}
                onInput={(e) => setSearchKey(e.target.value)}
                placeholder={l().searchPlaceholder}
                aria-label={a().search}
                onFocus={(e) => e.target.select()}
                class="w-full bg-transparent py-3 pl-2 text-sm outline-none dark:text-white"
              />
              <Show when={searchKey()}>
                <button
                  type="button"
                  aria-label={a().clearSearch}
                  onClick={() => {
                    setSearchKey('');
                    searchRef()?.focus();
                  }}
                  class="absolute right-0 top-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  <XCloseIcon class="size-4" aria-hidden="true" />
                </button>
              </Show>
            </div>
          </div>
        </Show>

        {/* Toolbar: Filters + Chips + Columns + Expand */}
        <Show when={hasToolbar()}>
          <div
            class={twMerge(
              'flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-6 py-2 dark:border-neutral-800',
              !props.searchBar ? 'rounded-t-lg' : '',
            )}
          >
            {/* Left: Filters */}
            <div class="flex min-w-0 flex-1 items-center gap-2">
              {/* Filter System (when filterConfigs is provided) */}
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
                    showChips
                  />
                )}
              </Show>

              {/* Custom Filters (legacy, when filters JSX is provided) */}
              <Show when={props.filters && !filterHook()}>
                <div class="flex items-center py-1">
                  <FilterFunnel01Icon class="mr-2 size-5" />
                  <p>{props.filterButtonText || l().filter}</p>
                  <span class="ml-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 p-2.5 text-xs font-medium text-white dark:bg-neutral-200 dark:text-neutral-900">
                    {props.activeFilterCount ?? 0}
                  </span>
                </div>
              </Show>
            </div>

            {/* Right: Columns + Expand */}
            <div class="flex shrink-0 items-center gap-2">
              {/* Column Configuration */}
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
                  displayValue={l().columns}
                  icon={() => <Columns03Icon class="size-5" />}
                  fitContent={true}
                />
              </Show>
            </div>
          </div>
        </Show>

        {/* Selected Items Section */}
        <Show when={props.rowSelection && selectedRows().size > 0}>
          <div
            class={twMerge(
              'flex shrink-0 items-center border-b border-gray-200 px-6 py-3 dark:border-neutral-800',
              !props.searchBar && !props.filters ? 'rounded-t-lg' : '',
            )}
          >
            <div class="flex items-center gap-3">
              <Button size="xs" color="light" aria-label="Bulk actions">
                ···
              </Button>
              <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">
                {props.selectedElementsText(selectedRows().size, baseData().length)}
              </span>
            </div>
          </div>
        </Show>

        {/* Scrollable data area (header + body) */}
        <div class="flex min-w-0 flex-col overflow-x-auto">
          {/* Table Header */}
          <div
            ref={setHeaderRef}
            role="row"
            class={twMerge(
              'grid w-fit border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400',
              !props.searchBar &&
                !props.filters &&
                !hasToolbar() &&
                !(props.rowSelection && selectedRows().size > 0)
                ? 'rounded-t-lg'
                : '',
            )}
            style={{
              'grid-template-columns': rowGridStyle(),
            }}
          >
            <Show when={props.rowSelection}>
              <div role="columnheader" class="flex items-center py-3 pl-6">
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
                  role="columnheader"
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
                      <InfoCircleIcon aria-hidden="true" />
                    </Tooltip>
                  </Show>
                </div>
              )}
            </For>
          </div>

          {/* Table Body */}
          <div
            role="rowgroup"
            aria-busy={props.loading || props.validating}
            class="relative flex flex-col"
            style={{ width: `${rowWidth()}px` }}
          >
            <Show
              when={!props.loading && !props.error}
              fallback={
                <div>
                  <Show when={props.loading}>
                    <div
                      role="status"
                      aria-live="polite"
                      aria-label={a().loadingData}
                      class={twMerge('grid bg-white dark:bg-neutral-900')}
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
                  aria-label={a().refreshingData}
                  class="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white/60 dark:bg-neutral-900/60"
                >
                  <Spinner />
                </div>
              </Show>
              {/* Virtualized rendering when expanded */}
              <Show when={useVirtualization()}>
                <VirtualizedList />
              </Show>
              {/* Plain rendering when not virtualized */}
              <Show when={!useVirtualization()}>
                {/* <div> */}
                <For each={filteredData()} fallback={<NoItemsComponent />}>
                  {List}
                </For>
                {/* </div> */}
              </Show>
            </Show>
          </div>
        </div>

        {/* See more / Collapse trigger */}
        <Show when={props.expandable && baseData().length > defaultRowsCount()}>
          <button
            type="button"
            aria-expanded={expanded()}
            onClick={() => setExpanded((v) => !v)}
            class="group flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-gray-200 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
          >
            <Show
              when={expanded()}
              fallback={
                <>
                  <span>{props.seeMoreText}</span>
                  <Expand01Icon
                    class="size-3 transition-all group-hover:size-4"
                    aria-hidden="true"
                  />
                </>
              }
            >
              <span>{props.collapseText ?? props.seeMoreText}</span>
              <Minimize01Icon
                class="size-3 transition-all group-hover:size-4"
                aria-hidden="true"
              />
            </Show>
          </button>
        </Show>

        {/* Table Footer */}
        <Show when={props.footer ?? true}>
          <div class="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-5 sm:flex-row dark:border-neutral-800">
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
                    aria-label={props.elementsPerPageText}
                  />
                  <span class="whitespace-nowrap text-sm text-gray-700 dark:text-neutral-300">
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
    </div>
  );
}
