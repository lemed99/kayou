import { JSX, createContext, createSignal, onMount, useContext } from 'solid-js';

import { SavedTableConfig } from './types';

export interface DataTableState {
  scrollTop?: number;
  searchKey?: string;
  expanded?: boolean;
  currentPage?: number;
  currentCursor?: string | null;
  perPage?: number;
  selectedColumns?: string[];
}

interface DataTableContextValue {
  getState: (id: string) => DataTableState | null;
  setState: (id: string, state: Partial<DataTableState>) => void;
  clearState: (id: string) => void;
  clearAll: () => void;
  perPageOptions: number[];
  configEnabled: boolean;
  getConfigs: (id: string) => SavedTableConfig[];
  setConfigs: (id: string, configs: SavedTableConfig[]) => void;
}

const STATE_STORAGE_PREFIX = 'datatable:';
const CONFIG_STORAGE_PREFIX = 'datatable-configs:';

const DataTableContext = createContext<DataTableContextValue>();

const DEFAULT_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function DataTableProvider(props: {
  storageKey?: string;
  /** Per-page options available to all tables in this provider. @default [10, 25, 50, 100] */
  perPageOptions?: number[];
  children: JSX.Element;
}) {
  const getStateStorageKey = () =>
    props.storageKey ? `${STATE_STORAGE_PREFIX}${props.storageKey}` : null;

  const getConfigStorageKey = () =>
    props.storageKey ? `${CONFIG_STORAGE_PREFIX}${props.storageKey}` : null;

  // --- State persistence (sessionStorage) ---

  const getAllStates = (): Record<string, DataTableState> => {
    const sk = getStateStorageKey();
    if (!sk || typeof sessionStorage === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem(sk);
      return stored ? (JSON.parse(stored) as Record<string, DataTableState>) : {};
    } catch {
      return {};
    }
  };

  const saveAllStates = (states: Record<string, DataTableState>) => {
    const sk = getStateStorageKey();
    if (!sk || typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem(sk, JSON.stringify(states));
    } catch {
      // Storage full or unavailable
    }
  };

  const getState = (id: string): DataTableState | null => {
    return getAllStates()[id] ?? null;
  };

  const setState = (id: string, state: Partial<DataTableState>) => {
    const all = getAllStates();
    all[id] = { ...all[id], ...state };
    saveAllStates(all);
  };

  const clearState = (id: string) => {
    const all = getAllStates();
    delete all[id];
    saveAllStates(all);
  };

  const clearAll = () => {
    const sk = getStateStorageKey();
    if (!sk || typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(sk);
  };

  // --- Config persistence (localStorage) ---

  const getAllConfigs = (): Record<string, SavedTableConfig[]> => {
    const sk = getConfigStorageKey();
    if (!sk || typeof localStorage === 'undefined') return {};
    try {
      const stored = localStorage.getItem(sk);
      return stored ? (JSON.parse(stored) as Record<string, SavedTableConfig[]>) : {};
    } catch {
      return {};
    }
  };

  const saveAllConfigs = (configs: Record<string, SavedTableConfig[]>) => {
    const sk = getConfigStorageKey();
    if (!sk || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(sk, JSON.stringify(configs));
    } catch {
      // Storage full or unavailable
    }
  };

  const getConfigs = (id: string): SavedTableConfig[] => {
    return getAllConfigs()[id] ?? [];
  };

  const setConfigs = (id: string, configs: SavedTableConfig[]) => {
    const all = getAllConfigs();
    all[id] = configs;
    saveAllConfigs(all);
  };

  return (
    <DataTableContext.Provider
      value={{
        getState,
        setState,
        clearState,
        clearAll,
        get perPageOptions() {
          return props.perPageOptions ?? DEFAULT_PER_PAGE_OPTIONS;
        },
        get configEnabled() {
          return !!getConfigStorageKey();
        },
        getConfigs,
        setConfigs,
      }}
    >
      {props.children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext() {
  return useContext(DataTableContext);
}

/**
 * Hook to persist and restore DataTable state using session storage.
 * Must be used within a DataTableProvider for persistence to work.
 * Requires a stable `tableId` for correct state mapping.
 *
 * @param tableId - Stable identifier for this table instance
 * @returns Object with state accessor and save function
 */
export function useDataTableState(tableId?: string) {
  const context = useDataTableContext();
  const [restoredState, setRestoredState] = createSignal<DataTableState | null>(null);
  const [isRestored, setIsRestored] = createSignal(false);

  onMount(() => {
    if (tableId && context) {
      setRestoredState(context.getState(tableId));
    }
    setIsRestored(true);
  });

  const saveState = (state: Partial<DataTableState>) => {
    if (tableId && context) {
      context.setState(tableId, state);
    }
  };

  const clearState = () => {
    if (tableId && context) {
      context.clearState(tableId);
    }
  };

  const configEnabled = context?.configEnabled ?? false;

  const readConfigs = (): SavedTableConfig[] => {
    if (tableId && context) {
      return context.getConfigs(tableId);
    }
    return [];
  };

  const writeConfigs = (configs: SavedTableConfig[]) => {
    if (tableId && context) {
      context.setConfigs(tableId, configs);
    }
  };

  return {
    /** The restored state from session storage (null if none) */
    restoredState,
    /** Whether state restoration has completed */
    isRestored,
    /** Save partial state to session storage */
    saveState,
    /** Clear this table's state from session storage */
    clearState,
    /** Per-page options from the provider */
    perPageOptions: context?.perPageOptions ?? DEFAULT_PER_PAGE_OPTIONS,
    /** Whether config persistence is enabled (provider has storageKey) */
    configEnabled,
    /** Read saved configs for this table from localStorage */
    readConfigs,
    /** Write saved configs for this table to localStorage */
    writeConfigs,
  };
}
