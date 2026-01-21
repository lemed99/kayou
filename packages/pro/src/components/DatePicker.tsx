import {
  For,
  JSX,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onCleanup,
} from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { Portal } from 'solid-js/web';

// Core imports from @exowpee/solidly
import { Button, HelperText, Label, Select, TextInput } from '@exowpee/solidly';
import {
  ChevronDownButton,
  ClearContentButton,
  addMonths,
  formatDate,
  getDaysShort,
  getMonthsShort,
  isDateValid,
  isInRange,
  isSameDay,
  parseDate,
  toISO,
} from '@exowpee/solidly/helpers';
import { type Placement, useFloating } from '@exowpee/solidly/hooks';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@exowpee/solidly/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

// Pro imports
import { useDatePicker } from '../hooks';
import NumberInput from './NumberInput';

/**
 * Shortcut definition for quick date selection.
 * Re-exported from context for component-level use.
 */
export interface DatePickerShortcut {
  /** Unique identifier for the shortcut. */
  id: string;
  /** Display label for the shortcut. */
  label: string;
  /** Function that returns the date value when shortcut is clicked. */
  getValue: () => { date?: string; startDate?: string; endDate?: string };
}

/** Number of cells in a 6-week calendar grid (7 days * 6 weeks) */
const CALENDAR_GRID_SIZE = 42;

/** Minimum valid year for date selection (Unix epoch year) */
const MIN_YEAR = 1970;

/** Number of years to show in the year selector (last 10 years from current year + 1) */
const YEAR_RANGE_SIZE = 10;

/**
 * Value object for the DatePicker component.
 */
export interface DateValue {
  /** Selected date for single mode (ISO format). */
  date?: string;
  /** Start date for range mode (ISO format). */
  startDate?: string;
  /** End date for range mode (ISO format). */
  endDate?: string;
  /** Array of selected dates for multiple mode (ISO format). */
  multipleDates?: string[];
  /** Selected hour (0-23). */
  hour?: number;
  /** Selected minute (0-59). */
  minute?: number;
  /** Selected second (0-59). */
  second?: number;
}

/**
 * Selection mode for the DatePicker.
 */
export type DatePickerType = 'single' | 'multiple' | 'range';

/**
 * Props for the DatePicker component.
 */
export interface DatePickerProps {
  /** Current date value(s). */
  value?: DateValue;
  /** Callback fired when the date selection changes. */
  onChange?: (value: DateValue) => void;
  /** Selection mode: single date, multiple dates, or date range. */
  type: DatePickerType;
  /** Display format for dates (e.g., 'DD/MM/YYYY'). @default 'DD/MM/YYYY' */
  displayFormat?: string;
  /** Additional CSS classes for the input. */
  inputClass?: string;
  /** Additional CSS classes for the calendar popup. */
  calendarClass?: string;
  /** Locale for date formatting and day/month names. */
  locale: string;
  /** Position of the calendar popup. @default 'bottom' */
  popoverPosition?: 'top' | 'bottom';
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Whether the input is in a loading state. */
  isLoading?: boolean;
  /** Placeholder text when no date is selected. */
  placeholder?: string;
  /** Minimum selectable date (ISO format). */
  minDate?: string;
  /** Maximum selectable date (ISO format). */
  maxDate?: string;
  /** Label displayed above the input. */
  label?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Custom styles for the input. */
  style?: JSX.CSSProperties;
  /** Custom display value to override the formatted date. */
  displayValue?: string;
  /** Show time picker alongside the calendar. Only works with 'single' type. */
  showTime?: boolean;
  /** Time format for display. @default '24h' */
  timeFormat?: '12h' | '24h';
  /** Minute step increment. @default 1 */
  minuteStep?: number;
  /** Second step increment. @default 1 */
  secondStep?: number;
  /** Show shortcuts panel on the left side of the calendar. */
  showShortcuts?: boolean;
  /** Custom shortcuts to use for this instance. Overrides provider shortcuts. */
  shortcuts?: DatePickerShortcut[];
  /** Day the week starts on. 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: 0 | 1;
}

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
  /** Ref setter for the calendar container. */
  ref?: (el: HTMLDivElement) => void;
  /** Accessor for the currently focused date (keyboard navigation). */
  focusedDate?: () => Date | null;
  /** Day the week starts on. 0 = Sunday, 1 = Monday. */
  weekStartsOn: 0 | 1;
}

