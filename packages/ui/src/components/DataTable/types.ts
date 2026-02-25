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
  | 'datepicker';

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
  | Date[]
  | [Date, Date][]
  | [string, string][]
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
 * Base configuration .
 */
interface BaseFilterConfig<T> {
  /** Unique key identifying this filter, typically matching a column key. */
  key: string;
  /** Display label for the filter. */
  label: string;
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
 * Defines the available filter operator sets for each field type and data type.
 */
type FieldConfigRules = {
  /**
   * Config for 'text' field type and 'string' data type.
   * - operators: Allowed string text operators.
   */
  text: {
    string: {
      /** Allowed operators for text string fields. */
      operators: Extract<
        FilterOperator,
        'contains' | 'equal' | 'notEqual' | 'isNull' | 'isNotNull' | ''
      >;
    };
  };
  /**
   * Config for 'number' field type and 'number' data type.
   * - operators: Allowed number field operators.
   */
  number: {
    number: {
      /** Allowed operators for number fields. */
      operators: Extract<
        FilterOperator,
        | 'equal'
        | 'notEqual'
        | 'greaterThan'
        | 'lessThan'
        | 'gte'
        | 'lte'
        | 'between'
        | 'isNull'
        | 'isNotNull'
        | ''
      >;
    };
  };
  /**
   * Config for 'datepicker' field type and 'date' data type.
   * - operators: Allowed datepicker field operators.
   */
  datepicker: {
    date: {
      /** Allowed operators for datepicker fields. */
      operators: Extract<
        FilterOperator,
        | 'equal'
        | 'notEqual'
        | 'greaterThan'
        | 'lessThan'
        | 'gte'
        | 'lte'
        | 'between'
        | 'isNull'
        | 'isNotNull'
        | 'in'
        | ''
      >;
    };
    array: {
      operators: Extract<FilterOperator, 'include' | ''>;
    };
  };
  /**
   * Config for 'multiSelect' field type over 'string' and 'array' data types.
   */
  multiSelect: {
    /**
     * For multiSelect of string.
     * - operators: "in", "isNull", "isNotNull"
     */
    string: {
      /** Allowed operators for multiSelect string fields. */
      operators: Extract<FilterOperator, 'include' | 'in' | 'isNull' | 'isNotNull' | ''>;
    };
    /**
     * For multiSelect of array.
     * - operators: array set operations.
     */
    array: {
      /** Allowed operators for multiSelect array fields. */
      operators: Extract<
        FilterOperator,
        'contains' | 'include' | 'in' | 'isNull' | 'isNotNull' | ''
      >;
    };
  };
  /**
   * Config for 'select' field type for string and boolean data types.
   */
  select: {
    string: {
      /** Allowed operators for select string fields. */
      operators: Extract<
        FilterOperator,
        'equal' | 'notEqual' | 'in' | 'isNull' | 'isNotNull' | ''
      >;
    };
    boolean: {
      /** Allowed operators for select boolean fields. */
      operators: Extract<
        FilterOperator,
        'equal' | 'notEqual' | 'isNull' | 'isNotNull' | ''
      >;
    };
  };
  /**
   * Config for 'selectSearch' field type and 'string' data type.
   */
  selectSearch: {
    string: {
      /** Allowed operators for selectSearch string fields. */
      operators: Extract<
        FilterOperator,
        'equal' | 'notEqual' | 'in' | 'isNull' | 'isNotNull' | ''
      >;
    };
  };
};

/**
 * Utility type to extract operator union for a given field and data type.
 * @template F Field type key
 * @template D Data type key
 */
type OperatorsFor<
  F extends keyof FieldConfigRules,
  D extends keyof FieldConfigRules[F],
> = FieldConfigRules[F][D] extends { operators: infer O } ? O : never;

/**
 * Configuration for a single field filter, parameterized by field/data type.
 * @template T Data record type
 * @template F Field type (key of FieldConfigRules)
 * @template D Data type (key of FieldConfigRules[F])
 */
export type FieldFilterConfig<
  T,
  F extends keyof FieldConfigRules,
  D extends keyof FieldConfigRules[F],
> = BaseFilterConfig<T> & {
  /** Field type (e.g., "text", "number", etc.) */
  fieldType: F;
  /** Data type (e.g., "string", "number", etc.) */
  dataType: D;
  /** Allowed filter operators for this field. */
  operators?: OperatorsFor<F, D>[];
  /** Operator to use by default. */
  defaultOperator?: OperatorsFor<F, D>;
};

/**
 * Union type of all possible filter field configs.
 * @template T Data record type
 */
export type FilterConfig<T> = {
  [F in keyof FieldConfigRules]: {
    [D in keyof FieldConfigRules[F]]: FieldFilterConfig<T, F, D>;
  }[keyof FieldConfigRules[F]];
}[keyof FieldConfigRules];

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
  string: ['contains', 'equal', 'notEqual', 'isNull', 'isNotNull'],
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
    'gte',
    'lte',
    'between',
    'isNull',
    'isNotNull',
    'in',
  ],
  array: ['contains', 'include', 'in', 'isNull', 'isNotNull'],
  boolean: ['equal', 'notEqual', 'isNull', 'isNotNull'],
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
