import { ParentComponent, createContext, onMount } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { isDateValid } from '../helpers/dates';

/** Cache storage key for persisting month data in localStorage */
const CACHE_STORAGE_KEY = 'DatePickerCache';

/**
 * Map of cached month data where keys are "year-month" strings
 * and values are arrays of ISO date strings.
 */
export type DaysMap = Record<string, string[]>;

/**
 * Context value provided by DatePickerProvider.
 */
export interface DatePickerContextType {
  /** Cached month data for calendar rendering performance. */
  monthCache: DaysMap;
  /** Add or update cached days for a month. */
  setMonthCache: (key: string, days: string[]) => void;
  /** Clear all cached month data from memory and localStorage. */
  clearDatePickerGlobal: () => void;
  /** Current locale for date formatting. */
  locale: string;
}

/**
 * Context for DatePicker state management.
 * Provides month caching and locale configuration.
 */
export const DatePickerContext = createContext<DatePickerContextType | undefined>(
  undefined,
);

/**
 * Props for the DatePickerProvider component.
 */
export interface DatePickerProviderProps {
  /** Locale identifier for date formatting (e.g., 'en-US', 'fr-FR'). */
  locale: string;
}

/**
 * Provider component for DatePicker context.
 * Manages month cache persistence and locale configuration.
 *
 * @example Basic usage
 * ```tsx
 * <DatePickerProvider locale="en-US">
 *   <App />
 * </DatePickerProvider>
 * ```
 *
 * @example With dynamic locale
 * ```tsx
 * const [locale, setLocale] = createSignal('en-US');
 *
 * <DatePickerProvider locale={locale()}>
 *   <App />
 * </DatePickerProvider>
 * ```
 */
export const DatePickerProvider: ParentComponent<DatePickerProviderProps> = (props) => {
  const [monthCache, setMonthCacheStore] = createStore<DaysMap>({});

  onMount(() => {
    // Skip localStorage access during SSR
    if (typeof window === 'undefined') return;

    try {
      const stored = JSON.parse(
        localStorage.getItem(CACHE_STORAGE_KEY) || '{}',
      ) as DaysMap;

      if (
        Object.keys(stored).length > 0 &&
        Object.keys(stored).every(
          (k) =>
            Array.isArray(stored[k]) &&
            stored[k].every((d) => typeof d === 'string' && isDateValid(d)),
        )
      ) {
        setMonthCacheStore(stored);
      }
    } catch {
      // localStorage may be blocked or unavailable
      console.warn('DatePickerProvider: Failed to load cache from localStorage');
    }
  });

  /**
   * Adds or updates cached days for a specific month.
   * Persists to localStorage for cross-session caching.
   */
  const setMonthCache = (key: string, days: string[]) => {
    setMonthCacheStore(key, days);

    // Skip localStorage access during SSR
    if (typeof window === 'undefined') return;

    try {
      const updatedCache = { ...unwrap(monthCache), [key]: days };
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(updatedCache));
    } catch {
      // localStorage may be blocked or unavailable
    }
  };

  /**
   * Clears all cached month data from memory and localStorage.
   */
  const clearDatePickerGlobal = () => {
    setMonthCacheStore({});

    // Skip localStorage access during SSR
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } catch {
      // localStorage may be blocked or unavailable
    }
  };

  return (
    <DatePickerContext.Provider
      value={{
        monthCache,
        setMonthCache,
        clearDatePickerGlobal,
        get locale() {
          return props.locale;
        },
      }}
    >
      {props.children}
    </DatePickerContext.Provider>
  );
};
