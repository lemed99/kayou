import {
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
  untrack,
} from 'solid-js';

import { Expand01Icon, Minimize01Icon } from '@kayou/icons';

import { DataTableBody } from './DataTableBody';
import { useDataTableState } from './DataTableContext';
import { DataTableFooter } from './DataTableFooter';
import { DataTableHeader } from './DataTableHeader';
import { DataTableInternalContext } from './DataTableInternalContext';
import { DataTableSearch } from './DataTableSearch';
import { DataTableToolbar } from './DataTableToolbar';
import { FilterConfig, FilterState, SortAction, SortEntry } from './types';
import { useDataTableConfigs } from './useDataTableConfigs';
import { useDataTableFilters } from './useDataTableFilters';

export interface DataTableLabels {
  searchPlaceholder: string;
  filter: string;
  addFilter: string;
  resetFilter: string;
  applyFilter: string;
  noFilters: string;
  columns: string;
  sortAscending: string;
  sortDescending: string;
  clearSort: string;
  sortPriority: string;
  error: string;
  noData: string;
  seeMore: string;
  collapse: string;
  elementsPerPage: string;
  selectedElements: (count: number, total: number) => string;
  saveConfiguration: string;
  configurations: string;
  defaultConfiguration: string;
  saveConfigTitle: string;
  editConfigTitle: string;
  configNameLabel: string;
  configNamePlaceholder: string;
  save: string;
  deleteConfiguration: string;
  confirmDelete: string;
  cancel: string;
  maxConfigsReached: string;
  createNewConfiguration: string;
  createNewConfigurationDescription: string;
  updateCurrentConfiguration: string;
  updateCurrentConfigurationDescription: string;
  back: string;
  expandRow: string;
  collapseRow: string;
  lockColumn: string;
  unlockColumn: string;
  resizeColumn: string;
  resetColumnSize: string;
  lockRow: string;
  unlockRow: string;
}

export const DEFAULT_DATA_TABLE_LABELS: DataTableLabels = {
  searchPlaceholder: 'Search...',
  filter: 'Filter',
  addFilter: 'Add filter',
  resetFilter: 'Reset',
  applyFilter: 'Apply',
  noFilters: 'No filters are being applied.',
  columns: 'Columns',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  clearSort: 'Clear sort',
  sortPriority: 'Sort priority',
  error: 'An error occurred',
  noData: 'No data available',
  seeMore: 'See more',
  collapse: 'See less',
  elementsPerPage: 'per page',
  selectedElements: (count, total) => `${count} of ${total} selected`,
  saveConfiguration: 'Save configuration',
  configurations: 'Configurations',
  defaultConfiguration: 'Default',
  saveConfigTitle: 'Save configuration',
  editConfigTitle: 'Edit configuration',
  configNameLabel: 'Configuration name',
  configNamePlaceholder: 'Enter a name...',
  save: 'Save',
  deleteConfiguration: 'Delete',
  confirmDelete: 'Confirm deletion?',
  cancel: 'Cancel',
  maxConfigsReached: 'Maximum of 3 configurations reached',
  createNewConfiguration: 'Create new configuration',
  createNewConfigurationDescription: 'Save current settings as a new configuration',
  updateCurrentConfiguration: 'Update current configuration',
  updateCurrentConfigurationDescription:
    'Overwrite the active configuration with current settings',
  back: 'Back',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  lockColumn: 'Lock column',
  unlockColumn: 'Unlock column',
  resizeColumn: 'Resize column',
  resetColumnSize: 'Double-click to reset',
  lockRow: 'Lock row',
  unlockRow: 'Unlock row',
};

export interface DataTableAriaLabels {
  table: string;
  search: string;
  clearSearch: string;
  loadingData: string;
  refreshingData: string;
  selectAllRows: string;
  expand: string;
}

export const DEFAULT_DATA_TABLE_ARIA_LABELS: DataTableAriaLabels = {
  table: 'Data table',
  search: 'Search',
  clearSearch: 'Clear search',
  loadingData: 'Loading data',
  refreshingData: 'Refreshing data',
  selectAllRows: 'Select all rows',
  expand: 'Expand',
};