/**
 * Returns the start of day (midnight) for a given date.
 * Used for day-level date comparisons.
 */
const startOfDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Generates an array of 42 dates (6 weeks) for the calendar grid,
 * starting from the first day of the week before the first day of the month.
 * @param date - The date representing the month to generate
 * @param weekStartsOn - 0 for Sunday, 1 for Monday
 */
const getSixWeeksMergedDaysInMonth = (date: Date, weekStartsOn: 0 | 1): Date[] => {
  const { monthCache, setMonthCache } = useDatePicker();
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
  const [showMonthSelector, setShowMonthSelector] = createSignal(false);
  const [showYearSelector, setShowYearSelector] = createSignal(false);
  const [customYear, setCustomYear] = createSignal('');

  const days = createMemo(() =>
    getSixWeeksMergedDaysInMonth(props.currentDate(), props.weekStartsOn),
  );

  // Get day headers in correct order based on weekStartsOn
  const dayHeaders = createMemo(() => {
    const allDays = getDaysShort(props.locale); // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    if (props.weekStartsOn === 0) {
      // Rotate to start from Sunday: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
      return [allDays[6], ...allDays.slice(0, 6)];
    }
    return allDays;
  });

  const handleDateClick = (date: Date) => {
    if (props.isDateDisabled(date)) return;
    props.selectDate(date);
  };

  const navigateMonth = (direction: number) => {
    props.setCurrentDate(addMonths(props.currentDate(), direction));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === props.currentDate().getMonth();
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(props.currentDate());
    newDate.setMonth(monthIndex);
    props.setCurrentDate(newDate);
    setShowMonthSelector(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(props.currentDate());
    newDate.setFullYear(year);
    props.setCurrentDate(newDate);
    setShowYearSelector(false);
  };

  const handleCustomYearSubmit = (e: Event) => {
    e.preventDefault();
    const year = parseInt(customYear());
    if (!isNaN(year) && year >= MIN_YEAR) {
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
  const isDisabled = (date: Date) => props.isDateDisabled(date);
  const isToday = (date: Date) => isSameDay(date, new Date());

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
      ref={props.ref}
      class={twMerge(
        'w-full focus:outline-none md:w-[292px] md:min-w-[292px]',
        props.calendarClass,
      )}
      role="grid"
      aria-label="Calendar"
      tabIndex={0}
      onKeyDown={(e) => props.onKeyDown?.(e)}
    >
      <div class="flex items-center space-x-1.5 rounded-md border border-gray-300 px-2 py-1.5 dark:border-gray-700">
        <Show when={!showMonthSelector() && !showYearSelector()}>
          <div class="flex-none">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              aria-label="Previous month"
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              <ChevronLeftIcon class="size-5" />
            </button>
          </div>
        </Show>
        <div class="flex flex-1 items-center space-x-1.5">
          <div class="w-1/2">
            <button
              type="button"
              onClick={() => {
                setShowYearSelector(false);
                setShowMonthSelector(!showMonthSelector());
              }}
              aria-label="Select month"
              aria-expanded={showMonthSelector()}
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] uppercase tracking-wide transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              {getMonthsShort(props.locale)[props.currentDate().getMonth()]}
            </button>
          </div>
          <div class="w-1/2">
            <button
              type="button"
              onClick={() => {
                setShowMonthSelector(false);
                setShowYearSelector(!showYearSelector());
              }}
              aria-label="Select year"
              aria-expanded={showYearSelector()}
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] uppercase tracking-wide transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              {props.currentDate().getFullYear()}
            </button>
          </div>
        </div>
        <Show when={!showMonthSelector() && !showYearSelector()}>
          <div class="flex-none">
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              aria-label="Next month"
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
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
              class="grid grid-cols-7 border-b border-gray-300 py-2 dark:border-gray-700"
              role="row"
            >
              <For each={dayHeaders()}>
                {(day) => (
                  <div
                    class="text-center capitalize tracking-wide text-gray-500 dark:text-gray-400"
                    role="columnheader"
                    aria-label={day}
                  >
                    {day}
                  </div>
                )}
              </For>
            </div>
            <div class="mt-1 grid grid-cols-7 gap-x-0.5 gap-y-0.5" role="rowgroup">
              <For each={days()}>
                {(date) => {
                  // These are static per date item
                  const selected = isSelected(date);
                  const disabled = isDisabled(date);
                  const rangeState = rangeSelection(date);
                  const inCurrentMonth = isInCurrentMonth(date);
                  const today = isToday(date);
                  const inRange = isInDateRange(date);
                  const dateISO = toISO(date);

                  return (
                    <button
                      type="button"
                      onClick={() => handleDateClick(date)}
                      disabled={disabled}
                      role="gridcell"
                      aria-label={getDateAriaLabel(date)}
                      aria-selected={selected || rangeState.start || rangeState.end}
                      aria-disabled={disabled}
                      tabIndex={focusedDateISO() === dateISO ? 0 : -1}
                      class="flex h-10 w-10 cursor-pointer items-center justify-center"
                      classList={{
                        'text-gray-400': !inCurrentMonth,
                        'text-blue-500': today && !selected && inCurrentMonth,
                        'bg-blue-500 text-white font-medium rounded-lg':
                          selected && inCurrentMonth,
                        'bg-blue-500 text-white font-medium rounded-l-lg rounded-r-none':
                          rangeState.start && inCurrentMonth && !selected,
                        'bg-blue-500 text-white font-medium rounded-r-lg rounded-l-none':
                          rangeState.end && inCurrentMonth && !selected,
                        'bg-blue-100 dark:bg-blue-900/40':
                          inRange && !selected && inCurrentMonth,
                        'cursor-not-allowed! opacity-50': disabled,
                        'border-2 border-gray-700 border-dashed':
                          focusedDateISO() === dateISO,
                        'transition-[scale] hover:scale-[1.5]':
                          !selected &&
                          !inRange &&
                          !rangeState.start &&
                          !rangeState.end &&
                          !disabled,
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                }}
              </For>
            </div>
          </div>
        }
      >
        <Match when={showMonthSelector()}>
          <div class="px-0.5 sm:px-2" role="listbox" aria-label="Select month">
            <div class="mb-[3px] mt-2 grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getMonthsShort(props.locale)}>
                {(month, index) => (
                  <button
                    type="button"
                    onClick={() => handleMonthSelect(index())}
                    role="option"
                    aria-selected={index() === props.currentDate().getMonth()}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 uppercase tracking-wide transition-all duration-100 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700',
                      index() === props.currentDate().getMonth()
                        ? 'bg-gray-50 font-semibold dark:bg-gray-700'
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
          <div class="px-0.5 sm:px-2" role="listbox" aria-label="Select year">
            <div class="mb-[3px] mt-2 grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getYearRange()}>
                {(year) => (
                  <button
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    role="option"
                    aria-selected={year === props.currentDate().getFullYear()}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 uppercase tracking-wide transition-all duration-100 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700',
                      year === props.currentDate().getFullYear()
                        ? 'bg-gray-50 font-semibold dark:bg-gray-700'
                        : '',
                    )}
                  >
                    {year}
                  </button>
                )}
              </For>
            </div>
          </div>
          <form onSubmit={handleCustomYearSubmit} class="mt-[9px] flex w-full gap-1">
            <NumberInput
              value={customYear()}
              onChange={(e) => setCustomYear(e.currentTarget.value)}
              placeholder="20..."
              min={MIN_YEAR}
              aria-label="Enter custom year"
            />
            <Button type="submit" size="md" aria-label="Confirm year">
              <CheckIcon class="size-5" />
            </Button>
          </form>
        </Match>
      </Switch>
    </div>
  );
};

/**
 * Props for the internal TimePicker component.
 */
interface TimePickerProps {
  hour: () => number;
  minute: () => number;
  second: () => number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onSecondChange: (second: number) => void;
  onSubmit: () => void;
  format: '12h' | '24h';
  minuteStep: number;
  secondStep: number;
}

/**
 * Internal time picker component for DatePicker.
 * Uses NumberInput components for hour, minute, and second selection.
 */
const TimePicker = (props: TimePickerProps) => {
  const is12h = () => props.format === '12h';
  const [period, setPeriod] = createSignal<'AM' | 'PM'>('AM');

  // Update period when hour changes
  createEffect(() => {
    setPeriod(props.hour() >= 12 ? 'PM' : 'AM');
  });

  const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];

  // Get display hour for 12h format
  const displayHour = () => {
    if (is12h()) {
      const h = props.hour() % 12;
      return h.toString();
    }
    return props.hour().toString() ?? undefined;
  };

  const handleHourChange = (value: string) => {
    const num = parseInt(value, 10);
    if (is12h()) {
      // Convert 12h to 24h
      const isPM = period() === 'PM';
      let hour24 = num;
      if (isPM && num < 12) hour24 = num + 12;
      else if (!isPM && num === 0) hour24 = 0;
      else if (!isPM && num >= 12) hour24 = num - 12;
      props.onHourChange(hour24);
    } else {
      props.onHourChange(num);
    }
  };

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as 'AM' | 'PM';
    setPeriod(newPeriod);
    const currentHour = props.hour();
    if (newPeriod === 'PM' && currentHour < 12) {
      props.onHourChange(currentHour + 12);
    } else if (newPeriod === 'AM' && currentHour >= 12) {
      props.onHourChange(currentHour - 12);
    }
  };

  return (
    <div class="flex items-center gap-2 border-t border-gray-300 pt-3 dark:border-gray-700">
      <div class="flex w-fit items-center justify-center gap-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
        <NumberInput
          value={displayHour()}
          sizing="sm"
          onChange={(e) => handleHourChange(e.target.value)}
          placeholder="00"
          style={{
            border: 'none',
            'background-color': 'transparent',
            'text-align': 'center',
          }}
          min={is12h() ? 1 : 0}
          max={is12h() ? 12 : 23}
          class="w-10"
          aria-label="Hour"
        />
        <span class="font-medium text-gray-400 dark:text-gray-500">:</span>
        <NumberInput
          value={props.minute()}
          sizing="sm"
          onChange={(e) => props.onMinuteChange(parseInt(e.target.value))}
          placeholder="00"
          style={{
            border: 'none',
            'background-color': 'transparent',
            'text-align': 'center',
          }}
          min={0}
          max={59}
          step={props.minuteStep}
          class="w-10"
          aria-label="Minute"
        />
        <span class="font-medium text-gray-400 dark:text-gray-500">:</span>
        <NumberInput
          value={props.second()}
          sizing="sm"
          onChange={(e) => props.onSecondChange(parseInt(e.target.value))}
          placeholder="00"
          style={{
            border: 'none',
            'background-color': 'transparent',
            'text-align': 'center',
          }}
          min={0}
          max={59}
          step={props.secondStep}
          class="w-10"
          aria-label="Second"
        />
        <Show when={is12h()}>
          <span class="h-5 w-1 bg-gray-200 dark:bg-gray-700" />
          <Select
            options={periodOptions}
            value={period()}
            onSelect={(opt) => opt && handlePeriodChange(opt.value)}
            aria-label="AM/PM"
            sizing="sm"
            fitContent={true}
            style={{ border: 'none', 'background-color': 'transparent' }}
          />
        </Show>
      </div>
      <div>
        <Button onClick={props.onSubmit} size="sm">
          Done
        </Button>
      </div>
    </div>
  );
};

