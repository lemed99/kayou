import { JSX, createContext, createSignal, onMount, useContext } from 'solid-js';

export interface DataTableState {
  scrollTop?: number;
  searchKey?: string;
  filterState?: Record<string, unknown>;
  expanded?: boolean;
  currentPage?: number;
  perPage?: number;
  selectedColumns?: string[];
}

interface DataTableContextValue {
  getState: (key: string) => DataTableState | null;
  setState: (key: string, state: Partial<DataTableState>) => void;
  clearState: (key: string) => void;
  clearAll: () => void;
}

const STORAGE_PREFIX = 'datatable:';

const DataTableContext = createContext<DataTableContextValue>();

export function DataTableProvider(props: { children: JSX.Element }) {
  const getStorageKey = (key: string) => `${STORAGE_PREFIX}${key}`;

  const getState = (key: string): DataTableState | null => {
    if (typeof sessionStorage === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(getStorageKey(key));
      return stored ? (JSON.parse(stored) as DataTableState) : null;
    } catch {
      return null;
    }
  };

  const setState = (key: string, state: Partial<DataTableState>) => {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const existing = getState(key) || {};
      const merged = { ...existing, ...state };
      sessionStorage.setItem(getStorageKey(key), JSON.stringify(merged));
    } catch {
      // Storage full or unavailable
    }
  };

  const clearState = (key: string) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(getStorageKey(key));
  };

  const clearAll = () => {
    if (typeof sessionStorage === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  };

  return (
    <DataTableContext.Provider value={{ getState, setState, clearState, clearAll }}>
      {props.children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext() {
  return useContext(DataTableContext);
}

/**
 * Hook to persist and restore DataTable state using session storage.
 * Must be used within a DataTableProvider.
 *
 * @param storageKey - Unique key to identify this table's state
 * @returns Object with state accessor and save function
 */
export function useDataTableState(storageKey: string | undefined) {
  const context = useDataTableContext();
  const [restoredState, setRestoredState] = createSignal<DataTableState | null>(null);
  const [isRestored, setIsRestored] = createSignal(false);

  onMount(() => {
    if (storageKey && context) {
      const state = context.getState(storageKey);
      setRestoredState(state);
    }
    setIsRestored(true);
  });

  const saveState = (state: Partial<DataTableState>) => {
    if (storageKey && context) {
      context.setState(storageKey, state);
    }
  };

  const clearState = () => {
    if (storageKey && context) {
      context.clearState(storageKey);
    }
  };

  return {
    /** The restored state from session storage (null if none) */
    restoredState: restoredState,
    /** Whether state restoration has completed */
    isRestored: isRestored,
    /** Save partial state to session storage */
    saveState,
    /** Clear this table's state from session storage */
    clearState,
  };
}