export interface DataTableColumnProps<T> {
  /** Column header label. */
  label: string;
  /** Key to access the column data from row objects. */
  key: string;
  /** Custom render function for cell content. */
  render?: (value?: unknown, record?: T, index?: number) => JSX.Element;
  /** Column width as percentage of table width. */
  width: number;
  /** Minimum column width in pixels. */
  minWidth?: number;
  /** Tooltip text for the column header. */
  tooltip?: string;
}

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
  error?: unknown;
  /** Callback fired when page changes. */
  onPageChange?: (page: number) => void;
  /** Callback fired when search value changes (debounced by searchDebounceMs). */
  onSearchChange?: (search: string) => void;
  /** Callback fired when per-page value changes. */
  onPerPageChange?: (perPage: number) => void;
  /** Callback fired when row selection changes. Emits selected row keys. */
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  /** Whether to show the search bar. */
  searchBar?: boolean;
  /** Whether to allow column configuration. */
  configureColumns?: boolean;
  /** Whether the table can be expanded to show all rows inline. */
  expandable?: boolean;
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
  /** Whether to show the footer. @default true */
  footer?: boolean;
  /** i18n labels for visible text in the DataTable UI. */
  labels?: Partial<DataTableLabels>;
  /** i18n aria-labels for the DataTable UI. */
  ariaLabels?: Partial<DataTableAriaLabels>;

  // Filter system props
  /** Filter configurations for automatic filter UI generation. */
  filterConfigs?: FilterConfig<T>[];
  /** Controlled filter state. */
  filterState?: FilterState;
  /** Callback fired when filters change. */
  onFiltersChange?: (filters: FilterState) => void;

  // Row identity
  /** Key or accessor to uniquely identify rows. Required when rowSelection is true. */
  rowKey?: string | ((row: T) => string);

  // Sorting
  /** Sort state (controlled). Each entry has a key and direction. */
  sorts?: SortEntry[];
  /** Callback when sort changes. Click to single-sort, Shift+click to add columns. */
  onSortsChange?: (sorts: SortEntry[]) => void;
  /** Which columns can be sorted. Defaults to all if onSortsChange is provided. */
  sortableColumns?: string[];

  // Search debounce
  /** Debounce delay for onSearchChange in ms. @default 300 */
  searchDebounceMs?: number;

  // Bulk actions
  /** Render prop for bulk action buttons shown when rows are selected. */
  bulkActions?: (selectedKeys: Set<string>, clearSelection: () => void) => JSX.Element;

  // Row interaction
  /** Callback fired when a data row is clicked (not checkboxes or expand buttons). */
  onRowClick?: (row: T, index: number) => void;
  /** Custom JSX to show when data is empty. Falls back to labels().noData text. */
  emptyState?: JSX.Element;
  /** Additional CSS class(es) for data rows. Can be a static string or a function per row. */
  rowClass?: string | ((row: T, index: number) => string);

  // Layout
  /** Allow users to lock a column so it stays visible during horizontal scroll. Only one column at a time. */
  columnLocking?: boolean;
  /** Enable column resizing by dragging header borders. */
  columnResizing?: boolean;
  /** Allow users to lock a single row so it pins to the viewport edge when scrolled past. Only works with virtualization. */
  rowLocking?: boolean;

  // Row expansion (per-row detail panels)
  /** Render prop for row detail panels. Shows an expand/collapse button per row. */
  expandRow?: (row: T) => JSX.Element;

  // Right-click context menu
  /** Render prop for a right-click context menu on rows. */
  rowContextMenu?: (row: T, index: number, closeMenu: () => void) => JSX.Element;
}

