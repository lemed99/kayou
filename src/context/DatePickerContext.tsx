import { ParentComponent, createContext, onMount } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';

import { isDateValid } from '../helpers/dates';

export type DaysMap = Record<string, string[]>;

export interface DatePickerContextType {
  monthCache: DaysMap;
  setMonthCache: (key: string, days: string[]) => void;
  clearDatePickerGlobal: () => void;
  locale: string;
}

export const DatePickerContext = createContext<DatePickerContextType>();

export const DatePickerProvider: ParentComponent<{ locale: string }> = (props) => {
  const [monthCache, setMonthCacheStore] = createStore<DaysMap>({});

  onMount(() => {
    const stored = JSON.parse(localStorage.getItem('DatePickerCache') || '{}') as DaysMap;
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
  });

  const setMonthCache = (key: string, days: string[]) => {
    setMonthCacheStore(key, days);
    const updatedCache = { ...unwrap(monthCache), [key]: days };
    localStorage.setItem('DatePickerCache', JSON.stringify(updatedCache));
  };

  const clearDatePickerGlobal = () => {
    setMonthCacheStore({});
    localStorage.removeItem('DatePickerCache');
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
