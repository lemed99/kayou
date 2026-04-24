import { Accessor, JSX, createContext, useContext } from 'solid-js';

import {
  DataTableAriaLabels,
  DataTableColumnProps,
  DataTableCursor,
  DataTableLabels,
  DataTablePaginationType,
} from './DataTable';
import { SavedTableConfig, SortAction, SortEntry } from './types';

export interface ContextMenuState<T> {
  x: number;
  y: number;
  rowKey: string;
  row: T;
  index: number;
}

export interface DataTableInternalContextValue<T> {
  // Data
  columns: Accessor<DataTableColumnProps<T>[]>;
  allColumns: DataTableColumnProps<T>[];
  setColumns: (cols: DataTableColumnProps<T>[]) => void;
  visibleData: Accessor<T[]>;
  baseData: Accessor<T[]>;

  // Layout
  rowGridStyle: Accessor<string>;
  rowWidth: Accessor<number>;
  setHeaderRef: (ref: HTMLDivElement | undefined) => void;

  // Selection
  readonly rowSelection: boolean;
  selectedRows: Accessor<Set<string>>;
  allSelected: Accessor<boolean>;
  toggleSelectAll: () => void;
  toggleSelectRow: (key: string) => void;
  getRowKey: (row: T, index: number) => string;

  // Search
  searchKey: Accessor<string>;
  handleSearchChange: (value: string) => void;
  searchRef: Accessor<HTMLInputElement | undefined>;
  setSearchRef: (ref: HTMLInputElement | undefined) => void;

  // Pagination
  paginationType: Accessor<DataTablePaginationType>;
  currentPage: Accessor<number>;
  handlePageChange: (page: number) => void;
  currentCursor: Accessor<DataTableCursor>;
  prevCursor: Accessor<DataTableCursor>;
  nextCursor: Accessor<DataTableCursor>;
  handleCursorChange: (cursor: DataTableCursor) => void;
  pageTotal?: number;
  perPage: Accessor<number>;
  handlePerPageChange: (value: number) => void;
  perPageOptions: number[];

  // Expansion (table-level see-more)
  expanded: Accessor<boolean>;
  toggleExpanded: () => void;

  // Sorting
  sorts: Accessor<SortEntry[]>;
  onSortSelect: (key: string, direction: SortAction) => void;
  sortableColumns: Accessor<Set<string>>;

  // Virtual
  useVirtualization: Accessor<boolean>;
  setVirtualContainerRef: (ref: HTMLElement | undefined) => void;
  expandedHeight: Accessor<number>;

  // Labels
  labels: Accessor<DataTableLabels>;
  ariaLabels: Accessor<DataTableAriaLabels>;

  // Saved configurations
  configEnabled: boolean;
  configs: Accessor<SavedTableConfig[]>;
  activeConfigId: Accessor<string | null>;
  isDirty: Accessor<boolean>;
  isAtLimit: Accessor<boolean>;
  hasConfigs: Accessor<boolean>;
  onSaveConfig: (name: string) => boolean;
  onUpdateConfig: (id: string, name: string) => void;
  onDeleteConfig: (id: string) => void;
  onActivateConfig: (id: string | null) => void;
  getConfig: (id: string) => SavedTableConfig | undefined;

  // Row click
  onRowClick?: (row: T, index: number) => void;

  // Custom empty state
  emptyState?: JSX.Element;

  // Row class/style
  rowClass?: string | ((row: T, index: number) => string);

  // Column locking (sticky)
  columnLocking: boolean;
  stickyColumnKey: Accessor<string | null>;
  toggleStickyColumn: (key: string) => void;

  // Row locking (pin to viewport on vertical scroll)
  rowLocking: boolean;
  lockedRowKey: Accessor<string | null>;
  toggleLockedRow: (key: string) => void;
  virtualContainerRef: Accessor<HTMLElement | undefined>;

  // Column resizing
  columnResizing: boolean;
  resizedWidths: Accessor<Map<string, number>>;
  onColumnResize: (key: string, width: number) => void;
  resetColumnResize: (key: string) => void;

  // Row expansion (per-row detail panels)
  expandRow?: (row: T) => JSX.Element;
  expandedRows: Accessor<Set<string>>;
  toggleRowExpansion: (key: string) => void;

  // Keyboard navigation
  focusedRowIndex: Accessor<number>;
  setFocusedRowIndex: (index: number) => void;

  // Right-click context menu
  rowContextMenu?: (row: T, index: number, closeMenu: () => void) => JSX.Element;
  contextMenuState: Accessor<ContextMenuState<T> | null>;
  openContextMenu: (e: MouseEvent, row: T, index: number) => void;
  closeContextMenu: () => void;

  // Props pass-through
  loading: boolean;
  validating?: boolean;
  error?: unknown;
  rowHeight?: number;
  estimatedRowHeight?: number;
  isLoadingMore?: boolean;
  perPageControl?: boolean;
  footer?: boolean;
  searchBar?: boolean;
  configureColumns?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableInternalContext = createContext<DataTableInternalContextValue<any>>();

export function useDataTableInternal<T>(): DataTableInternalContextValue<T> {
  const ctx = useContext(DataTableInternalContext);
  if (!ctx) throw new Error('DataTable sub-components must be used inside <DataTable>');
  return ctx as DataTableInternalContextValue<T>;
}

export { DataTableInternalContext };