export function DataTable<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
): JSX.Element {
  const l = createMemo(() => ({ ...DEFAULT_DATA_TABLE_LABELS, ...props.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_DATA_TABLE_ARIA_LABELS,
    ...props.ariaLabels,
  }));

  const tableId = createUniqueId();
  const {
    restoredState,
    isRestored,
    saveState,
    perPageOptions,
    configEnabled,
    readConfigs,
    writeConfigs,
  } = useDataTableState(tableId);

  // --- Signals ---
  const [searchKey, setSearchKey] = createSignal('');
  const [selectedRows, setSelectedRows] = createSignal<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = createSignal(1);
  const [perPage, setPerPage] = createSignal(perPageOptions[0] ?? 10);
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
  const [resizedWidths, setResizedWidths] = createSignal<Map<string, number>>(new Map());
  const [expandedRows, setExpandedRows] = createSignal<Set<string>>(new Set());
  const [focusedRowIndex, setFocusedRowIndex] = createSignal(-1);
  const [lockedRowKey, setLockedRowKey] = createSignal<string | null>(null);
  const toggleLockedRow = (key: string) => {
    setLockedRowKey((prev) => (prev === key ? null : key));
  };
  const [contextMenuState, setContextMenuState] = createSignal<{
    x: number;
    y: number;
    rowKey: string;
    row: T;
    index: number;
  } | null>(null);

  // --- Row expansion ---
  const toggleRowExpansion = (key: string) => {
    const newSet = new Set(expandedRows());
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedRows(newSet);
  };

  // --- Context menu ---
  const openContextMenu = (e: MouseEvent, row: T, index: number) => {
    e.preventDefault();
    setContextMenuState({
      x: e.clientX,
      y: e.clientY,
      rowKey: getRowKey(row, index),
      row,
      index,
    });
  };
  const closeContextMenu = () => setContextMenuState(null);

  // --- Row identity ---
  const getRowKey = (row: T, index: number): string => {
    if (!props.rowKey) return String(index);
    if (typeof props.rowKey === 'function') return props.rowKey(row);
    return String(row[props.rowKey as keyof T]);
  };

  // --- Sorting ---
  const sortableColumnsSet = createMemo(() => {
    if (props.sortableColumns) return new Set(props.sortableColumns);
    if (props.onSortsChange) return new Set(props.columns.map((c) => c.key));
    return new Set<string>();
  });

  const sorts = createMemo<SortEntry[]>(() => props.sorts ?? []);

  const handleSortSelect = (key: string, direction: SortAction) => {
    if (!props.onSortsChange) return;
    const current = sorts();
    const idx = current.findIndex((s) => s.key === key);

    if (direction === '') {
      // Reset: remove this key from sorts
      if (idx !== -1) {
        props.onSortsChange(current.filter((_, i) => i !== idx));
      }
    } else if (idx === -1) {
      // Not sorted yet: add with chosen direction
      props.onSortsChange([...current, { key, direction }]);
    } else {
      // Already sorted: update direction
      const updated = [...current];
      updated[idx] = { key, direction };
      props.onSortsChange(updated);
    }
  };

  // --- Virtualization ---
  const expandedHeight = createMemo(() => {
    const rh = props.rowHeight ?? props.estimatedRowHeight ?? 0;
    if (rh === 0) return 400;
    return Math.min(rh * 10, 600);
  });

  const useVirtualization = createMemo(
    () => expanded() && (!!props.rowHeight || !!props.estimatedRowHeight),
  );

  // --- Filter system ---
  const filterHook = useDataTableFilters<T>({
    filterConfigs: () => props.filterConfigs ?? [],
    filters: () => props.filterState,
    onFiltersChange: (filters) => props.onFiltersChange?.(filters),
  });
  const hasFilters = createMemo(() => (props.filterConfigs?.length ?? 0) > 0);

  // --- Saved configurations ---
  const defaultColumnKeys = createMemo(
    () => props.defaultColumns ?? props.columns.map((c) => c.key),
  );

  const configHook = configEnabled
    ? useDataTableConfigs({
        readConfigs,
        writeConfigs,
        currentColumns: () => columns().map((c) => c.key),
        currentSorts: sorts,
        currentFilters: filterHook.activeFilters,
        currentPerPage: perPage,
        defaultColumns: defaultColumnKeys,
        defaultPerPage: perPageOptions[0] ?? 10,
      })
    : null;

  const handleActivateConfig = (id: string | null) => {
    if (!configHook) return;
    configHook.activateConfig(id);
    if (id === null) {
      setColumns(props.columns.filter((c) => defaultColumnKeys().includes(c.key)));
      handlePerPageChange(perPageOptions[0] ?? 10);
      props.onSortsChange?.([]);
      filterHook.replaceAllFilters(new Map());
    } else {
      const config = configHook.getConfig(id);
      if (!config) return;
      setColumns(props.columns.filter((c) => config.columns.includes(c.key)));
      handlePerPageChange(config.perPage);
      props.onSortsChange?.(config.sorts);
      filterHook.replaceAllFilters(new Map(config.filters));
    }
    handlePageChange(1);
  };

  // --- State restoration ---
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

  // --- State persistence (debounced to avoid excessive sessionStorage writes) ---
  let statePersistTimer: ReturnType<typeof setTimeout> | undefined;
  createEffect(() => {
    if (!isRestored()) return;
    const state = {
      searchKey: searchKey(),
      expanded: expanded(),
      currentPage: currentPage(),
      perPage: perPage(),
      selectedColumns: columns().map((c) => c.key),
    };
    if (statePersistTimer) clearTimeout(statePersistTimer);
    statePersistTimer = setTimeout(() => saveState(state), 200);
  });
  onCleanup(() => {
    if (statePersistTimer) clearTimeout(statePersistTimer);
  });

  // --- Data ---
  const baseData = () => props.data;
  const defaultRowsCount = createMemo(() => props.defaultRowsCount ?? 5);

  const visibleData = createMemo(() => {
    const filtered = baseData();
    if (expanded()) return filtered;
    if (props.expandable && baseData().length > defaultRowsCount())
      return filtered.slice(0, defaultRowsCount());
    return filtered;
  });

  // --- Selection: prune stale keys when data changes ---
  // Uses untrack on selectedRows so the effect only re-runs when data or rowKey
  // changes — not when the selection it just wrote triggers a new cycle.
  createEffect(() => {
    const data = baseData();
    const rk = props.rowKey; // track rowKey changes
    if (!rk) {
      // Index-based mode: clear on data change
      setSelectedRows(new Set<string>());
      return;
    }
    // Key-based mode: prune stale keys
    const validKeys = new Set(data.map((row, idx) => getRowKey(row, idx)));
    const current = untrack(selectedRows);
    const pruned = new Set([...current].filter((k) => validKeys.has(k)));
    if (pruned.size !== current.size) {
      setSelectedRows(pruned);
      props.onSelectionChange?.(pruned);
    }
  });

  const allSelected = createMemo(() => {
    const len = baseData().length;
    if (len === 0) return false;
    return selectedRows().size === len;
  });

  const updateSelection = (newSet: Set<string>) => {
    setSelectedRows(newSet);
    props.onSelectionChange?.(newSet);
  };

  const toggleSelectAll = () => {
    if (allSelected()) {
      updateSelection(new Set<string>());
    } else {
      updateSelection(new Set(baseData().map((row, idx) => getRowKey(row, idx))));
    }
  };

  const toggleSelectRow = (key: string) => {
    const newSelected = new Set(selectedRows());
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    updateSelection(newSelected);
  };

  // --- Columns ---
  createEffect(() => {
    const propsColumns = props.columns;
    const defaultCols = props.defaultColumns;
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

  // --- Grid layout ---
  const sharedPercentage = () => {
    if (columns().length === 0) return 0;
    const allColumnsPercentage = props.columns.reduce((acc, v) => acc + v.width, 0);
    const displayedColumnsPercentage = columns().reduce((acc, v) => acc + v.width, 0);
    return (allColumnsPercentage - displayedColumnsPercentage) / columns().length;
  };

  // Cached per-column min-widths from DOM measurement.
  // Only re-measured when columns or data change, NOT on every resize.
  const [measuredMinWidths, setMeasuredMinWidths] = createSignal<Map<string, number>>(
    new Map(),
  );

  // Expensive: reads DOM to measure content widths per column
  createEffect(() => {
    // Track reactive deps that affect content widths
    const cols = columns();
    visibleData(); // track data changes
    const scope = tableRef();
    const header = headerRef();
    const hasLocking = props.columnLocking ?? false;

    if (!scope || cols.length === 0) return;

    // Double rAF ensures layout has settled before DOM measurement
    let innerRafId: number | undefined;
    const outerRafId = requestAnimationFrame(() => {
      innerRafId = requestAnimationFrame(() => {
        const widths = new Map<string, number>();
        for (const col of cols) {
          const bodyCells = Array.from(
            scope.querySelectorAll(`[data-column="${col.key}"]`),
          ).map((e) => (e as HTMLElement).offsetWidth);

          const headerCell = header?.querySelector<HTMLElement>(
            `[data-column-key="${col.key}"]>div`,
          );
          const headerMeasured = headerCell ? headerCell.offsetWidth : 0;
          const bodyMeasured = bodyCells.length > 0 ? Math.max(...bodyCells) + 48 : 0;

          let controlsWidth = 0;
          if (hasLocking) controlsWidth += 20;

          widths.set(
            col.key,
            Math.max(
              bodyMeasured,
              headerMeasured + controlsWidth + 48,
              col.minWidth ?? 0,
            ),
          );
        }
        setMeasuredMinWidths(widths);
      });
    });
    onCleanup(() => {
      cancelAnimationFrame(outerRafId);
      if (innerRafId !== undefined) cancelAnimationFrame(innerRafId);
    });
  });

  // Cheap: pure math to compute the grid template string from cached measurements
  createEffect(() => {
    const tw = tableWidth();
    if (tw === 0) return;

    const cols = columns();
    const rs = props.rowSelection;
    const sp = sharedPercentage();
    const hasExpandColumn = !!props.expandRow && !!props.onRowClick;
    const rw = resizedWidths();
    const cached = measuredMinWidths();

    const prefix = `${rs ? '40px ' : ''}${hasExpandColumn ? '36px ' : ''}`;
    setRowGridStyle(
      `${prefix}${cols
        .map((col, i) => {
          const resized = rw.get(col.key);
          if (resized !== undefined) return `${resized}px`;
          const minWidth = cached.get(col.key) ?? col.minWidth ?? 0;
          return `minmax(${minWidth}px, ${Math.max(0, (tw * (col.width + sp)) / 100 - (i === 0 ? (rs ? 40 : 0) : 0))}px)`;
        })
        .join(' ')}`,
    );
  });

  // --- Resize observers ---
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

  // --- Column locking (sticky) ---
  const [stickyColumnKey, setStickyColumnKey] = createSignal<string | null>(null);
  const toggleStickyColumn = (key: string) => {
    setStickyColumnKey((prev) => (prev === key ? null : key));
  };

  // Horizontal scroll tracking — computes a transform offset for the sticky column
  // so it pins to the left or right edge when it would scroll out of view.
  // Uses `offsetLeft`/`offsetWidth` (unaffected by CSS transforms) for measurement.
  const [scrollContainerRef, setScrollContainerRef] = createSignal<
    HTMLDivElement | undefined
  >();

  let _stickyCell: HTMLElement | null = null;

  const computeStickyOffset = () => {
    const el = scrollContainerRef();
    if (!el) return;

    const stickyKey = stickyColumnKey();
    if (!stickyKey) {
      el.style.setProperty('--dt-sticky-offset', '0px');
      return;
    }

    const row = headerRef();
    if (!row) return;

    if (!_stickyCell) {
      _stickyCell = row.querySelector<HTMLElement>(`[data-column-key="${stickyKey}"]`);
    }
    const cell = _stickyCell;
    if (!cell) return;

    const scrollLeft = el.scrollLeft;
    const viewportWidth = el.clientWidth;
    const columnLeft = cell.offsetLeft;
    const columnWidth = cell.offsetWidth;

    let offset = 0;
    if (columnLeft < scrollLeft) {
      // Column left edge scrolled past the table left edge → pin to left
      offset = scrollLeft - columnLeft;
    } else if (columnLeft + columnWidth > scrollLeft + viewportWidth) {
      // Column right edge scrolled past the table right edge → pin to right
      offset = scrollLeft + viewportWidth - (columnLeft + columnWidth);
    }

    el.style.setProperty('--dt-sticky-offset', `${offset}px`);
  };

  createEffect(() => {
    const el = scrollContainerRef();
    if (!el || !props.columnLocking) return;

    el.addEventListener('scroll', computeStickyOffset, { passive: true });
    onCleanup(() => el.removeEventListener('scroll', computeStickyOffset));
  });

  // Recompute when sticky column or columns change
  createEffect(() => {
    stickyColumnKey(); // track
    columns(); // track — column reorder/change invalidates cached DOM ref
    _stickyCell = null; // invalidate cached cell reference
    computeStickyOffset();
  });

  // --- Scroll position persistence ---
  createEffect(() => {
    const el = virtualContainerRef();
    if (!el || !isRestored()) return;

    const state = restoredState();
    if (state?.scrollTop !== undefined) {
      el.scrollTop = state.scrollTop;
    }

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

  // --- Infinite scroll ---
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

  // --- Row locking: positioning context for overlay ---
  createEffect(() => {
    const el = virtualContainerRef();
    if (!el || !props.rowLocking) return;
    el.style.position = 'relative';
  });

  // --- Handlers ---
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    props.onPageChange?.(page);
  };

  let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;
  const handleSearchChange = (value: string) => {
    setSearchKey(value);
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    const delay = props.searchDebounceMs ?? 300;
    if (delay === 0) {
      props.onSearchChange?.(value);
    } else {
      searchDebounceTimer = setTimeout(() => {
        props.onSearchChange?.(value);
      }, delay);
    }
  };
  onCleanup(() => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  });

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    handlePageChange(1);
    props.onPerPageChange?.(value);
  };

  // --- Render ---
  return (
    <div class="w-full min-w-0">
      <div
        ref={setTableRef}
        role="table"
        aria-label={a().table}
        class="flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      >
        <DataTableInternalContext.Provider
          value={{
            columns,
            get allColumns() {
              return props.columns;
            },
            setColumns,
            visibleData,
            baseData,
            rowGridStyle,
            rowWidth,
            setHeaderRef,
            get rowSelection() {
              return props.rowSelection ?? false;
            },
            selectedRows,
            allSelected,
            toggleSelectAll,
            toggleSelectRow,
            getRowKey,
            searchKey,
            handleSearchChange,
            searchRef,
            setSearchRef,
            currentPage,
            handlePageChange,
            perPage,
            handlePerPageChange,
            perPageOptions,
            expanded,
            toggleExpanded: () => setExpanded((v) => !v),
            sorts,
            onSortSelect: handleSortSelect,
            sortableColumns: sortableColumnsSet,
            useVirtualization,
            setVirtualContainerRef,
            expandedHeight,
            labels: l,
            ariaLabels: a,
            get loading() {
              return props.loading;
            },
            get validating() {
              return props.validating;
            },
            get error() {
              return props.error;
            },
            get rowHeight() {
              return props.rowHeight;
            },
            get estimatedRowHeight() {
              return props.estimatedRowHeight;
            },
            get isLoadingMore() {
              return props.isLoadingMore;
            },
            get pageTotal() {
              return props.pageTotal;
            },
            get perPageControl() {
              return props.perPageControl;
            },
            get footer() {
              return props.footer;
            },
            get searchBar() {
              return props.searchBar;
            },
            get configureColumns() {
              return props.configureColumns;
            },
            get onRowClick() {
              return props.onRowClick;
            },
            get emptyState() {
              return props.emptyState;
            },
            get rowClass() {
              return props.rowClass;
            },
            get columnLocking() {
              return props.columnLocking ?? false;
            },
            stickyColumnKey,
            toggleStickyColumn,
            get rowLocking() {
              return (props.rowLocking ?? false) && useVirtualization();
            },
            lockedRowKey,
            toggleLockedRow,
            virtualContainerRef,
            get columnResizing() {
              return props.columnResizing ?? false;
            },
            resizedWidths,
            onColumnResize: (key: string, width: number) => {
              setResizedWidths((prev) => {
                const m = new Map(prev);
                m.set(key, width);
                return m;
              });
            },
            resetColumnResize: (key: string) => {
              setResizedWidths((prev) => {
                const m = new Map(prev);
                m.delete(key);
                return m;
              });
            },
            get expandRow() {
              return props.expandRow;
            },
            expandedRows,
            toggleRowExpansion,
            focusedRowIndex,
            setFocusedRowIndex,
            get rowContextMenu() {
              return props.rowContextMenu;
            },
            contextMenuState,
            openContextMenu,
            closeContextMenu,
            get configEnabled() {
              return !!configHook;
            },
            configs: configHook?.configs ?? (() => []),
            activeConfigId: configHook?.activeConfigId ?? (() => null),
            isDirty: configHook?.isDirty ?? (() => false),
            isAtLimit: configHook?.isAtLimit ?? (() => false),
            hasConfigs: configHook?.hasConfigs ?? (() => false),
            onSaveConfig: configHook?.saveConfig ?? (() => false),
            onUpdateConfig: configHook?.updateConfig ?? (() => {}),
            onDeleteConfig: configHook?.deleteConfig ?? (() => {}),
            onActivateConfig: handleActivateConfig,
            getConfig: configHook?.getConfig ?? (() => undefined),
          }}
        >
          {/* Search */}
          <Show when={props.searchBar}>
            <DataTableSearch />
          </Show>

          {/* Toolbar */}
          <DataTableToolbar
            hasFilters={hasFilters}
            filterConfigs={props.filterConfigs}
            filterHook={filterHook}
          />

          {/* Bulk Actions Bar */}
          <Show when={props.rowSelection && selectedRows().size > 0}>
            <div class="flex shrink-0 items-center gap-3 border-b border-neutral-200 px-6 py-3 dark:border-neutral-800">
              <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {l().selectedElements(selectedRows().size, baseData().length)}
              </span>
              <Show when={props.bulkActions}>
                {(renderActions) => (
                  <div class="flex items-center gap-2">
                    {renderActions()(selectedRows(), () => updateSelection(new Set()))}
                  </div>
                )}
              </Show>
            </div>
          </Show>

          {/* Scrollable data area */}
          <div ref={setScrollContainerRef} class="flex min-w-0 flex-col overflow-x-auto">
            <DataTableHeader />
            <DataTableBody />
          </div>

          {/* See more / Collapse trigger */}
          <Show when={props.expandable && baseData().length > defaultRowsCount()}>
            <button
              type="button"
              aria-expanded={expanded()}
              aria-label={expanded() ? l().collapse : l().seeMore}
              onClick={() => setExpanded((v) => !v)}
              class="group flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-neutral-200 py-3 text-neutral-600 hover:bg-neutral-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
            >
              <Show
                when={expanded()}
                fallback={
                  <>
                    <span>{l().seeMore}</span>
                    <Expand01Icon
                      class="size-3 transition-all group-hover:size-4"
                      aria-hidden="true"
                    />
                  </>
                }
              >
                <span>{l().collapse}</span>
                <Minimize01Icon
                  class="size-3 transition-all group-hover:size-4"
                  aria-hidden="true"
                />
              </Show>
            </button>
          </Show>

          {/* Footer */}
          <DataTableFooter />
        </DataTableInternalContext.Provider>
      </div>
    </div>
  );
}
