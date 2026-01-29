import { ParentComponent, createContext } from 'solid-js';
import { createStore } from 'solid-js/store';

import { toISO } from './dates';

/**
 * Map of cached month data where keys are "year-month" strings
 * and values are arrays of ISO date strings.
 */
export type DaysMap = Record<string, string[]>;

/**
 * Shortcut definition for quick date selection.
 */
export interface DatePickerShortcut {
  /** Unique identifier for the shortcut. */
  id: string;
  /** Display label for the shortcut. */
  label: string;
  /** Function that returns the date value when shortcut is clicked. */
  getValue: () => { date?: string; startDate?: string; endDate?: string };
}

/**
 * Returns the start of the week (Monday) for a given date.
 */
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

/**
 * Returns the end of the week (Sunday) for a given date.
 */
const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

/**
 * Returns the start of the month for a given date.
 */
const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns the end of the month for a given date.
 */
const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Default shortcuts for quick date selection.
 */
export const DEFAULT_DATE_SHORTCUTS: DatePickerShortcut[] = [
  {
    id: 'today',
    label: 'Today',
    getValue: () => ({ date: toISO(new Date()) }),
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { date: toISO(yesterday) };
    },
  },
  {
    id: 'this-week',
    label: 'This Week',
    getValue: () => {
      const today = new Date();
      return {
        startDate: toISO(getStartOfWeek(today)),
        endDate: toISO(getEndOfWeek(today)),
      };
    },
  },
  {
    id: 'last-week',
    label: 'Last Week',
    getValue: () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      return {
        startDate: toISO(getStartOfWeek(lastWeek)),
        endDate: toISO(getEndOfWeek(lastWeek)),
      };
    },
  },
  {
    id: 'this-month',
    label: 'This Month',
    getValue: () => {
      const today = new Date();
      return {
        startDate: toISO(getStartOfMonth(today)),
        endDate: toISO(getEndOfMonth(today)),
      };
    },
  },
  {
    id: 'last-month',
    label: 'Last Month',
    getValue: () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return {
        startDate: toISO(getStartOfMonth(lastMonth)),
        endDate: toISO(getEndOfMonth(lastMonth)),
      };
    },
  },
];

/**
 * Context value provided by DatePickerProvider.
 */
export interface DatePickerContextType {
  /** Cached month data for calendar rendering performance. */
  monthCache: DaysMap;
  /** Add or update cached days for a month. */
  setMonthCache: (key: string, days: string[]) => void;
  /** Clear all cached month data from memory. */
  clearDatePickerGlobal: () => void;
  /** Current locale for date formatting. */
  locale: string;
  /** Available shortcuts for quick date selection. */
  shortcuts: DatePickerShortcut[];
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
  /** Custom shortcuts to override defaults. Pass empty array to disable all shortcuts. */
  shortcuts?: DatePickerShortcut[];
}

/**
 * Provider component for DatePicker context.
 * Manages month cache and locale configuration.
 *
 * @example Basic usage
 * ```tsx
 * <DatePickerProvider locale="en-US">
 *   <App />
 * </DatePickerProvider>
 * ```
 */
export const DatePickerProvider: ParentComponent<DatePickerProviderProps> = (props) => {
  const [monthCache, setMonthCacheStore] = createStore<DaysMap>({});

  const setMonthCache = (key: string, days: string[]) => {
    setMonthCacheStore(key, days);
  };

  const clearDatePickerGlobal = () => {
    setMonthCacheStore({});
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
        get shortcuts() {
          return props.shortcuts ?? DEFAULT_DATE_SHORTCUTS;
        },
      }}
    >
      {props.children}
    </DatePickerContext.Provider>
  );
};