/**
 * Props for the internal Shortcuts component.
 */
interface ShortcutsProps {
  shortcuts: DatePickerShortcut[];
  onSelect: (value: { date?: string; startDate?: string; endDate?: string }) => void;
  type: () => DatePickerType;
}

/**
 * Internal shortcuts panel component for DatePicker.
 * Displays quick selection buttons on the left side of the calendar.
 */
const Shortcuts = (props: ShortcutsProps) => {
  // Filter shortcuts based on selection type
  const filteredShortcuts = createMemo(() => {
    return props.shortcuts.filter((shortcut) => {
      const value = shortcut.getValue();
      const isSingleShortcut = value.date && !value.startDate && !value.endDate;
      const isRangeShortcut = value.startDate && value.endDate;

      // For single/multiple type, show only single-date shortcuts
      if (props.type() === 'single' || props.type() === 'multiple') {
        return isSingleShortcut;
      }
      // For range type, show only range shortcuts
      if (props.type() === 'range') {
        return isRangeShortcut;
      }
      return true;
    });
  });

  return (
    <div class="flex min-w-[120px] flex-col gap-1 border-r border-gray-300 pr-3 dark:border-gray-700">
      <For each={filteredShortcuts()}>
        {(shortcut) => (
          <button
            type="button"
            onClick={() => props.onSelect(shortcut.getValue())}
            class="rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:bg-blue-100/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            {shortcut.label}
          </button>
        )}
      </For>
    </div>
  );
};

