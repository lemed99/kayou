import { Accessor, JSX, createContext, useContext } from 'solid-js';

import { DataTableAriaLabels, DataTableColumnProps, DataTableLabels } from './DataTable';
import { SavedTableConfig, SortEntry } from './types';

export interface DataTableInternalContextValue<T> {
  // Data
  columns: Accessor<DataTableColumnProps<T>[]>;
  allColumns: DataTableColumnProps<T>[];
  setColumns: (cols: DataTableColumnProps<T>[]) => void;
  filteredData: Accessor<T[]>;
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
  currentPage: Accessor<number>;
  handlePageChange: (page: number) => void;
  perPage: Accessor<number>;
  handlePerPageChange: (value: number) => void;
  perPageOptions: number[];

  // Expansion
  expanded: Accessor<boolean>;
  toggleExpanded: () => void;

  // Sorting
  sorts: Accessor<SortEntry[]>;
  onSortClick: (key: string) => void;
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

  // Props pass-through
  loading: boolean;
  validating?: boolean;
  error?: unknown;
  rowHeight?: number;
  estimatedRowHeight?: number;
  isLoadingMore?: boolean;
  pageTotal?: number;
  perPageControl?: boolean;
  expandable?: boolean;
  defaultRowsCount: number;
  footer?: boolean;
  searchBar?: boolean;
  configureColumns?: boolean;
  filters?: JSX.Element;
  activeFilterCount?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableInternalContext = createContext<DataTableInternalContextValue<any>>();

export function useDataTableInternal<T>(): DataTableInternalContextValue<T> {
  const ctx = useContext(DataTableInternalContext);
  if (!ctx) throw new Error('DataTable sub-components must be used inside <DataTable>');
  return ctx as DataTableInternalContextValue<T>;
}

export { DataTableInternalContext };
