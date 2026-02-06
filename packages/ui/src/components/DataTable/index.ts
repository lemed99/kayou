// Main DataTable component
export {
  DataTable,
  type DataTableColumnProps,
  type DataTableLabels,
  DEFAULT_DATA_TABLE_LABELS,
  type DataTableAriaLabels,
  DEFAULT_DATA_TABLE_ARIA_LABELS,
} from './DataTable';

// DataTable context for state persistence
export {
  DataTableProvider,
  useDataTableContext,
  useDataTableState,
  type DataTableState,
} from './DataTableContext';

// DataTable filters
export {
  DataTableFilters,
  type DataTableFiltersLabels,
  DEFAULT_DATA_TABLE_FILTERS_LABELS,
  type DataTableFiltersAriaLabels,
  DEFAULT_DATA_TABLE_FILTERS_ARIA_LABELS,
} from './DataTableFilters';
export type { DataTableFiltersProps } from './DataTableFilters';

// DataTable filter hook
export { useDataTableFilters } from './useDataTableFilters';

// Types and constants
export { DEFAULT_OPERATORS, OPERATOR_LABELS } from './types';
export type {
  ActiveFilter,
  DateFilterConfig,
  FilterConfig,
  FilterDataType,
  FilterFieldType,
  FilterOperator,
  FilterState,
  FilterValue,
  NumberFilterConfig,
} from './types';