/**
 * DatePicker component for selecting dates with calendar popup.
 * Supports single date, multiple dates, and date range selection.
 *
 * @example Single date selection
 * ```tsx
 * const [date, setDate] = createSignal<DateValue>({});
 *
 * <DatePicker
 *   type="single"
 *   locale="en-US"
 *   value={date()}
 *   onChange={setDate}
 * />
 * ```
 *
 * @example Date range selection
 * ```tsx
 * <DatePicker
 *   type="range"
 *   locale="en-US"
 *   minDate="2024-01-01"
 *   maxDate="2024-12-31"
 *   onChange={(value) => console.log(value.startDate, value.endDate)}
 * />
 * ```
 */
const DatePicker = (props: DatePickerProps): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [focusedDate, setFocusedDate] = createSignal<Date | null>(null);
  const [datesObjectValue, setDatesObjectValue] = createStore<DateValue>({});
  const [hour, setHour] = createSignal(0);
  const [minute, setMinute] = createSignal(0);
  const [second, setSecond] = createSignal(0);

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>();
  const [calendarRef, setCalendarRef] = createSignal<HTMLDivElement | undefined>();

  const { locale, shortcuts: contextShortcuts } = useDatePicker();

  const helperId = createUniqueId();

  const type = () => props.type || 'single';
  const displayFormat = () => props.displayFormat || 'DD/MM/YYYY';
  const minDate = () => (props.minDate ? parseDate(props.minDate) : undefined);

  // Time picker props
  const showTime = () => props.showTime && props.type === 'single';
  const timeFormat = () => props.timeFormat ?? '24h';
  const minuteStep = () => props.minuteStep ?? 1;
  const secondStep = () => props.secondStep ?? 1;
  const maxDate = () => (props.maxDate ? parseDate(props.maxDate) : undefined);

  // Shortcuts
  const showShortcuts = () => props.showShortcuts ?? false;
  const shortcuts = () => props.shortcuts ?? contextShortcuts;

  createEffect(() => {
    if (!props.value) {
      return;
    }

    // Sync time values from props
    if (props.value.hour !== undefined) setHour(props.value.hour);
    if (props.value.minute !== undefined) setMinute(props.value.minute);
    if (props.value.second !== undefined) setSecond(props.value.second);

    switch (type()) {
      case 'single':
        if (props.value.date && isDateValid(props.value.date)) {
          setDatesObjectValue({
            date: toISO(parseDate(props.value.date)),
            hour: props.value.hour,
            minute: props.value.minute,
            second: props.value.second,
          });
          setCurrentDate(parseDate(props.value.date));
        }
        break;
      case 'multiple':
        if (props.value.multipleDates && props.value.multipleDates.every(isDateValid)) {
          setDatesObjectValue({
            multipleDates: props.value.multipleDates.map((date) =>
              toISO(parseDate(date)),
            ),
          });
          if (props.value.multipleDates?.length > 0)
            setCurrentDate(parseDate(props.value.multipleDates[0]));
        }
        break;
      case 'range':
        if (
          props.value.startDate &&
          props.value.endDate &&
          isDateValid(props.value.startDate) &&
          isDateValid(props.value.endDate)
        ) {
          setDatesObjectValue({
            startDate: toISO(parseDate(props.value.startDate)),
            endDate: toISO(parseDate(props.value.endDate)),
          });
          setCurrentDate(parseDate(props.value.startDate));
        }
        break;
    }
  });

  /**
   * Notifies parent of value changes.
   */
  const notifyChange = (value: DateValue) => {
    props.onChange?.(value);
  };

  /**
   * Handles hour change from time picker (does not fire onChange).
   */
  const handleHourChange = (newHour: number) => {
    setHour(newHour);
  };

  /**
   * Handles minute change from time picker (does not fire onChange).
   */
  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
  };

  /**
   * Handles second change from time picker (does not fire onChange).
   */
  const handleSecondChange = (newSecond: number) => {
    setSecond(newSecond);
  };

  /**
   * Handles time picker submit - fires onChange with complete date/time value.
   */
  const handleTimeSubmit = () => {
    if (datesObjectValue.date) {
      const newValue: DateValue = {
        date: datesObjectValue.date,
        hour: hour(),
        minute: minute(),
        second: second(),
      };
      setDatesObjectValue(newValue);
      notifyChange(newValue);
      setIsOpen(false);
    }
  };

  const selectDate = (date: Date) => {
    const dateISO = toISO(date);

    switch (type()) {
      case 'single': {
        if (showTime()) {
          // When time picker is shown, just update date selection
          // User will confirm with submit button
          setDatesObjectValue({
            date: dateISO,
            hour: hour(),
            minute: minute(),
            second: second(),
          });
        } else {
          const newValue: DateValue = { date: dateISO };
          setDatesObjectValue(newValue);
          notifyChange(newValue);
          setIsOpen(false);
        }
        break;
      }
      case 'multiple': {
        let newDates: string[];
        if (datesObjectValue.multipleDates?.includes(dateISO)) {
          newDates = datesObjectValue.multipleDates.filter((d) => d !== dateISO);
        } else {
          newDates = [...(datesObjectValue.multipleDates || []), dateISO];
        }
        setDatesObjectValue('multipleDates', newDates);
        notifyChange({ multipleDates: newDates });
        break;
      }
      case 'range': {
        if (
          !datesObjectValue.startDate ||
          (datesObjectValue.startDate && datesObjectValue.endDate)
        ) {
          const newValue = { startDate: dateISO, endDate: undefined };
          setDatesObjectValue(newValue);
          notifyChange(newValue);
        } else if (datesObjectValue.startDate && !datesObjectValue.endDate) {
          const startDateParsed = parseDate(datesObjectValue.startDate);
          let newValue: DateValue;
          if (date < startDateParsed) {
            newValue = {
              startDate: dateISO,
              endDate: datesObjectValue.startDate,
            };
          } else {
            newValue = {
              startDate: datesObjectValue.startDate,
              endDate: dateISO,
            };
          }
          setDatesObjectValue(newValue);
          notifyChange(newValue);
          setIsOpen(false);
        }
        break;
      }
    }

    setCurrentDate(date);
  };

  /**
   * Handles shortcut selection from the shortcuts panel.
   */
  const handleShortcutSelect = (value: {
    date?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (value.date) {
      // Single date shortcut
      const newValue: DateValue = showTime()
        ? { date: value.date, hour: hour(), minute: minute(), second: second() }
        : { date: value.date };
      setDatesObjectValue(newValue);
      setCurrentDate(parseDate(value.date));
      if (showTime()) {
        // When time picker is shown, don't fire onChange - wait for submit
      } else {
        notifyChange(newValue);
        setIsOpen(false);
      }
    } else if (value.startDate && value.endDate) {
      // Range shortcut
      const newValue: DateValue = {
        startDate: value.startDate,
        endDate: value.endDate,
      };
      setDatesObjectValue(newValue);
      notifyChange(newValue);
      setCurrentDate(parseDate(value.startDate));
      setIsOpen(false);
    }
  };

  const isSingletonDateSelected = (date: Date): boolean => {
    switch (type()) {
      case 'single':
        return datesObjectValue.date
          ? isSameDay(date, parseDate(datesObjectValue.date))
          : false;
      case 'multiple':
        return datesObjectValue.multipleDates
          ? datesObjectValue.multipleDates.some((d) => isSameDay(date, parseDate(d)))
          : false;
      case 'range':
        if (!datesObjectValue.startDate || !datesObjectValue.endDate) return false;
        return (
          isSameDay(date, parseDate(datesObjectValue.startDate)) &&
          isSameDay(date, parseDate(datesObjectValue.endDate))
        );
      default:
        return false;
    }
  };

  const isRangeDateSelected = (date: Date): { start: boolean; end: boolean } => {
    if (type() !== 'range' || datesObjectValue.startDate === datesObjectValue.endDate)
      return { start: false, end: false };
    return {
      start: datesObjectValue.startDate
        ? isSameDay(date, parseDate(datesObjectValue.startDate))
        : false,
      end: datesObjectValue.endDate
        ? isSameDay(date, parseDate(datesObjectValue.endDate))
        : false,
    };
  };

  const isDateInRange = (date: Date): boolean => {
    if (type() !== 'range') return false;
    if (!datesObjectValue.startDate || !datesObjectValue.endDate) return false;
    return isInRange(date, datesObjectValue.startDate, datesObjectValue.endDate);
  };

  /**
   * Checks if a date is disabled based on min/max constraints.
   * Compares at day level to ignore time components.
   */
  const isDateDisabled = (date: Date): boolean => {
    const min = minDate();
    const max = maxDate();
    const dayStart = startOfDay(date);

    if (min && dayStart < startOfDay(min)) return true;
    if (max && dayStart > startOfDay(max)) return true;
    return false;
  };

  /**
   * Formats time for display based on format setting.
   */
  const formatTime = (h: number, m: number, s: number): string => {
    const minStr = m.toString().padStart(2, '0');
    const secStr = s.toString().padStart(2, '0');
    if (timeFormat() === '12h') {
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minStr}:${secStr} ${period}`;
    }
    return `${h.toString().padStart(2, '0')}:${minStr}:${secStr}`;
  };

  const getDisplayValue = (): string => {
    switch (type()) {
      case 'single': {
        if (!datesObjectValue.date) return '';
        const dateStr = formatDate(datesObjectValue.date, displayFormat());
        if (
          showTime() &&
          datesObjectValue.hour !== undefined &&
          datesObjectValue.minute !== undefined &&
          datesObjectValue.second !== undefined
        ) {
          return `${dateStr} ${formatTime(datesObjectValue.hour, datesObjectValue.minute, datesObjectValue.second)}`;
        }
        return dateStr;
      }
      case 'multiple':
        if (
          !datesObjectValue.multipleDates ||
          datesObjectValue.multipleDates.length === 0
        )
          return '';
        return datesObjectValue.multipleDates
          .map((d) => formatDate(d, displayFormat()))
          .reverse()
          .join(' • ');
      case 'range':
        if (datesObjectValue.startDate && datesObjectValue.endDate) {
          return `${formatDate(datesObjectValue.startDate, displayFormat())} - ${formatDate(datesObjectValue.endDate, displayFormat())}`;
        }
        return '';
    }
  };

  const handleInputClick = () => {
    if (!props.disabled && !props.isLoading) {
      setIsOpen(true);
      const initialFocusDate =
        (datesObjectValue.date && parseDate(datesObjectValue.date)) ||
        (datesObjectValue.startDate && parseDate(datesObjectValue.startDate)) ||
        (datesObjectValue.multipleDates?.[0] &&
          parseDate(datesObjectValue.multipleDates[0])) ||
        new Date();
      if (!focusedDate()) setFocusedDate(initialFocusDate);
      setTimeout(() => calendarRef()?.focus(), 10);
    }
  };

  /**
   * Moves the focused date and updates the view month if needed.
   */
  const moveFocusedDate = (days: number) => {
    const current = focusedDate() || currentDate();
    const newDate = new Date(current);
    newDate.setDate(newDate.getDate() + days);
    setFocusedDate(newDate);

    // Update view if focused date moves to a different month
    if (
      newDate.getMonth() !== currentDate().getMonth() ||
      newDate.getFullYear() !== currentDate().getFullYear()
    ) {
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
  };

  /**
   * Handles keyboard navigation within the calendar.
   */
  const handleCalendarKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setFocusedDate(null);
        inputRef()?.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocusedDate(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocusedDate(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocusedDate(-7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocusedDate(7);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const dateToSelect = focusedDate() || currentDate();
        if (!isDateDisabled(dateToSelect)) {
          selectDate(dateToSelect);
        }
        break;
      }
    }
  };

  /**
   * Handles keyboard events on the input field.
   */
  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!props.disabled && !props.isLoading) {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const { isVisible, isMounted } = createPresence(() => isOpen(), {
    transitionDuration: 200,
  });

  const { refs, floatingStyles, container } = useFloating({
    get placement() {
      return `${props.popoverPosition ?? 'bottom'}-start` as Placement;
    },
    isOpen: isMounted,
    offset: 4,
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const floating = refs.floating();
      const reference = refs.reference();
      const target = event.target as HTMLElement;

      // Check if click is inside a Select dropdown (rendered in portal)
      const isInsideSelectDropdown = target.closest('[role="listbox"]');

      if (
        floating &&
        !floating.contains(target) &&
        reference &&
        reference instanceof HTMLElement &&
        !reference.contains(target) &&
        !isInsideSelectDropdown
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  const focusInput = () => {
    const input = inputRef();
    if (input) {
      input.focus();
    }
  };

  return (
    <div class={twMerge('relative w-full text-gray-700 dark:text-gray-200')}>
      <Show when={props.label}>
        <div class="mb-1 block">
          <Label value={props.label} color="gray" />
          <Show when={props.required}>
            <span class="ml-0.5 font-medium text-red-500">*</span>
          </Show>
        </div>
      </Show>
      <div
        ref={refs.setReference}
        onClick={handleInputClick}
        class="relative w-full"
        role="combobox"
        aria-expanded={isOpen()}
        aria-haspopup="dialog"
        aria-label={props.label || 'Select date'}
      >
        <TextInput
          ref={setInputRef}
          title={getDisplayValue()}
          isLoading={props.isLoading}
          disabled={props.disabled}
          value={props.displayValue ?? getDisplayValue()}
          placeholder={props.placeholder ?? displayFormat()}
          class={twMerge('w-full', props.inputClass)}
          required={props.required}
          onKeyDown={handleInputKeyDown}
          aria-describedby={props.helperText ? helperId : undefined}
          style={{
            'caret-color': 'transparent',
            'padding-right': '36px',
            cursor: props.disabled || props.isLoading ? 'not-allowed' : 'pointer',
            ...(typeof props.style === 'object' && props.style !== null
              ? props.style
              : {}),
          }}
        />
        <Show
          when={
            !props.displayValue &&
            getDisplayValue() &&
            !props.disabled &&
            !props.isLoading
          }
          fallback={
            <ChevronDownButton
              onFocus={focusInput}
              disabled={props.disabled || props.isLoading}
            />
          }
        >
          <ClearContentButton
            onClick={() => {
              setDatesObjectValue(reconcile({}));
              focusInput();
            }}
          />
        </Show>
      </div>

      <Show when={isMounted()}>
        <Portal mount={container()}>
          <div
            ref={refs.setFloating}
            role="dialog"
            aria-label="Choose date"
            aria-modal="true"
            style={{
              ...floatingStyles(),
              opacity: isVisible() ? '1' : '0',
              scale: isVisible() ? 1 : 0.8,
              'transition-property': 'opacity, scale',
              'transition-duration': '.2s',
              'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
            }}
            class={twMerge(
              'z-50 w-fit rounded-lg border border-gray-300 bg-white px-2.5 py-3 dark:border-gray-700 dark:bg-gray-900 dark:text-white',
            )}
          >
            <div class="flex gap-3">
              <Show when={showShortcuts() && shortcuts().length > 0}>
                <Shortcuts
                  shortcuts={shortcuts()}
                  onSelect={handleShortcutSelect}
                  type={type}
                />
              </Show>
              <div>
                <Calendar
                  ref={setCalendarRef}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  selectDate={selectDate}
                  type={type}
                  locale={props.locale || locale}
                  isSingletonDateSelected={isSingletonDateSelected}
                  isRangeDateSelected={isRangeDateSelected}
                  isDateInRange={isDateInRange}
                  isDateDisabled={isDateDisabled}
                  minDate={minDate()}
                  maxDate={maxDate()}
                  calendarClass={props.calendarClass}
                  onKeyDown={handleCalendarKeyDown}
                  focusedDate={focusedDate}
                  weekStartsOn={props.weekStartsOn ?? 1}
                />
                <Show when={showTime()}>
                  <TimePicker
                    hour={hour}
                    minute={minute}
                    second={second}
                    onHourChange={handleHourChange}
                    onMinuteChange={handleMinuteChange}
                    onSecondChange={handleSecondChange}
                    onSubmit={handleTimeSubmit}
                    format={timeFormat()}
                    minuteStep={minuteStep()}
                    secondStep={secondStep()}
                  />
                </Show>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
      <Show when={props.helperText}>
        <HelperText id={helperId} content={props.helperText as string} color="gray" />
      </Show>
    </div>
  );
};

export default DatePicker;
