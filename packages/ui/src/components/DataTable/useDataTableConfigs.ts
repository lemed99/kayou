import { Accessor, createMemo, createSignal } from 'solid-js';

import { ActiveFilter, FilterState, SavedTableConfig, SortEntry } from './types';

const MAX_CONFIGS = 3;

interface UseDataTableConfigsOptions {
  readConfigs: () => SavedTableConfig[];
  writeConfigs: (configs: SavedTableConfig[]) => void;
  currentColumns: Accessor<string[]>;
  currentSorts: Accessor<SortEntry[]>;
  currentFilters: Accessor<FilterState>;
  currentPerPage: Accessor<number>;
  defaultColumns: Accessor<string[]>;
  defaultPerPage: number;
}

interface UseDataTableConfigsResult {
  configs: Accessor<SavedTableConfig[]>;
  activeConfigId: Accessor<string | null>;
  isDirty: Accessor<boolean>;
  isAtLimit: Accessor<boolean>;
  hasConfigs: Accessor<boolean>;
  saveConfig: (name: string) => boolean;
  updateConfig: (id: string, name: string) => void;
  deleteConfig: (id: string) => void;
  activateConfig: (id: string | null) => void;
  getConfig: (id: string) => SavedTableConfig | undefined;
}

function serializeFilters(filters: FilterState): [string, ActiveFilter][] {
  return Array.from(filters.entries());
}

function filtersEqual(
  a: [string, ActiveFilter][],
  b: [string, ActiveFilter][],
): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort(([ka], [kb]) => ka.localeCompare(kb));
  const sortedB = [...b].sort(([ka], [kb]) => ka.localeCompare(kb));
  return sortedA.every(
    ([key, filter], i) =>
      key === sortedB[i][0] &&
      filter.operator === sortedB[i][1].operator &&
      JSON.stringify(filter.value) === JSON.stringify(sortedB[i][1].value),
  );
}

export function useDataTableConfigs(
  options: UseDataTableConfigsOptions,
): UseDataTableConfigsResult {
  const [configs, setConfigs] = createSignal<SavedTableConfig[]>(options.readConfigs());
  const [activeConfigId, setActiveConfigId] = createSignal<string | null>(null);

  const persistAndSet = (newConfigs: SavedTableConfig[]) => {
    setConfigs(newConfigs);
    options.writeConfigs(newConfigs);
  };

  const hasConfigs = createMemo(() => configs().length > 0);
  const isAtLimit = createMemo(() => configs().length >= MAX_CONFIGS);

  const getConfig = (id: string) => configs().find((c) => c.id === id);

  const isDirty = createMemo(() => {
    const activeId = activeConfigId();
    const currentCols = options.currentColumns();
    const currentSorts = options.currentSorts();
    const currentFilters = options.currentFilters();
    const currentPerPage = options.currentPerPage();

    let baselineCols: string[];
    let baselineSorts: SortEntry[];
    let baselineFilters: [string, ActiveFilter][];
    let baselinePerPage: number;

    if (activeId) {
      const config = configs().find((c) => c.id === activeId);
      if (!config) return false;
      baselineCols = config.columns;
      baselineSorts = config.sorts;
      baselineFilters = config.filters;
      baselinePerPage = config.perPage;
    } else {
      baselineCols = options.defaultColumns();
      baselineSorts = [];
      baselineFilters = [];
      baselinePerPage = options.defaultPerPage;
    }

    if (currentPerPage !== baselinePerPage) return true;

    if (
      currentCols.length !== baselineCols.length ||
      currentCols.some((k, i) => k !== baselineCols[i])
    )
      return true;

    if (
      currentSorts.length !== baselineSorts.length ||
      currentSorts.some(
        (s, i) =>
          s.key !== baselineSorts[i].key ||
          s.direction !== baselineSorts[i].direction,
      )
    )
      return true;

    const currentFiltersArr = serializeFilters(currentFilters);
    if (!filtersEqual(currentFiltersArr, baselineFilters)) return true;

    return false;
  });

  const saveConfig = (name: string): boolean => {
    if (isAtLimit()) return false;
    const newConfig: SavedTableConfig = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      name,
      columns: options.currentColumns(),
      sorts: options.currentSorts(),
      filters: serializeFilters(options.currentFilters()),
      perPage: options.currentPerPage(),
    };
    persistAndSet([...configs(), newConfig]);
    setActiveConfigId(newConfig.id);
    return true;
  };

  const updateConfig = (id: string, name: string) => {
    persistAndSet(
      configs().map((c) =>
        c.id === id
          ? {
              ...c,
              name,
              columns: options.currentColumns(),
              sorts: options.currentSorts(),
              filters: serializeFilters(options.currentFilters()),
              perPage: options.currentPerPage(),
            }
          : c,
      ),
    );
  };

  const deleteConfig = (id: string) => {
    persistAndSet(configs().filter((c) => c.id !== id));
    if (activeConfigId() === id) {
      setActiveConfigId(null);
    }
  };

  const activateConfig = (id: string | null) => {
    setActiveConfigId(id);
  };

  return {
    configs,
    activeConfigId,
    isDirty,
    isAtLimit,
    hasConfigs,
    saveConfig,
    updateConfig,
    deleteConfig,
    activateConfig,
    getConfig,
  };
}
