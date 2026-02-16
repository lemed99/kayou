import { For, Match, Show, Switch, createMemo, createSignal } from 'solid-js';

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@kayou/icons';
import { twMerge } from 'tailwind-merge';

import Button from '../Button';
import NumberInput from '../NumberInput';
import type { DatePickerAriaLabels } from './DatePicker';
import {
  addMonths,
  getDaysLong,
  getDaysShort,
  getMonthsShort,
  isSameDay,
  parseDate,
  toISO,
} from './dates';
import { useDatePicker } from './useDatePicker';

/** Number of cells in a 6-week calendar grid (7 days * 6 weeks) */
const CALENDAR_GRID_SIZE = 42;

/** Minimum valid year for date selection (Unix epoch year) */
const MIN_YEAR = 1970;

/** Maximum valid year for date selection */
const MAX_YEAR = 9999;

/** Number of years to show in the year selector (last 10 years from current year + 1) */
const YEAR_RANGE_SIZE = 10;

/**
 * Props for the internal Calendar component.
 */
export interface CalendarProps {
  /** Accessor for the current date being viewed in the calendar. */
  currentDate: () => Date;
  /** Function to update the current viewed date. */
  setCurrentDate: (date: Date) => void;
  /** Function called when a date is selected. */
  selectDate: (date: Date) => void;
  /** Accessor for the selection type (single, multiple, range). */
  type: () => string;
  /** Locale for date/month names. */
  locale: string;
  /** Function to check if a date is selected (for single/multiple modes). */
  isSingletonDateSelected: (date: Date) => boolean;
  /** Function to check if a date is a range start/end. */
  isRangeDateSelected: (date: Date) => { start: boolean; end: boolean };
  /** Function to check if a date falls within the selected range. */
  isDateInRange: (date: Date) => boolean;
  /** Function to check if a date falls within the hover preview range. */
  isDateInPreviewRange?: (date: Date) => boolean;
  /** Function to check if a date is the hovered endpoint of the preview range. */
  isPreviewEndpoint?: (date: Date) => boolean;
  /** Callback when a date is hovered (for range preview). */
  onDateHover?: (date: Date | null) => void;
  /** Callback when mouse moves over a date (to detect mouse-to-keyboard switch). */
  onDateMouseMove?: () => void;
  /** Function to check if a date is disabled. */
  isDateDisabled: (date: Date) => boolean;
  /** Minimum selectable date. */
  minDate?: Date;
  /** Maximum selectable date. */
  maxDate?: Date;
  /** Additional CSS classes for the calendar. */
  calendarClass?: string;
  /** Callback for keyboard events. */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** Accessor for the currently focused date (keyboard navigation). */
  focusedDate?: () => Date | null;
  /** Callback to update the focused date. */
  setFocusedDate?: (date: Date) => void;
  /** Day the week starts on. 0 = Sunday, 1 = Monday. */
  weekStartsOn: 0 | 1;
  /** Aria labels for accessibility. */
  ariaLabels: DatePickerAriaLabels;
  /** Function to announce messages to screen readers. */
  announce?: (message: string) => void;
}

/**
 * Generates an array of 42 dates (6 weeks) for the calendar grid,
 * starting from the first day of the week before the first day of the month.
 * @param date - The date representing the month to generate
 * @param weekStartsOn - 0 for Sunday, 1 for Monday
 * @param monthCache - Cached month data from context
 * @param setMonthCache - Function to update cache
 */
