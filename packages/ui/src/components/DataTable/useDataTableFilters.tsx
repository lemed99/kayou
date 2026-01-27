import { Accessor, createMemo, createSignal } from 'solid-js';

import {
  ActiveFilter,
  DEFAULT_OPERATORS,
  FilterConfig,
  FilterOperator,
  FilterState,
  FilterValue,
} from './types';

interface UseDataTableFiltersConfig<T> {
  /** Data to filter. */
  data: Accessor<T[]>;
  /** Filter configurations. */
  filterConfigs: FilterConfig<T>[];
  /** Controlled filter state (for external mode). */
  filters?: FilterState;
  /** Callback when filters change (for controlled mode). */
  onFiltersChange?: (filters: FilterState) => void;
  /** Filter mode: 'internal' applies filters locally, 'external' just tracks state. */
  filterMode?: 'internal' | 'external';
}

interface UseDataTableFiltersResult<T> {
  /** Current active filters. */
  activeFilters: Accessor<FilterState>;
  /** Filtered data (same as input data in external mode). */
  filteredData: Accessor<T[]>;
  /** Set or update a filter. */
  setFilter: (key: string, operator: FilterOperator, value: FilterValue) => void;
  /** Remove a filter by key. */
  removeFilter: (key: string) => void;
  /** Clear all filters. */
  clearFilters: () => void;
  /** Get available operators for a filter. */
  getOperators: (key: string) => FilterOperator[];
  /** Get filter config by key. */
  getFilterConfig: (key: string) => FilterConfig<T> | undefined;
  /** Number of active filters. */
  activeFilterCount: Accessor<number>;
}

/**
 * Checks if a value matches a filter condition.
 */
function matchesFilter<T>(
  record: T,
  filter: ActiveFilter,
  config: FilterConfig<T>,
): boolean {
  const { operator, value } = filter;

  // isEmpty and isNotEmpty don't need a value
  if (operator === 'isEmpty' || operator === 'isNotEmpty') {
    const fieldValue = config.getValue
      ? config.getValue(record)
      : (record as Record<string, unknown>)[config.key];
    const isEmpty =
      fieldValue === null ||
      fieldValue === undefined ||
      fieldValue === '' ||
      (Array.isArray(fieldValue) && fieldValue.length === 0);
    return operator === 'isEmpty' ? isEmpty : !isEmpty;
  }

  // If no value is set, filter passes
  if (value === null || value === undefined) return true;

  const fieldValue = config.getValue
    ? config.getValue(record)
    : (record as Record<string, unknown>)[config.key];

  switch (operator) {
    case 'equal':
      return fieldValue === value;

    case 'contains': {
      if (typeof fieldValue !== 'string' || typeof value !== 'string') return true;
      return fieldValue.toLowerCase().includes(value.toLowerCase());
    }

    case 'include': {
      if (!Array.isArray(value)) return true;
      const valueArray = value as string[];
      if (Array.isArray(fieldValue)) {
        return valueArray.some((v) => fieldValue.includes(v));
      }
      return valueArray.includes(String(fieldValue));
    }

    case 'greaterThan': {
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        return fieldValue > value;
      }
      if (fieldValue instanceof Date && value instanceof Date) {
        return fieldValue.getTime() > value.getTime();
      }
      return true;
    }

    case 'lessThan': {
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        return fieldValue < value;
      }
      if (fieldValue instanceof Date && value instanceof Date) {
        return fieldValue.getTime() < value.getTime();
      }
      return true;
    }

    case 'gte': {
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        return fieldValue >= value;
      }
      if (fieldValue instanceof Date && value instanceof Date) {
        return fieldValue.getTime() >= value.getTime();
      }
      return true;
    }

    case 'lte': {
      if (typeof fieldValue === 'number' && typeof value === 'number') {
        return fieldValue <= value;
      }
      if (fieldValue instanceof Date && value instanceof Date) {
        return fieldValue.getTime() <= value.getTime();
      }
      return true;
    }

    case 'between': {
      if (!Array.isArray(value) || value.length !== 2) return true;
      const [min, max] = value;
      if (
        typeof fieldValue === 'number' &&
        typeof min === 'number' &&
        typeof max === 'number'
      ) {
        return fieldValue >= min && fieldValue <= max;
      }
      if (fieldValue instanceof Date && min instanceof Date && max instanceof Date) {
        const time = fieldValue.getTime();
        return time >= min.getTime() && time <= max.getTime();
      }
      return true;
    }

    default:
      return true;
  }
}

/**
 * Hook for managing DataTable filter state and applying filters to data.
 */
export function useDataTableFilters<T extends Record<string, unknown>>(
  config: UseDataTableFiltersConfig<T>,
): UseDataTableFiltersResult<T> {
  const {
    data,
    filterConfigs,
    filters,
    onFiltersChange,
    filterMode = 'internal',
  } = config;

  // Internal state (used when not controlled)
  const [internalFilters, setInternalFilters] = createSignal<FilterState>(new Map());

  // Use controlled or internal state
  const activeFilters = createMemo(() => filters ?? internalFilters());

  // Create a map of filter configs for quick lookup
  const configMap = createMemo(() => {
    const map = new Map<string, FilterConfig<T>>();
    filterConfigs.forEach((fc) => map.set(fc.key, fc));
    return map;
  });

  // Apply filters to data
  const filteredData = createMemo(() => {
    const currentData = data();
    const currentFilters = activeFilters();

    // In external mode, return data as-is (filtering happens server-side)
    if (filterMode === 'external') return currentData;

    // No filters, return all data
    if (currentFilters.size === 0) return currentData;

    return currentData.filter((record) => {
      for (const [key, filter] of currentFilters) {
        const filterConfig = configMap().get(key);
        if (!filterConfig) continue;
        if (!matchesFilter(record, filter, filterConfig)) {
          return false;
        }
      }
      return true;
    });
  });

  const updateFilters = (newFilters: FilterState) => {
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  };

  const setFilter = (key: string, operator: FilterOperator, value: FilterValue) => {
    const newFilters = new Map(activeFilters());
    newFilters.set(key, { key, operator, value });
    updateFilters(newFilters);
  };

  const removeFilter = (key: string) => {
    const newFilters = new Map(activeFilters());
    newFilters.delete(key);
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    updateFilters(new Map());
  };

  const getOperators = (key: string): FilterOperator[] => {
    const filterConfig = configMap().get(key);
    if (!filterConfig) return [];
    return filterConfig.operators ?? DEFAULT_OPERATORS[filterConfig.dataType] ?? [];
  };

  const getFilterConfig = (key: string) => configMap().get(key);

  const activeFilterCount = createMemo(() => activeFilters().size);

  return {
    activeFilters,
    filteredData,
    setFilter,
    removeFilter,
    clearFilters,
    getOperators,
    getFilterConfig,
    activeFilterCount,
  };
}
