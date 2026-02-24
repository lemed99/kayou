import { type Option } from '../../shared';

/**
 * Filter operators supported by the DataTable filter system.
 */
export type FilterOperator =
  | 'equal'
  | 'notEqual'
  | 'contains'
  | 'include'
  | 'greaterThan'
  | 'lessThan'
  | 'gte'
  | 'lte'
  | 'between'
  | 'in'
  | 'isNull'
  | 'isNotNull'
  | ''; // to be able have new filter with no defaults

/**
 * Field types for filter inputs.
 */
export type FilterFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'selectSearch'
  | 'multiSelect'
  | 'datepicker'
  | 'multidate'
  | 'dateRange';

/**
 * Data types that can be filtered.
 */
export type FilterDataType = 'string' | 'number' | 'date' | 'array' | 'boolean';

/**
 * Value types for filters based on operator.
 */
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | [number | null, number | null]
  | [Date, Date]
  | null;

/**
 * Configuration for number input filters.
 */
export interface NumberFilterConfig {
  /** Type of number input. */
  type?: 'integer' | 'float';
  /** Minimum value allowed. */
  min?: number;
  /** Maximum value allowed. */
  max?: number;
  /** Step value for increment/decrement. */
  step?: number;
}

/**
 * Configuration for date filters.
 */
export interface DateFilterConfig {
  /** Locale for date formatting. */
  locale?: string;
  /** Display format for the date. */
  displayFormat?: string;
  /** Minimum selectable date. */
  minDate?: Date;
  /** Maximum selectable date. */
  maxDate?: Date;
}

/**
 * Configuration for a single filter field.
 */
export interface FilterConfig<T> {
  /** Unique key identifying this filter, typically matching a column key. */
  key: string;
  /** Display label for the filter. */
  label: string;
  /** Type of input field to render. */
  fieldType: FilterFieldType;
  /** Data type of the field being filtered. */
  dataType: FilterDataType;
  /** Allowed operators for this filter. Defaults based on dataType if not provided. */
  operators?: FilterOperator[];
  /** Default operator when filter is first added. */
  defaultOperator?: FilterOperator;
  /** Options for select, selectSearch, or multiSelect field types. */
  options?: Option[];
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Configuration for number inputs. */
  numberConfig?: NumberFilterConfig;
  /** Configuration for date inputs. */
  dateConfig?: DateFilterConfig;
  /** Min values for multidate and dateRange */
  min?: number;
  /** Max vlaues for multidate and dateRange */
  max?: number;
  /** Custom function to extract the value from a record. Uses key by default. */
  getValue?: (record: T) => unknown;
}

/**
 * Represents an active filter with its current value.
 */
export interface ActiveFilter {
  /** Key identifying the filter configuration. */
  key: string;
  /** Currently selected operator. */
  operator: FilterOperator;
  /** Current filter value. */
  value: FilterValue;
}

/**
 * Map of active filters keyed by filter key.
 */
export type FilterState = Map<string, ActiveFilter>;

/**
 * Default operators by data type.
 */
export const DEFAULT_OPERATORS: Record<FilterDataType, FilterOperator[]> = {
  string: ['contains', 'equal', 'notEqual', 'isNull', 'isNotNull', 'in'],
  number: [
    'equal',
    'notEqual',
    'greaterThan',
    'lessThan',
    'gte',
    'lte',
    'between',
    'isNull',
    'isNotNull',
  ],
  date: [
    'equal',
    'notEqual',
    'greaterThan',
    'lessThan',
    'between',
    'isNull',
    'isNotNull',
    'in',
  ],
  array: ['include', 'isNull', 'isNotNull'],
  boolean: ['equal', 'notEqual'],
};

/**
 * Human-readable labels for filter operators.
 */
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equal: 'equals',
  notEqual: 'not equal',
  contains: 'contains',
  include: 'includes',
  greaterThan: 'greater than',
  lessThan: 'less than',
  gte: 'greater or equal',
  lte: 'less or equal',
  between: 'between',
  isNull: 'is null',
  isNotNull: 'is not null',
  in: 'in',
  '': '', // to be able have new filter with no defaults
};

/**
 * Sort direction for DataTable columns.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort action includes 'asc', 'desc', and '' (clear sort).
 * Used internally by sort handlers; '' removes the column from the sort stack.
 */
export type SortAction = SortDirection | '';

/**
 * A single sort entry for multi-column sorting.
 */
export interface SortEntry {
  key: string;
  direction: SortDirection;
}

/**
 * A saved table configuration that captures the display state of a DataTable.
 * Stored in localStorage as JSON.
 */
export interface SavedTableConfig {
  /** Unique identifier. */
  id: string;
  /** User-provided display name. */
  name: string;
  /** Visible column keys. */
  columns: string[];
  /** Sort entries. */
  sorts: SortEntry[];
  /** Serialized FilterState as Map entries (Map is not JSON-serializable). */
  filters: [string, ActiveFilter][];
  /** Rows per page. */
  perPage: number;
}