const getSixWeeksMergedDaysInMonth = (
  date: Date,
  weekStartsOn: 0 | 1,
  monthCache: import('./DatePickerContext').DaysMap,
  setMonthCache: (key: string, days: string[]) => void,
): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${month}-${weekStartsOn}`;

  const cached = monthCache[key];
  if (cached) {
    return cached.map((d) => parseDate(d));
  }

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();

  // Calculate days to go back to reach the start of the week
  let daysToSubtract: number;
  if (weekStartsOn === 1) {
    // Monday start: Sunday (0) -> 6, Monday (1) -> 0, etc.
    daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  } else {
    // Sunday start: Sunday (0) -> 0, Monday (1) -> 1, etc.
    daysToSubtract = dayOfWeek;
  }
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const days: Date[] = [];
  const currentDate = startDate;

  for (let i = 0; i < CALENDAR_GRID_SIZE; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  setMonthCache(
    key,
    days.map((d) => toISO(d)),
  );
  return days;
};

/**
 * Internal calendar grid component for DatePicker.
 * Renders month/year navigation and day selection grid.
 */
const Calendar = (props: CalendarProps) => {
  const { monthCache, setMonthCache } = useDatePicker();
  const [showMonthSelector, setShowMonthSelector] = createSignal(false);
  const [showYearSelector, setShowYearSelector] = createSignal(false);
  const [customYear, setCustomYear] = createSignal('');
  const [focusedMonthIndex, setFocusedMonthIndex] = createSignal<number | null>(null);
  const [focusedYearIndex, setFocusedYearIndex] = createSignal<number | null>(null);

  // Refs for header buttons to manage focus trap
  let containerRef: HTMLDivElement | undefined;
  let prevMonthBtnRef: HTMLButtonElement | undefined;
  let monthBtnRef: HTMLButtonElement | undefined;
  let yearBtnRef: HTMLButtonElement | undefined;
  let nextMonthBtnRef: HTMLButtonElement | undefined;

  const days = createMemo(() =>
    getSixWeeksMergedDaysInMonth(
      props.currentDate(),
      props.weekStartsOn,
      monthCache,
      setMonthCache,
    ),
  );

  /** Days grouped into rows of 7 for ARIA grid row structure */
  const dayRows = createMemo(() => {
    const allDays = days();
    const rows: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      rows.push(allDays.slice(i, i + 7));
    }
    return rows;
  });

  // Get day headers in correct order based on weekStartsOn
  const dayHeaders = createMemo(() => {
    const shortDays = getDaysShort(props.locale);
    const longDays = getDaysLong(props.locale);
    const short =
      props.weekStartsOn === 0 ? [shortDays[6], ...shortDays.slice(0, 6)] : shortDays;
    const long =
      props.weekStartsOn === 0 ? [longDays[6], ...longDays.slice(0, 6)] : longDays;
    return short.map((s, i) => ({ short: s, long: long[i] }));
  });

  const handleDateClick = (date: Date) => {
    if (props.isDateDisabled(date)) return;
    props.selectDate(date);
  };

  const navigateMonth = (direction: number) => {
    const newDate = addMonths(props.currentDate(), direction);
    props.setCurrentDate(newDate);

    // Update focused date to same day in new month, clamped to max days
    const currentFocused = props.focusedDate?.();
    if (currentFocused && props.setFocusedDate) {
      const newMonth = newDate.getMonth();
      const newYear = newDate.getFullYear();
      const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
      const newDay = Math.min(currentFocused.getDate(), daysInNewMonth);
      props.setFocusedDate(new Date(newYear, newMonth, newDay));
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === props.currentDate().getMonth();
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(props.currentDate());
    newDate.setMonth(monthIndex);
    props.setCurrentDate(newDate);

    // Update focused date to same day in new month, clamped to max days
    const currentFocused = props.focusedDate?.();
    if (currentFocused && props.setFocusedDate) {
      const daysInNewMonth = new Date(newDate.getFullYear(), monthIndex + 1, 0).getDate();
      const newDay = Math.min(currentFocused.getDate(), daysInNewMonth);
      props.setFocusedDate(new Date(newDate.getFullYear(), monthIndex, newDay));
    }

    setShowMonthSelector(false);
    setFocusedMonthIndex(null);
    // Return focus to the date grid
    focusDateButton();
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(props.currentDate());
    newDate.setFullYear(year);
    props.setCurrentDate(newDate);

    // Update focused date to same day in new year, clamped to max days
    const currentFocused = props.focusedDate?.();
    if (currentFocused && props.setFocusedDate) {
      const month = currentFocused.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const newDay = Math.min(currentFocused.getDate(), daysInMonth);
      props.setFocusedDate(new Date(year, month, newDay));
    }

    setShowYearSelector(false);
    setFocusedYearIndex(null);
    // Return focus to the date grid
    focusDateButton();
  };

  /**
   * Opens month selector and initializes focus on current month.
   */
  const openMonthSelector = () => {
    setShowYearSelector(false);
    setFocusedYearIndex(null);
    const isOpening = !showMonthSelector();
    setShowMonthSelector(!showMonthSelector());
    if (isOpening) {
      setFocusedMonthIndex(props.currentDate().getMonth());
      props.announce?.(props.ariaLabels.monthSelectorOpened);
      containerRef
        ?.querySelector<HTMLButtonElement>('[data-month][tabindex="0"]')
        ?.focus();
    } else {
      setFocusedMonthIndex(null);
    }
  };

  /**
   * Opens year selector and initializes focus on current year.
   */
  const openYearSelector = () => {
    setShowMonthSelector(false);
    setFocusedMonthIndex(null);
    const isOpening = !showYearSelector();
    setShowYearSelector(!showYearSelector());
    if (isOpening) {
      const years = getYearRange();
      const currentYearIndex = years.indexOf(props.currentDate().getFullYear());
      setFocusedYearIndex(currentYearIndex >= 0 ? currentYearIndex : 0);
      props.announce?.(props.ariaLabels.yearSelectorOpened);
      containerRef
        ?.querySelector<HTMLButtonElement>('[data-year][tabindex="0"]')
        ?.focus();
    } else {
      setFocusedYearIndex(null);
    }
  };

  /**
   * Handles keyboard navigation in month selector grid (2 columns, 6 rows).
   */
  const handleMonthKeyDown = (e: KeyboardEvent) => {
    const currentIndex = focusedMonthIndex() ?? props.currentDate().getMonth();
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(11, currentIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex >= 2 ? currentIndex - 2 : currentIndex;
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex <= 9 ? currentIndex + 2 : currentIndex;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleMonthSelect(currentIndex);
        return;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        setShowMonthSelector(false);
        setFocusedMonthIndex(null);
        monthBtnRef?.focus();
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      setFocusedMonthIndex(newIndex);
      containerRef
        ?.querySelector<HTMLButtonElement>(`[data-month="${newIndex}"]`)
        ?.focus();
    }
  };

  /**
   * Handles keyboard navigation in year selector grid (2 columns).
   */
  const handleYearKeyDown = (e: KeyboardEvent) => {
    const years = getYearRange();
    const currentIndex = focusedYearIndex() ?? 0;
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(years.length - 1, currentIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex >= 2 ? currentIndex - 2 : currentIndex;
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex <= years.length - 3 ? currentIndex + 2 : currentIndex;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleYearSelect(years[currentIndex]);
        return;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        setShowYearSelector(false);
        setFocusedYearIndex(null);
        yearBtnRef?.focus();
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      setFocusedYearIndex(newIndex);
      containerRef
        ?.querySelector<HTMLButtonElement>(`[data-year="${newIndex}"]`)
        ?.focus();
    }
  };

  const handleCustomYearSubmit = (e: Event) => {
    e.preventDefault();
    const year = parseInt(customYear());
    if (!isNaN(year) && year >= MIN_YEAR && year <= MAX_YEAR) {
      handleYearSelect(year);
      setCustomYear('');
    }
  };

  /**
   * Returns the last 10 years from current year + 1.
   * Example: If current year is 2026, returns [2018, 2019, ..., 2026, 2027]
   */
  const getYearRange = (): number[] => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    const startYear = endYear - YEAR_RANGE_SIZE + 1;
    const years: number[] = [];
    for (let i = startYear; i <= endYear; i++) {
      if (i >= MIN_YEAR) {
        years.push(i);
      }
    }
    return years;
  };

  const isSelected = (date: Date) => props.isSingletonDateSelected(date);
  const rangeSelection = (date: Date) => props.isRangeDateSelected(date);
  const isInCurrentMonth = (date: Date) => isCurrentMonth(date);
  const isInDateRange = (date: Date) => props.isDateInRange(date);
  const isInPreviewRange = (date: Date) => props.isDateInPreviewRange?.(date) ?? false;
  const isPreviewEnd = (date: Date) => props.isPreviewEndpoint?.(date) ?? false;
  const isDisabled = (date: Date) => props.isDateDisabled(date);
  const isToday = (date: Date) => isSameDay(date, new Date());

  /**
   * Focuses the currently focused date button in the calendar grid.
   */
  const focusDateButton = () => {
    const dateISO = focusedDateISO();
    if (!dateISO) return;
    containerRef?.querySelector<HTMLButtonElement>(`[data-date="${dateISO}"]`)?.focus();
  };

  // Convert focused date to ISO string for reactive comparison
  const focusedDateISO = createMemo(() => {
    const fd = props.focusedDate?.();
    return fd ? toISO(fd) : null;
  });

  /**
   * Formats a date for aria-label on day buttons.
   */
  const getDateAriaLabel = (date: Date): string => {
    return date.toLocaleDateString(props.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={(el) => {
        containerRef = el;
      }}
      class={twMerge(
        'w-full focus:outline-none md:w-[292px] md:min-w-[292px]',
        props.calendarClass,
      )}
      role="grid"
      aria-label={props.ariaLabels.calendar}
      onKeyDown={(e) => props.onKeyDown?.(e)}
    >
      <div
        data-calendar-header
        class="flex items-center space-x-1.5 rounded-md border border-neutral-300 px-2 py-1.5 dark:border-neutral-800"
      >
        <Show when={!showMonthSelector() && !showYearSelector()}>
          <div class="flex-none">
            <button
              ref={prevMonthBtnRef}
              type="button"
              onClick={() => navigateMonth(-1)}
              aria-label={props.ariaLabels.previousMonth}
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-neutral-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <ChevronLeftIcon class="size-5" />
            </button>
          </div>
        </Show>
        <div class="flex flex-1 items-center space-x-1.5">
          <div class="w-1/2">
            <button
              ref={monthBtnRef}
              type="button"
              onClick={openMonthSelector}
              aria-label={props.ariaLabels.selectMonth}
              aria-expanded={showMonthSelector()}
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] uppercase tracking-wide transition-all duration-300 hover:bg-neutral-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              {getMonthsShort(props.locale)[props.currentDate().getMonth()]}
            </button>
          </div>
          <div class="w-1/2">
            <button
              ref={yearBtnRef}
              type="button"
              onClick={openYearSelector}
              aria-label={props.ariaLabels.selectYear}
              aria-expanded={showYearSelector()}
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] uppercase tracking-wide transition-all duration-300 hover:bg-neutral-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              {props.currentDate().getFullYear()}
            </button>
          </div>
        </div>
        <Show when={!showMonthSelector() && !showYearSelector()}>
          <div class="flex-none">
            <button
              ref={nextMonthBtnRef}
              type="button"
              onClick={() => navigateMonth(1)}
              aria-label={props.ariaLabels.nextMonth}
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-neutral-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <ChevronRightIcon class="size-5" />
            </button>
          </div>
        </Show>
      </div>

      <Switch
        fallback={
          <div class="my-0.5">
            <div
              class="grid grid-cols-7 border-b border-neutral-300 py-2 dark:border-neutral-800"
              role="row"
            >
              <For each={dayHeaders()}>
                {(day) => (
                  <div
                    class="text-center capitalize tracking-wide text-neutral-500 dark:text-neutral-400"
                    role="columnheader"
                    aria-label={day.long}
                  >
                    {day.short}
                  </div>
                )}
              </For>
            </div>
            <div class="mt-1 flex flex-col gap-y-0.5" role="rowgroup">
              <For each={dayRows()}>
                {(row) => (
                  <div class="grid grid-cols-7 gap-x-0.5" role="row">
                    <For each={row}>
                      {(date) => {
                        const dateISO = toISO(date);

                        return (
                          <button
                            type="button"
                            data-date={dateISO}
                            onClick={() => handleDateClick(date)}
                            onMouseEnter={() => props.onDateHover?.(date)}
                            onMouseMove={() => props.onDateMouseMove?.()}
                            onMouseLeave={() => props.onDateHover?.(null)}
                            disabled={isDisabled(date)}
                            role="gridcell"
                            aria-label={getDateAriaLabel(date)}
                            aria-selected={
                              isSelected(date) ||
                              rangeSelection(date).start ||
                              rangeSelection(date).end
                            }
                            aria-disabled={isDisabled(date)}
                            tabIndex={focusedDateISO() === dateISO ? 0 : -1}
                            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            classList={{
                              'text-neutral-400': !isInCurrentMonth(date),
                              'text-blue-500':
                                isToday(date) &&
                                !isSelected(date) &&
                                !isPreviewEnd(date) &&
                                isInCurrentMonth(date),
                              'bg-blue-500 text-white font-medium rounded-lg':
                                (isSelected(date) || isPreviewEnd(date)) &&
                                isInCurrentMonth(date),
                              'bg-blue-500 text-white font-medium rounded-l-lg rounded-r-none':
                                rangeSelection(date).start &&
                                isInCurrentMonth(date) &&
                                !isSelected(date) &&
                                !isPreviewEnd(date),
                              'bg-blue-500 text-white font-medium rounded-r-lg rounded-l-none':
                                rangeSelection(date).end &&
                                isInCurrentMonth(date) &&
                                !isSelected(date),
                              'bg-blue-100 dark:bg-blue-900/40':
                                (isInDateRange(date) || isInPreviewRange(date)) &&
                                !isSelected(date) &&
                                !isPreviewEnd(date) &&
                                isInCurrentMonth(date),
                              'cursor-not-allowed! opacity-50': isDisabled(date),
                            }}
                          >
                            {date.getDate()}
                          </button>
                        );
                      }}
                    </For>
                  </div>
                )}
              </For>
            </div>
          </div>
        }
      >
        <Match when={showMonthSelector()}>
          <div
            class="px-0.5 sm:px-2"
            role="listbox"
            aria-label={props.ariaLabels.selectMonth}
            onKeyDown={handleMonthKeyDown}
          >
            <div class="mb-[3px] mt-2 grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getMonthsShort(props.locale)}>
                {(month, index) => (
                  <button
                    type="button"
                    data-month={index()}
                    onClick={() => handleMonthSelect(index())}
                    role="option"
                    aria-selected={index() === props.currentDate().getMonth()}
                    tabIndex={focusedMonthIndex() === index() ? 0 : -1}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 uppercase tracking-wide transition-all duration-100 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
                      index() === props.currentDate().getMonth()
                        ? 'bg-neutral-50 font-semibold dark:bg-neutral-700'
                        : '',
                    )}
                  >
                    {month}
                  </button>
                )}
              </For>
            </div>
          </div>
        </Match>
        <Match when={showYearSelector()}>
          <div
            class="px-0.5 sm:px-2"
            role="listbox"
            aria-label={props.ariaLabels.selectYear}
            onKeyDown={handleYearKeyDown}
          >
            <div class="mb-[3px] mt-2 grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getYearRange()}>
                {(year, index) => (
                  <button
                    type="button"
                    data-year={index()}
                    onClick={() => handleYearSelect(year)}
                    role="option"
                    aria-selected={year === props.currentDate().getFullYear()}
                    tabIndex={focusedYearIndex() === index() ? 0 : -1}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 uppercase tracking-wide transition-all duration-100 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700',
                      year === props.currentDate().getFullYear()
                        ? 'bg-neutral-50 font-semibold dark:bg-neutral-700'
                        : '',
                    )}
                  >
                    {year}
                  </button>
                )}
              </For>
            </div>
          </div>
          <fieldset
            class="m-0 mt-[9px] flex w-full gap-1 border-0 p-0"
            role="group"
            aria-label={props.ariaLabels.customYearGroup}
          >
            <NumberInput
              value={customYear()}
              onValueChange={(v) => setCustomYear(v !== null ? String(v) : '')}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowYearSelector(false);
                  setFocusedYearIndex(null);
                  yearBtnRef?.focus();
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCustomYearSubmit(e);
                }
              }}
              placeholder="20..."
              min={MIN_YEAR}
              aria-label={props.ariaLabels.enterCustomYear}
            />
            <Button
              type="button"
              size="md"
              icon={CheckIcon}
              aria-label={props.ariaLabels.confirmYear}
              onClick={handleCustomYearSubmit}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowYearSelector(false);
                  setFocusedYearIndex(null);
                  yearBtnRef?.focus();
                }
              }}
            />
          </fieldset>
        </Match>
      </Switch>
    </div>
  );
};

export default Calendar;
