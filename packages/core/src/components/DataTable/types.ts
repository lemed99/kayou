import { JSX } from 'solid-js';

import { type Option } from '../../helpers';

/**
 * Filter operators supported by the DataTable filter system.
 */
export type FilterOperator =
  | 'equal'
  | 'contains'
  | 'include'
  | 'greaterThan'
  | 'lessThan'
  | 'gte'
  | 'lte'
  | 'between'
  | 'isEmpty'
  | 'isNotEmpty';

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
  | [number, number]
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
 * Column configuration with optional inline filter config.
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
  /** Optional inline filter configuration for this column. */
  filter?: Omit<FilterConfig<T>, 'key' | 'label'>;
}

/**
 * Default operators by data type.
 */
export const DEFAULT_OPERATORS: Record<FilterDataType, FilterOperator[]> = {
  string: ['contains', 'equal', 'isEmpty', 'isNotEmpty'],
  number: [
    'equal',
    'greaterThan',
    'lessThan',
    'gte',
    'lte',
    'between',
    'isEmpty',
    'isNotEmpty',
  ],
  date: ['equal', 'greaterThan', 'lessThan', 'between', 'isEmpty', 'isNotEmpty'],
  array: ['include', 'isEmpty', 'isNotEmpty'],
  boolean: ['equal'],
};

/**
 * Human-readable labels for filter operators.
 */
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equal: 'equals',
  contains: 'contains',
  include: 'includes',
  greaterThan: 'greater than',
  lessThan: 'less than',
  gte: 'greater or equal',
  lte: 'less or equal',
  between: 'between',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};
