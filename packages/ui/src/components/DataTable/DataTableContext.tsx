import { JSX, createContext, createSignal, onMount, useContext } from 'solid-js';

export interface DataTableState {
  scrollTop?: number;
  searchKey?: string;
  expanded?: boolean;
  currentPage?: number;
  perPage?: number;
  selectedColumns?: string[];
}

interface DataTableContextValue {
  getState: (id: string) => DataTableState | null;
  setState: (id: string, state: Partial<DataTableState>) => void;
  clearState: (id: string) => void;
  clearAll: () => void;
  perPageOptions: number[];
}

const STORAGE_PREFIX = 'datatable:';

const DataTableContext = createContext<DataTableContextValue>();

const DEFAULT_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function DataTableProvider(props: {
  storageKey?: string;
  /** Per-page options available to all tables in this provider. @default [10, 25, 50, 100] */
  perPageOptions?: number[];
  children: JSX.Element;
}) {
  const getStorageKey = () =>
    props.storageKey ? `${STORAGE_PREFIX}${props.storageKey}` : null;

  const getAllStates = (): Record<string, DataTableState> => {
    const sk = getStorageKey();
    if (!sk || typeof sessionStorage === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem(sk);
      return stored
        ? (JSON.parse(stored) as Record<string, DataTableState>)
        : {};
    } catch {
      return {};
    }
  };

  const saveAllStates = (states: Record<string, DataTableState>) => {
    const sk = getStorageKey();
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
    const sk = getStorageKey();
    if (!sk || typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(sk);
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
  };
}
