import { Accessor, createMemo, createSignal } from 'solid-js';

import {
  DEFAULT_OPERATORS,
  FilterConfig,
  FilterOperator,
  FilterState,
  FilterValue,
} from './types';

interface UseDataTableFiltersConfig<T> {
  /** Filter configurations (accessor for reactivity). */
  filterConfigs: Accessor<FilterConfig<T>[]>;
  /** Controlled filter state (accessor for reactivity). */
  filters?: Accessor<FilterState | undefined>;
  /** Callback when filters change. */
  onFiltersChange?: (filters: FilterState) => void;
}

interface UseDataTableFiltersResult<T> {
  /** Current active filters. */
  activeFilters: Accessor<FilterState>;
  /** Set or update a filter. */
  setFilter: (key: string, operator: FilterOperator, value: FilterValue) => void;
  /** Remove a filter by key. */
  removeFilter: (key: string) => void;
  /** Clear all filters. */
  clearFilters: () => void;
  /** Replace all filters at once (single update). */
  replaceAllFilters: (filters: FilterState) => void;
  /** Get available operators for a filter. */
  getOperators: (key: string) => FilterOperator[];
  /** Get filter config by key. */
  getFilterConfig: (key: string) => FilterConfig<T> | undefined;
  /** Number of active filters. */
  activeFilterCount: Accessor<number>;
}

/**
 * Hook for managing DataTable filter state.
 * Fires `onFiltersChange` when filters are modified — the consumer
 * is responsible for filtering or fetching data accordingly.
 */
export function useDataTableFilters<T extends Record<string, unknown>>(
  config: UseDataTableFiltersConfig<T>,
): UseDataTableFiltersResult<T> {
  // Internal state (used when not controlled)
  const [internalFilters, setInternalFilters] = createSignal<FilterState>(new Map());

  // Use controlled or internal state (read accessors lazily for reactivity)
  const activeFilters = createMemo(() => config.filters?.() ?? internalFilters());

  // Create a map of filter configs for quick lookup
  const configMap = createMemo(() => {
    const map = new Map<string, FilterConfig<T>>();
    config.filterConfigs().forEach((fc) => map.set(fc.key, fc));
    return map;
  });

  const isControlled = () => config.filters?.() !== undefined;

  const updateFilters = (newFilters: FilterState) => {
    if (!isControlled()) setInternalFilters(newFilters);
    config.onFiltersChange?.(newFilters);
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

  const replaceAllFilters = (filters: FilterState) => {
    updateFilters(filters);
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
    setFilter,
    removeFilter,
    clearFilters,
    replaceAllFilters,
    getOperators,
    getFilterConfig,
    activeFilterCount,
  };
}
