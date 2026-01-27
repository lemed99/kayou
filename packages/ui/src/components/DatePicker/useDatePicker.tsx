import { useContext } from 'solid-js';

import { DatePickerContext } from './DatePickerContext';

/**
 * Hook to access the DatePicker context.
 * Provides month cache and locale for date picker components.
 * Must be used within a DatePickerProvider.
 *
 * @returns DatePickerContextType with monthCache, setMonthCache, clearDatePickerGlobal, and locale
 * @throws Error if used outside DatePickerProvider
 *
 * @example Basic usage
 * ```tsx
 * function MyDateComponent() {
 *   const { locale, monthCache } = useDatePicker();
 *   // Use locale for formatting, monthCache for cached date calculations
 * }
 * ```
 *
 * @example Clearing the cache
 * ```tsx
 * function ClearCacheButton() {
 *   const { clearDatePickerGlobal } = useDatePicker();
 *
 *   return (
 *     <button onClick={clearDatePickerGlobal}>
 *       Clear Date Cache
 *     </button>
 *   );
 * }
 * ```
 */
export const useDatePicker = () => {
  const ctx = useContext(DatePickerContext);
  if (!ctx) throw new Error('useDatePicker must be used within DatePickerProvider');
  return ctx;
};
