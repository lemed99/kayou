import {
  For,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
} from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { Portal } from 'solid-js/web';

import { type BackgroundScrollBehavior, type Placement, useFloating } from '@kayou/hooks';
import { Edit02Icon, FlipBackwardIcon, XIcon } from '@kayou/icons';
import { createPresence } from '@solid-primitives/presence';
import { twMerge } from 'tailwind-merge';

import { ChevronDownButton, ClearContentButton } from '../../shared';
import Button from '../Button';
import HelperText from '../HelperText';
import Label from '../Label';
import TextInput from '../TextInput';
import TimePicker from '../TimePicker';
import { formatTime as formatTimeUtil } from '../TimePicker/timeUtils';
import Calendar from './Calendar';
import type { DatePickerShortcut } from './DatePickerContext';
import Shortcuts from './Shortcuts';
import {
  addMonths,
  formatDate,
  isDateValid,
  isInRange,
  isSameDay,
  parseDate,
  startOfDay,
  toISO,
} from './dates';
import { useDatePicker } from './useDatePicker';

export type { DatePickerShortcut };

export interface DatePickerLabels {
  cancel: string;
  apply: string;
}

export const DEFAULT_DATE_PICKER_LABELS: DatePickerLabels = {
  cancel: 'Cancel',
  apply: 'Apply',
};

export interface DatePickerAriaLabels {
  previousMonth: string;
  nextMonth: string;
  selectMonth: string;
  selectYear: string;
  enterCustomYear: string;
  confirmYear: string;
  customYearGroup: string;
  hour: string;
  minute: string;
  second: string;
  chooseDate: string;
  selectDate: string;
  calendar: string;
  shortcuts: string;
  timePicker: string;
  dateNotAvailable: string;
  dateBeforeMin: string;
  dateAfterMax: string;
  rangeStartSelected: string;
  monthSelectorOpened: string;
  yearSelectorOpened: string;
  rangeSelectedForEdit: string;
  startTime: string;
  endTime: string;
  rangeEditCanceled: string;
}

export const DEFAULT_DATE_PICKER_ARIA_LABELS: DatePickerAriaLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  selectMonth: 'Select month',
  selectYear: 'Select year',
  enterCustomYear: 'Enter custom year',
  confirmYear: 'Confirm year',
  customYearGroup: 'Enter a custom year',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  chooseDate: 'Choose date',
  selectDate: 'Select date',
  calendar: 'Calendar',
  shortcuts: 'Quick date selection',
  timePicker: 'Time selection',
  dateNotAvailable: 'This date is not available',
  dateBeforeMin: 'This date is before the minimum allowed date',
  dateAfterMax: 'This date is after the maximum allowed date',
  rangeStartSelected: 'Start date selected. Now choose an end date.',
  monthSelectorOpened: 'Month selector opened. Use arrow keys to navigate.',
  yearSelectorOpened: 'Year selector opened. Use arrow keys to navigate.',
  rangeSelectedForEdit: 'Range selected for edition',
  startTime: 'Start time',
  endTime: 'End time',
  rangeEditCanceled: 'Range Editing canceled',
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

type DateStruct = {
  /** Selected date for single mode (ISO format). */
  date: string;
  /** Selected hour (0-23). */
  hour?: number;
  /** Selected minute (0-59). */
  minute?: number;
  /** Selected second (0-59). */
  second?: number;
};

type RangeValue = {
  /** Range Id */
  id: string;
  /** Start date for range mode (ISO format). */
  startDate: string;
  /** End date for range mode (ISO format). */
  endDate: string;
};

/**
 * Value object for the DatePicker component.
 */
export interface DateValue {
  /** Selected date for single mode (ISO format). */
  date?: string;
  /** Start date for range mode (ISO format). */
  startDate?: DateStruct;
  /** End date for range mode (ISO format). */
  endDate?: DateStruct;
  /** Array of selected dates for multiple mode (ISO format). */
  multipleDates?: string[];
  /** Array of selacted dates ranges for multiples range mode (ISO format) */
  multipleRanges?: RangeValue[];
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
export type DatePickerType = 'single' | 'multiple' | 'range' | 'multipleRange';

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
  /** Minimum selectable multiples dates or ranges. */
  minSelectable?: number;
  /** Maximum selectable multiples dates or ranges. */
  maxSelectable?: number;
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
  /** Show seconds input in time picker. @default false */
  showSeconds?: boolean;
  /** Show footer with Cancel/Apply buttons. When true, date selection doesn't trigger onChange until Apply is clicked. */
  showFooter?: boolean;
  /** Show shortcuts panel on the left side of the calendar. */
  showShortcuts?: boolean;
  /** Custom shortcuts to use for this instance. Overrides provider shortcuts. */
  shortcuts?: DatePickerShortcut[];
  /** Day the week starts on. 0 = Sunday, 1 = Monday. @default 1 */
  weekStartsOn?: 0 | 1;
  /** How to handle background scroll when calendar is open. @default 'prevent' */
  backgroundScrollBehavior?: BackgroundScrollBehavior;
  /** Visible text labels for UI elements. */
  labels?: Partial<DatePickerLabels>;
  /** Aria labels for accessibility. */
  ariaLabels?: Partial<DatePickerAriaLabels>;
  /** Callback fired when the input gains focus. */
  onFocus?: () => void;
  /** Callback fired when the input loses focus. */
  onBlur?: () => void;
  /** Name attribute for form integration. */
  name?: string;
  /** Function to determine if a specific date should be disabled. */
  disabledDates?: (date: Date) => boolean;
}

// CalendarProps re-exported from Calendar.tsx
export type { CalendarProps } from './Calendar';

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
  const [time, setTime] = createStore({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [startTime, setStartTime] = createStore({
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [endTime, setEndTime] = createStore({
    hour: 0,
    minute: 0,
    second: 0,
  });

  const [newRangeId, setNewRangeId] = createSignal<string | null>(null);
  const [editingRangeId, setEditingRangeId] = createSignal<string | null>(null);

  const [hoveredDate, setHoveredDate] = createSignal<Date | null>(null);
  const [usingKeyboard, setUsingKeyboard] = createSignal(false);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | undefined>();
  const [announcement, setAnnouncement] = createSignal('');

  const { locale, shortcuts: contextShortcuts } = useDatePicker();

  const l = createMemo(() => ({ ...DEFAULT_DATE_PICKER_LABELS, ...props.labels }));
  const a = createMemo(() => ({
    ...DEFAULT_DATE_PICKER_ARIA_LABELS,
    ...props.ariaLabels,
  }));

  const editingRange = createMemo(() => {
    const id = editingRangeId();
    return id
      ? (datesObjectValue.multipleRanges?.find((r) => r.id === id) ?? null)
      : null;
  });

  const helperId = createUniqueId();
  const dialogId = createUniqueId();

  const type = () => props.type || 'single';
  const displayFormat = () => props.displayFormat || 'DD/MM/YYYY';
  const minDate = () => (props.minDate ? parseDate(props.minDate) : undefined);

  // Time picker props
  const showTime = () =>
    props.showTime && (props.type === 'single' || props.type === 'range');
  const timeFormat = () => props.timeFormat ?? '24h';
  const minuteStep = () => props.minuteStep ?? 1;
  const secondStep = () => props.secondStep ?? 1;
  const maxDate = () => (props.maxDate ? parseDate(props.maxDate) : undefined);

  // Footer
  const showFooter = () => props.showFooter ?? false;
  const hasFooter = () => showFooter() || showTime();

  // Shortcuts
  const showShortcuts = () => props.showShortcuts ?? false;
  const shortcuts = () => props.shortcuts ?? contextShortcuts;

  createEffect(() => {
    if (!props.value) {
      return;
    }

    // Sync time values from props
    if (props.value.hour !== undefined) setTime('hour', props.value.hour);
    if (props.value.minute !== undefined) setTime('minute', props.value.minute);
    if (props.value.second !== undefined) setTime('second', props.value.second);

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
          isDateValid(props.value.startDate.date) &&
          isDateValid(props.value.endDate.date)
        ) {
          setDatesObjectValue({
            startDate: {
              date: toISO(parseDate(props.value.startDate.date)),
              hour: props.value.startDate.hour,
              minute: props.value.startDate.minute,
              second: props.value.startDate.second,
            },
            endDate: {
              date: toISO(parseDate(props.value.endDate.date)),
              hour: props.value.endDate.hour,
              minute: props.value.endDate.minute,
              second: props.value.endDate.second,
            },
          });
          setCurrentDate(parseDate(props.value.startDate.date));
          setStartTime({
            hour: props.value.startDate.hour,
            minute: props.value.startDate.minute,
            second: props.value.startDate.second,
          });
          setEndTime({
            hour: props.value.endDate.hour,
            minute: props.value.endDate.minute,
            second: props.value.endDate.second,
          });
        }
        break;
      case 'multipleRange':
        if (
          props.value.multipleRanges &&
          props.value.multipleRanges.every(
            (rangeValue) =>
              !!rangeValue.startDate &&
              !!rangeValue.endDate &&
              isDateValid(rangeValue.startDate) &&
              isDateValid(rangeValue.endDate),
          )
        ) {
          setDatesObjectValue({
            multipleRanges: props.value.multipleRanges.map((rangeValue) => ({
              id: rangeValue.id,
              startDate: rangeValue.startDate,
              endDate: rangeValue.endDate,
            })),
          });
        }
    }
  });

  /**
   * Closes the calendar, clears focused date, returns focus to input, and fires onBlur.
   */
  const closeCalendar = () => {
    setIsOpen(false);
    setFocusedDate(null);
    setHoveredDate(null);
    setEditingRangeId(null);
    setNewRangeId(null);
    inputRef()?.focus();
    props.onBlur?.();
  };

  /**
   * Builds the current value from the store state.
   */
  const buildCurrentValue = (): DateValue => {
    switch (type()) {
      case 'single': {
        const value: DateValue = { date: datesObjectValue.date };
        if (showTime()) {
          value.hour = time.hour;
          value.minute = time.minute;
          value.second = time.second;
        }
        return value;
      }
      case 'multiple':
        return { multipleDates: datesObjectValue.multipleDates };
      case 'range':
        if (datesObjectValue.startDate && datesObjectValue.endDate) {
          if (showTime()) {
            return {
              startDate: {
                date: datesObjectValue.startDate.date,
                hour: startTime.hour,
                minute: startTime.minute,
                second: startTime.second,
              },
              endDate: {
                date: datesObjectValue.endDate.date,
                hour: endTime.hour,
                minute: endTime.minute,
                second: endTime.second,
              },
            };
          }
        }
        return {
          startDate: datesObjectValue.startDate,
          endDate: datesObjectValue.endDate,
        };
      case 'multipleRange':
        return { multipleRanges: datesObjectValue.multipleRanges };
      default:
        return {};
    }
  };

  /**
   * Handles Cancel button click - resets to last committed value and closes.
   */
  const handleCancel = () => {
    // Reset store to the value from props (last committed value)
    if (props.value) {
      setDatesObjectValue(reconcile(props.value));
      if (props.value.hour !== undefined) setTime('hour', props.value.hour);
      if (props.value.minute !== undefined) setTime('minute', props.value.minute);
      if (props.value.second !== undefined) setTime('second', props.value.second);
    } else {
      setDatesObjectValue(reconcile({}));
      setTime(reconcile({ hour: 0, minute: 0, second: 0 }));
    }
    setEditingRangeId(null);
    setNewRangeId(null);
    closeCalendar();
  };

  /**
   * Handles Apply button click - fires onChange and closes.
   */
  const handleApply = () => {
    const value = buildCurrentValue();
    setDatesObjectValue(value);
    props.onChange?.(value);
    closeCalendar();
  };

  const selectDate = (date: Date) => {
    const dateISO = toISO(date);
    const dateLabel = date.toLocaleDateString(props.locale || locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    switch (type()) {
      case 'single': {
        if (showTime()) {
          // When time picker is shown, just update date selection
          // User will confirm with footer Apply button
          setDatesObjectValue({
            date: dateISO,
            hour: time.hour,
            minute: time.minute,
            second: time.second,
          });
          announce(`Selected ${dateLabel}`);
          focusCurrentDateButton();
        } else if (hasFooter()) {
          // When footer is shown, don't fire onChange or close — wait for Apply
          const newValue: DateValue = { date: dateISO };
          setDatesObjectValue(newValue);
          announce(`Selected ${dateLabel}`);
          focusCurrentDateButton();
        } else {
          const newValue: DateValue = { date: dateISO };
          setDatesObjectValue(newValue);
          props.onChange?.(newValue);
          announce(`Selected ${dateLabel}`);
          closeCalendar();
        }
        break;
      }
      case 'multiple': {
        let newDates: string[];
        if (datesObjectValue.multipleDates?.includes(dateISO)) {
          const atMinLimit =
            (datesObjectValue.multipleDates?.length ?? 0 - 1) === props.minSelectable;
          if (atMinLimit) {
            newDates = [...(datesObjectValue.multipleDates || [])];
            announce(
              `Limit of minimum ${props.maxSelectable} dates reached. Cannot deselect current date`,
            );
          } else {
            newDates = datesObjectValue.multipleDates.filter((d) => d !== dateISO);
            announce(`Deselected ${dateLabel}`);
          }
        } else {
          const atMaxLimit =
            (datesObjectValue.multipleDates?.length ?? 0 - 1) === props.maxSelectable;
          if (atMaxLimit) {
            newDates = [...(datesObjectValue.multipleDates || [])];
            announce(
              `Limit of maximum ${props.maxSelectable} dates reached. Cannot select a new one`,
            );
          } else {
            newDates = [...(datesObjectValue.multipleDates || []), dateISO];
            announce(`Selected ${dateLabel}`);
          }
        }
        setDatesObjectValue('multipleDates', newDates);
        if (!hasFooter()) {
          props.onChange?.({ multipleDates: newDates });
        }
        focusCurrentDateButton();
        break;
      }
      case 'range': {
        if (
          !datesObjectValue.startDate ||
          (datesObjectValue.startDate && datesObjectValue.endDate)
        ) {
          const newValue = { startDate: { date: dateISO }, endDate: undefined };
          setDatesObjectValue(newValue);
          if (!hasFooter() || !showTime()) {
            props.onChange?.(newValue);
          }
          announce(`Range start: ${dateLabel}. ${a().rangeStartSelected}`);
          focusCurrentDateButton();
        } else if (datesObjectValue.startDate && !datesObjectValue.endDate) {
          const startDateParsed = parseDate(datesObjectValue.startDate.date);
          let newValue: DateValue;
          if (date < startDateParsed) {
            newValue = {
              startDate: { date: dateISO },
              endDate: datesObjectValue.startDate,
            };
          } else {
            newValue = {
              startDate: datesObjectValue.startDate,
              endDate: { date: dateISO },
            };
          }
          if (showTime()) {
            newValue = {
              startDate: newValue.startDate
                ? {
                    ...newValue.startDate,
                    hour: startTime.hour,
                    minute: startTime.minute,
                    second: startTime.second,
                  }
                : newValue.startDate,
              endDate: newValue.endDate
                ? {
                    ...newValue.endDate,
                    hour: endTime.hour,
                    minute: endTime.minute,
                    second: endTime.second,
                  }
                : newValue.endDate,
            };
          }
          setDatesObjectValue(newValue);
          setHoveredDate(null);
          if (hasFooter() || showTime()) {
            announce(`Range end: ${dateLabel}. Range selected.`);
            focusCurrentDateButton();
          } else {
            props.onChange?.(newValue);
            announce(`Range end: ${dateLabel}. Range selected.`);
            closeCalendar();
          }
        }
        break;
      }
      case 'multipleRange': {
        const currentRanges = datesObjectValue.multipleRanges || [];
        const currentCount = currentRanges.length;
        const editingId = editingRangeId();
        const isEditing = !!editingId;

        // No active range selection in progress and no containing range → start new range
        if (!datesObjectValue.startDate || datesObjectValue.endDate) {
          if (!isEditing) {
            // Normal case : new range
            if (props.maxSelectable) {
              const atMaxLimit = currentCount >= props.maxSelectable;
              if (atMaxLimit) {
                announce(
                  `Maximum limit of ${props.maxSelectable} ranges reached. Cannot add a new range.`,
                );
                focusCurrentDateButton();
                break;
              }
            }

            const newRangeId = generateId();
            const newValue = {
              multipleRanges: datesObjectValue.multipleRanges
                ? [...(datesObjectValue.multipleRanges || [])]
                : undefined,
              startDate: { date: dateISO },
              endDate: undefined,
            };
            setDatesObjectValue(newValue);
            setNewRangeId(newRangeId);
            announce(`New range start: ${dateLabel}. ${a().rangeStartSelected}`);
            focusCurrentDateButton();
            break;
          } else {
            // editing mode : we keep editingId as newRangeId
            const newValue = {
              ...datesObjectValue,
              startDate: { date: dateISO },
              endDate: undefined,
            };
            setDatesObjectValue(newValue);

            announce(`New range start: ${dateLabel}. ${a().rangeStartSelected}`);
            focusCurrentDateButton();
            break;
          }
        }

        // Complete the in-progress range
        if (datesObjectValue.startDate && !datesObjectValue.endDate) {
          const startDateParsed = parseDate(datesObjectValue.startDate.date);

          let startDate: { date: string };
          let endDate: { date: string };

          if (date < startDateParsed) {
            startDate = { date: dateISO };
            endDate = datesObjectValue.startDate;
          } else {
            startDate = datesObjectValue.startDate;
            endDate = { date: dateISO };
          }

          // Remove placeholder if exists, add completed range
          const otherRanges = (datesObjectValue.multipleRanges || []).filter(
            (r) => r.id !== newRangeId(),
          );

          if (props.maxSelectable) {
            const atMaxLimit = otherRanges.length + 1 > props.maxSelectable;
            if (atMaxLimit) {
              announce(
                `Maximum limit of ${props.maxSelectable} ranges reached. Cannot add a new range.`,
              );
              setHoveredDate(null);
              setNewRangeId(null);
              focusCurrentDateButton();
              break;
            }
          }

          // check if new range contains existing ranges
          const existingRangesIncludedInNewRange = otherRanges.filter(
            (range) =>
              parseDate(startDate.date) <= parseDate(range.startDate) &&
              parseDate(endDate.date) >= parseDate(range.endDate),
          );

          //  if it contains existing ranges remove them
          if (existingRangesIncludedInNewRange.length > 0) {
            const newRange = {
              id: newRangeId()!,
              startDate: startDate.date,
              endDate: endDate.date,
            };

            const existingRangesIds = existingRangesIncludedInNewRange.map(
              (range) => range.id,
            );

            const rangesNotIncluded = otherRanges.filter(
              (range) => !existingRangesIds.includes(range.id),
            );

            const newValue = {
              multipleRanges: [...rangesNotIncluded, newRange],
              startDate: undefined,
              endDate: undefined,
            };
            setDatesObjectValue(newValue);
            setHoveredDate(null);
            setNewRangeId(null);
            setEditingRangeId(null); // get out of edit mode
            announce(`Range end: ${dateLabel}. Range completed.`);
            focusCurrentDateButton();
            break;
          }

          // If there are no strictly encompassed ranges, overlaps/contacts can still be merged.
          let mergedStartStr = startDate.date;
          let mergedEndStr = endDate.date;
          let mergedStart = parseDate(mergedStartStr);
          let mergedEnd = parseDate(mergedEndStr);

          const rangesToKeep: RangeValue[] = [];
          for (const range of otherRanges) {
            const rStart = parseDate(range.startDate);
            const rEnd = parseDate(range.endDate);

            const overlapOrTouch = mergedStart <= rEnd && mergedEnd >= rStart;
            if (overlapOrTouch) {
              if (rStart < mergedStart) {
                mergedStart = rStart;
                mergedStartStr = range.startDate;
              }
              if (rEnd > mergedEnd) {
                mergedEnd = rEnd;
                mergedEndStr = range.endDate;
              }
            } else {
              rangesToKeep.push(range);
            }
          }

          const newRange = {
            id: newRangeId()!,
            startDate: mergedStartStr,
            endDate: mergedEndStr,
          };

          const newValue = {
            multipleRanges: [...rangesToKeep, newRange],
            startDate: undefined,
            endDate: undefined,
          };

          setDatesObjectValue(newValue);
          setHoveredDate(null);
          setNewRangeId(null);
          setEditingRangeId(null); // get out of edit mode
          announce(`Range end: ${dateLabel}. Range completed.`);
          focusCurrentDateButton();

          if (!hasFooter()) {
            props.onChange?.(newValue);
          }
          break;
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
        ? { date: value.date, hour: time.hour, minute: time.minute, second: time.second }
        : { date: value.date };
      setDatesObjectValue(newValue);
      setCurrentDate(parseDate(value.date));
      if (!hasFooter()) {
        props.onChange?.(newValue);
        closeCalendar();
      }
    } else if (value.startDate && value.endDate) {
      // Range shortcut
      const newValue: DateValue = {
        startDate: { date: value.startDate },
        endDate: { date: value.endDate },
      };
      setDatesObjectValue(newValue);
      setCurrentDate(parseDate(value.startDate));
      if (hasFooter()) {
        // Wait for Apply
      } else {
        props.onChange?.(newValue);
        closeCalendar();
      }
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
          isSameDay(date, parseDate(datesObjectValue.startDate.date)) &&
          isSameDay(date, parseDate(datesObjectValue.endDate.date))
        );

      default:
        return false;
    }
  };

  const isRangeDateSelected = (date: Date): { start: boolean; end: boolean } => {
    const isNotRangetype = type() !== 'range' && type() !== 'multipleRange';

    if (
      isNotRangetype &&
      datesObjectValue.startDate?.date === datesObjectValue.endDate?.date
    ) {
      return { start: false, end: false };
    }

    if (type() === 'range') {
      return {
        start: datesObjectValue.startDate
          ? isSameDay(date, parseDate(datesObjectValue.startDate.date))
          : false,
        end: datesObjectValue.endDate
          ? isSameDay(date, parseDate(datesObjectValue.endDate.date))
          : false,
      };
    }

    if (type() === 'multipleRange') {
      const currentStart =
        datesObjectValue.startDate &&
        isSameDay(date, parseDate(datesObjectValue.startDate.date));
      const currentEnd =
        datesObjectValue.endDate &&
        isSameDay(date, parseDate(datesObjectValue.endDate.date));

      const uneditedRanges =
        datesObjectValue.multipleRanges?.filter((r) => r.id !== editingRangeId()) ?? [];

      const existingStart = uneditedRanges?.some((range) =>
        isSameDay(date, parseDate(range.startDate)),
      );

      const existingEnd = uneditedRanges.some((range) =>
        isSameDay(date, parseDate(range.endDate)),
      );

      return {
        start: !!currentStart || existingStart,
        end: !!currentEnd || existingEnd,
      };
    }

    return { start: false, end: false };
  };

  const isRangeDateInEdition = (date: Date): { start: boolean; end: boolean } => {
    if (
      type() !== 'multipleRange' &&
      datesObjectValue.startDate?.date === datesObjectValue.endDate?.date
    ) {
      return { start: false, end: false };
    }

    const rangeInEdition = datesObjectValue.multipleRanges?.find(
      (r) => r.id === editingRangeId(),
    );

    const start = rangeInEdition?.startDate
      ? isSameDay(date, parseDate(rangeInEdition?.startDate))
      : false;

    const end = rangeInEdition?.endDate
      ? isSameDay(date, parseDate(rangeInEdition?.endDate))
      : false;

    return {
      start: start,
      end: end,
    };
  };

  const isDateInRange = (date: Date): boolean => {
    if (type() !== 'range' && type() !== 'multipleRange') return false;

    if (type() === 'multipleRange') {
      const uneditedRanges =
        datesObjectValue.multipleRanges?.filter((r) => r.id !== editingRangeId()) ?? [];
      const inExisting =
        uneditedRanges.some((range) => isInRange(date, range.startDate, range.endDate)) ??
        false;

      if (datesObjectValue.startDate && datesObjectValue.endDate) {
        const inCurrent = isInRange(
          date,
          datesObjectValue.startDate.date,
          datesObjectValue.endDate.date,
        );
        return inExisting || inCurrent;
      }

      return inExisting;
    }

    if (!datesObjectValue.startDate || !datesObjectValue.endDate) return false;

    return isInRange(
      date,
      datesObjectValue.startDate.date,
      datesObjectValue.endDate.date,
    );
  };

  // Memoize preview range boundaries so each button only does a cheap Date comparison
  const previewRange = createMemo(() => {
    if (type() !== 'range' && type() !== 'multipleRange') return null;

    if (!datesObjectValue.startDate || datesObjectValue.endDate) return null;
    const hovered = hoveredDate();
    if (!hovered) return null;
    const start = parseDate(datesObjectValue.startDate.date);
    return hovered >= start ? { start, end: hovered } : { start: hovered, end: start };
  });

  const isDateInPreviewRange = (date: Date): boolean => {
    const range = previewRange();
    if (!range) return false;
    return date > range.start && date < range.end;
  };

  const isPreviewEndpoint = (date: Date): boolean => {
    if (!previewRange()) return false;
    const hovered = hoveredDate();
    if (!hovered) return false;
    return isSameDay(date, hovered);
  };

  // check if date is in editing range
  const isDateInEditingRange = (date: Date): boolean => {
    const r = editingRange();
    if (!r) return false;
    return isInRange(date, r.startDate, r.endDate);
  };

  /**
   * Checks if a date is disabled based on min/max constraints and custom disabledDates function.
   * Compares at day level to ignore time components.
   */
  const isDateDisabled = (date: Date): boolean => {
    const min = minDate();
    const max = maxDate();
    const dayStart = startOfDay(date);

    if (min && dayStart < startOfDay(min)) return true;
    if (max && dayStart > startOfDay(max)) return true;
    if (props.disabledDates?.(date)) return true;
    return false;
  };

  /**
   * Formats time for display based on format setting.
   */
  const showSeconds = createMemo(() => props.showSeconds ?? false);

  const formatTime = (h: number, m: number, s: number): string =>
    formatTimeUtil(h, m, s, timeFormat(), showSeconds());

  const getDisplayValue = createMemo<string>(() => {
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
          let startDateStr = `${formatDate(datesObjectValue.startDate.date, displayFormat())}`;
          let endDateStr = `${formatDate(datesObjectValue.endDate.date, displayFormat())}`;

          if (
            showTime() &&
            datesObjectValue.startDate.hour !== undefined &&
            datesObjectValue.startDate.minute !== undefined &&
            datesObjectValue.startDate.second !== undefined
          ) {
            startDateStr = `${startDateStr} ${formatTime(datesObjectValue.startDate.hour, datesObjectValue.startDate.minute, datesObjectValue.startDate.second)}`;
          }
          if (
            showTime() &&
            datesObjectValue.endDate.hour !== undefined &&
            datesObjectValue.endDate.minute !== undefined &&
            datesObjectValue.endDate.second !== undefined
          ) {
            endDateStr = `${endDateStr} ${formatTime(datesObjectValue.endDate.hour, datesObjectValue.endDate.minute, datesObjectValue.endDate.second)}`;
          }
          return `${startDateStr} - ${endDateStr}`;
        }
        return '';
      case 'multipleRange':
        if (
          !datesObjectValue.multipleRanges ||
          datesObjectValue.multipleRanges.length === 0
        ) {
          return '';
        }
        return datesObjectValue.multipleRanges
          .map(
            (range) =>
              `${formatDate(range.startDate, displayFormat())} - ${formatDate(range.endDate, displayFormat())}`,
          )
          .reverse()
          .join(' • ');
    }
  });

  /**
   * Gets the initial date to focus when opening the calendar.
   * Prioritizes: selected date > range start > first multiple date > today.
   */
  const getInitialFocusDate = (): Date => {
    return (
      (datesObjectValue.date && parseDate(datesObjectValue.date)) ||
      (datesObjectValue.startDate && parseDate(datesObjectValue.startDate.date)) ||
      (datesObjectValue.multipleDates?.[0] &&
        parseDate(datesObjectValue.multipleDates[0])) ||
      (datesObjectValue.multipleRanges?.[0] &&
        parseDate(datesObjectValue.multipleRanges[0].startDate)) ||
      new Date()
    );
  };

  /**
   * Announces a message to screen readers via aria-live region.
   */
  let announceTimer: ReturnType<typeof setTimeout>;
  const announce = (message: string) => {
    clearTimeout(announceTimer);
    setAnnouncement(message);
    announceTimer = setTimeout(() => setAnnouncement(''), 1000);
  };
  onCleanup(() => clearTimeout(announceTimer));

  const handleInputClick = () => {
    if (props.disabled || props.isLoading) return;

    if (isOpen()) {
      closeCalendar();
      return;
    }

    // Set focused date BEFORE opening so Calendar renders with the correct focus
    setFocusedDate(getInitialFocusDate());
    setIsOpen(true);
    props.onFocus?.();
    // Focus is handled by the createEffect that watches isMounted()
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
   * Gets the reason why a date is disabled for screen reader announcement.
   */
  const getDisabledReason = (date: Date): string => {
    const min = minDate();
    const max = maxDate();
    const dayStart = startOfDay(date);

    if (min && dayStart < startOfDay(min)) return a().dateBeforeMin;
    if (max && dayStart > startOfDay(max)) return a().dateAfterMax;
    if (props.disabledDates?.(date)) return a().dateNotAvailable;
    return a().dateNotAvailable;
  };

  /**
   * Moves focused date to first day of the current month.
   */
  const moveToFirstDayOfMonth = () => {
    const current = currentDate();
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    setFocusedDate(firstDay);
  };

  /**
   * Moves focused date to last day of the current month.
   */
  const moveToLastDayOfMonth = () => {
    const current = currentDate();
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    setFocusedDate(lastDay);
  };

  /**
   * Handles keyboard navigation within the calendar.
   * Arrow keys only navigate dates when a date button (gridcell) is focused.
   */
  const handleCalendarKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isDateButton = target.getAttribute('role') === 'gridcell';

    if (isDateButton && !usingKeyboard()) {
      setUsingKeyboard(true);
      setHoveredDate(null);
    }

    switch (e.key) {
      case 'Escape': {
        // Don't close if a child Select dropdown was just open
        // (Select's handler runs first in SolidJS delegation and closes it,
        // but we can detect it consumed the event via defaultPrevented)
        if (e.defaultPrevented) return;

        closeCalendar();
        break;
      }
      case 'ArrowLeft':
        // Only navigate dates when a date button is focused
        if (!isDateButton) break;
        e.preventDefault();
        moveFocusedDate(-1);
        focusCurrentDateButton();
        break;
      case 'ArrowRight':
        if (!isDateButton) break;
        e.preventDefault();
        moveFocusedDate(1);
        focusCurrentDateButton();
        break;
      case 'ArrowUp':
        if (!isDateButton) break;
        e.preventDefault();
        moveFocusedDate(-7);
        focusCurrentDateButton();
        break;
      case 'ArrowDown':
        if (!isDateButton) break;
        e.preventDefault();
        moveFocusedDate(7);
        focusCurrentDateButton();
        break;
      case 'Home':
        if (!isDateButton) break;
        e.preventDefault();
        moveToFirstDayOfMonth();
        focusCurrentDateButton();
        break;
      case 'End':
        if (!isDateButton) break;
        e.preventDefault();
        moveToLastDayOfMonth();
        focusCurrentDateButton();
        break;
      case 'PageUp':
        if (!isDateButton) break;
        e.preventDefault();
        // Move to previous month, same day
        setCurrentDate(addMonths(currentDate(), -1));
        {
          const current = focusedDate() || currentDate();
          const newDate = addMonths(current, -1);
          setFocusedDate(newDate);
        }
        focusCurrentDateButton();
        break;
      case 'PageDown':
        if (!isDateButton) break;
        e.preventDefault();
        // Move to next month, same day
        setCurrentDate(addMonths(currentDate(), 1));
        {
          const current = focusedDate() || currentDate();
          const newDate = addMonths(current, 1);
          setFocusedDate(newDate);
        }
        focusCurrentDateButton();
        break;
      case 'Enter':
      case ' ': {
        // Only select a date when a date button is focused
        if (!isDateButton) break;
        e.preventDefault();
        const dateToSelect = focusedDate() || currentDate();
        if (isDateDisabled(dateToSelect)) {
          // Announce why the date is not available
          announce(getDisabledReason(dateToSelect));
        } else {
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
        setFocusedDate(getInitialFocusDate());
        setIsOpen(true);
        props.onFocus?.();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      props.onBlur?.();
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
    get backgroundScrollBehavior() {
      return props.backgroundScrollBehavior ?? 'prevent';
    },
    onClose: () => setIsOpen(false),
  });

  /**
   * Focuses the date button for the currently focused date.
   */
  const focusCurrentDateButton = () => {
    const dateToFocus = focusedDate();
    if (!dateToFocus) return;

    const dateISO = toISO(dateToFocus);
    // Use queueMicrotask to ensure we run after SolidJS batch updates
    queueMicrotask(() => {
      const floating = refs.floating();
      if (floating) {
        const dateBtn = floating.querySelector<HTMLButtonElement>(
          `[data-date="${dateISO}"]`,
        );
        dateBtn?.focus({ preventScroll: true });
      }
    });
  };

  // Focus the date button and announce month/year when the calendar first becomes visible
  createEffect(
    on(isMounted, (mounted) => {
      if (mounted && focusedDate()) {
        focusCurrentDateButton();
        // Announce which month/year is being viewed on initial open
        const monthYear = currentDate().toLocaleDateString(props.locale || locale, {
          month: 'long',
          year: 'numeric',
        });
        announce(`${a().calendar}. Viewing ${monthYear}`);
      }
    }),
  );

  // Announce month/year changes for screen readers (after initial open)
  createEffect(
    on(
      currentDate,
      (date) => {
        if (isOpen()) {
          const monthYear = date.toLocaleDateString(props.locale || locale, {
            month: 'long',
            year: 'numeric',
          });
          announce(`Viewing ${monthYear}`);
        }
      },
      { defer: true },
    ),
  );

  createEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (!isOpen()) return;

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
        props.onBlur?.();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);

    onCleanup(() => document.removeEventListener('pointerdown', handleClickOutside));
  });

  const focusInput = () => {
    const input = inputRef();
    if (input) {
      input.focus();
    }
  };

  // function to remove a range from multirange list
  const removeCurrentRange = (rangeId: string) => {
    if (props.minSelectable) {
      const currentRanges = datesObjectValue.multipleRanges || [];
      const currentCount = currentRanges.length;
      if (currentCount <= props.minSelectable) {
        announce(
          `Minimum limit of ${props.minSelectable} ranges reached. Cannot remove range.`,
        );
        return;
      }
    }

    setDatesObjectValue(
      'multipleRanges',
      datesObjectValue.multipleRanges?.filter((range) => range.id !== rangeId),
    );
  };

  // edit an existing range in multirange
  const startEditingRange = (range: RangeValue) => {
    // on édite cette plage
    setEditingRangeId(range.id);
    setNewRangeId(range.id);

    // on nettoie un éventuel range en cours de saisie
    setDatesObjectValue({
      ...datesObjectValue,
      startDate: undefined,
      endDate: undefined,
    });

    // on centre le calendrier sur le début de la plage
    setCurrentDate(parseDate(range.startDate));

    announce(a().rangeSelectedForEdit);
  };

  const cancelEditingRange = () => {
    setEditingRangeId(null);
    setNewRangeId(null);
    setDatesObjectValue({
      ...datesObjectValue,
      startDate: undefined,
      endDate: undefined,
    });
    setHoveredDate(null);
    announce(a().rangeEditCanceled);
  };

  return (
    <div class={twMerge('relative w-full text-neutral-700 dark:text-neutral-200')}>
      {/* Hidden input for form integration (ISO format for server-side parsing) */}
      <Show when={props.name}>
        <input
          type="hidden"
          name={props.name}
          value={
            type() === 'single'
              ? (datesObjectValue.date ?? '')
              : type() === 'range'
                ? `${datesObjectValue.startDate?.date ?? ''}/${datesObjectValue.endDate?.date ?? ''}`
                : (datesObjectValue.multipleDates ?? []).join(',')
          }
        />
      </Show>
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {announcement()}
      </div>
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
        aria-controls={isOpen() ? dialogId : undefined}
        aria-label={props.label || a().selectDate}
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
          inputMode="none"
          autocomplete="off"
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
              if (!hasFooter()) {
                props.onChange?.({});
              }
              focusInput();
            }}
          />
        </Show>
      </div>

      <Show when={isMounted()}>
        <Portal mount={container() ?? undefined}>
          <div
            ref={refs.setFloating}
            id={dialogId}
            role="dialog"
            aria-label={a().chooseDate}
            onKeyDown={(e) => {
              if (e.key !== 'Tab') return;

              const floating = refs.floating();
              if (!floating) return;

              const active = document.activeElement as HTMLElement;
              const isDateButton = active.getAttribute('role') === 'gridcell';

              // Build ordered Tab stops. Each section is a single Tab stop:
              // 1. Shortcuts listbox (single stop - arrow keys navigate within)
              // 2. Calendar header buttons (prev month, month, year, next month)
              // 3. Focused date button (the single gridcell with tabindex=0)
              // 4. Time picker controls (inputs and buttons below calendar)

              const allShortcutButtons = Array.from(
                floating.querySelectorAll<HTMLElement>(
                  '[role="listbox"][aria-label] [role="option"]',
                ),
              ).filter(
                (el) => el.closest('[role="grid"]') === null && el.offsetParent !== null,
              );

              // Shortcuts are a single Tab stop: use currently focused shortcut or first one
              const isInShortcuts = allShortcutButtons.includes(active);
              const shortcutTabStop = isInShortcuts
                ? active
                : (allShortcutButtons[0] ?? null);

              const calendarGrid = floating.querySelector('[role="grid"]');
              const headerButtons = calendarGrid
                ? Array.from(
                    calendarGrid.querySelectorAll<HTMLElement>(
                      '[data-calendar-header] button:not([disabled])',
                    ),
                  ).filter((el) => el.offsetParent !== null)
                : [];

              const focusedDateBtn = calendarGrid?.querySelector<HTMLElement>(
                '[role="gridcell"][tabindex="0"]',
              );

              // Time picker controls (inputs, buttons outside header and grid)
              const timePickerControls = Array.from(
                floating.querySelectorAll<HTMLElement>(
                  '[role="group"] input:not([disabled]), [role="group"] button:not([disabled])',
                ),
              ).filter(
                (el) =>
                  el.offsetParent !== null &&
                  !headerButtons.includes(el) &&
                  el !== focusedDateBtn &&
                  el.closest('[role="grid"]') === null &&
                  el.tabIndex !== -1,
              );

              // Footer buttons (Cancel, Apply)
              const footerButtons = Array.from(
                floating.querySelectorAll<HTMLElement>(
                  '[data-footer] button:not([disabled])',
                ),
              ).filter((el) => el.offsetParent !== null);

              // Build the full ordered Tab stop list
              const focusOrder: HTMLElement[] = [
                ...(shortcutTabStop ? [shortcutTabStop] : []),
                ...headerButtons,
                ...(focusedDateBtn ? [focusedDateBtn] : []),
                ...timePickerControls,
                ...footerButtons,
              ];

              if (focusOrder.length === 0) return;

              // Find current position in the focus order
              let currentIndex = focusOrder.indexOf(active);

              // If active element is a shortcut not the tab stop representative, map to shortcuts position
              if (currentIndex === -1 && isInShortcuts && shortcutTabStop) {
                currentIndex = focusOrder.indexOf(shortcutTabStop);
              }

              // If active element is a date button not in list (tabindex=-1), treat it as the focused date position
              if (currentIndex === -1 && isDateButton && focusedDateBtn) {
                currentIndex = focusOrder.indexOf(focusedDateBtn);
              }

              if (currentIndex === -1) return;

              e.preventDefault();

              let nextIndex: number;
              if (e.shiftKey) {
                nextIndex = currentIndex === 0 ? focusOrder.length - 1 : currentIndex - 1;
              } else {
                nextIndex = currentIndex === focusOrder.length - 1 ? 0 : currentIndex + 1;
              }

              const nextElement = focusOrder[nextIndex];
              // If the next element is the focused date button, use focusCurrentDateButton for reactivity
              if (nextElement === focusedDateBtn) {
                focusCurrentDateButton();
              } else {
                nextElement.focus({ preventScroll: true });
              }
            }}
            style={
              {
                ...floatingStyles(),
                opacity: isVisible() ? '1' : '0',
                transform: isVisible() ? 'scale(1)' : 'scale(0.8)',
                'transition-property': 'opacity, transform',
                'transition-duration': '.2s',
                'transition-timing-function': 'cubic-bezier(.32, .72, 0, 1)',
              } as JSX.CSSProperties
            }
            class={twMerge(
              'z-50 w-fit rounded-lg border border-neutral-300 bg-white px-2.5 py-3 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
            )}
          >
            <div class="flex gap-3">
              <Show when={showShortcuts() && shortcuts().length > 0}>
                <Shortcuts
                  shortcuts={shortcuts()}
                  onSelect={handleShortcutSelect}
                  type={type}
                  ariaLabel={a().shortcuts}
                  onEscape={closeCalendar}
                />
              </Show>
              <div>
                <Calendar
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  selectDate={selectDate}
                  type={type}
                  locale={props.locale || locale}
                  isSingletonDateSelected={isSingletonDateSelected}
                  isRangeDateSelected={isRangeDateSelected}
                  isRangeDateInEdition={isRangeDateInEdition}
                  isDateInRange={isDateInRange}
                  isDateInPreviewRange={isDateInPreviewRange}
                  isPreviewEndpoint={isPreviewEndpoint}
                  isDateInEditingRange={isDateInEditingRange}
                  onDateHover={(date) => {
                    if (date === null) {
                      setHoveredDate(null);
                    } else if (!usingKeyboard()) {
                      setHoveredDate(date);
                    }
                  }}
                  onDateMouseMove={() => {
                    if (usingKeyboard()) {
                      setUsingKeyboard(false);
                    }
                  }}
                  isDateDisabled={isDateDisabled}
                  minDate={minDate()}
                  maxDate={maxDate()}
                  calendarClass={props.calendarClass}
                  onKeyDown={handleCalendarKeyDown}
                  focusedDate={focusedDate}
                  setFocusedDate={setFocusedDate}
                  weekStartsOn={props.weekStartsOn ?? 1}
                  ariaLabels={a()}
                  announce={announce}
                />
                {/* Multi range list for multiple range */}
                <Show
                  when={
                    datesObjectValue.multipleRanges &&
                    datesObjectValue.multipleRanges.length > 0
                  }
                >
                  <div class="flex flex-col gap-2 border-t border-neutral-300 py-3 dark:border-neutral-800">
                    <For each={datesObjectValue.multipleRanges}>
                      {(range) => (
                        <div
                          data-multi-range-chip
                          classList={{
                            'flex w-fit items-center gap-3 rounded-lg  p-1 pl-3 text-xs': true,
                            'bg-amber-100 dark:bg-amber-900':
                              editingRangeId() === range.id,
                            'bg-neutral-50 dark:bg-neutral-800':
                              editingRangeId() !== range.id,
                          }}
                        >
                          <span>{`${formatDate(range.startDate, displayFormat())} - ${formatDate(range.endDate, displayFormat())}`}</span>
                          <div>
                            <Show
                              when={editingRangeId() === range.id}
                              fallback={
                                <button
                                  class="inline-flex cursor-pointer items-center justify-center rounded p-1 text-neutral-900 dark:text-white"
                                  type="button"
                                  onClick={() => startEditingRange(range)}
                                >
                                  <Edit02Icon class="size-4" />
                                </button>
                              }
                            >
                              <button
                                class="inline-flex cursor-pointer items-center justify-center rounded p-1 text-neutral-900 dark:text-white"
                                type="button"
                                onClick={cancelEditingRange}
                              >
                                <FlipBackwardIcon class="size-4" />
                              </button>
                            </Show>
                            <button
                              class="inline-flex cursor-pointer items-center justify-center p-1 text-neutral-900 dark:text-white"
                              onClick={() => removeCurrentRange(range.id)}
                            >
                              <XIcon class="size-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
                {/* Time picker for single date */}
                <Show when={showTime() && props.type === 'single'}>
                  <div class="flex justify-center gap-4 border-t border-neutral-300 py-3 dark:border-neutral-800">
                    <TimePicker
                      value={time}
                      onChange={setTime}
                      // onEscape={closeCalendar}
                      format={timeFormat()}
                      minuteStep={minuteStep()}
                      secondStep={secondStep()}
                      showSeconds={showSeconds()}
                      ariaLabels={a()}
                      containerClass="w-auto"
                    />
                  </div>
                </Show>
                {/* Time picker for range dates */}
                <Show when={showTime() && props.type === 'range'}>
                  <div class="flex justify-center gap-4 border-t border-neutral-300 py-3 dark:border-neutral-800">
                    <TimePicker
                      value={startTime}
                      onChange={setStartTime}
                      label={a().startTime}
                      // onEscape={closeCalendar}
                      format={timeFormat()}
                      minuteStep={minuteStep()}
                      secondStep={secondStep()}
                      showSeconds={showSeconds()}
                      ariaLabels={a()}
                      containerClass="w-auto"
                    />

                    <TimePicker
                      value={endTime}
                      onChange={setEndTime}
                      label={a().endTime}
                      // onEscape={closeCalendar}
                      format={timeFormat()}
                      minuteStep={minuteStep()}
                      secondStep={secondStep()}
                      showSeconds={showSeconds()}
                      ariaLabels={a()}
                      containerClass="w-auto"
                    />
                  </div>
                </Show>
                <Show when={hasFooter()}>
                  <div
                    class="flex justify-end gap-2 border-t border-neutral-300 pt-3 dark:border-neutral-800"
                    data-footer
                  >
                    <Button color="transparent" size="sm" onClick={handleCancel}>
                      {l().cancel}
                    </Button>
                    <Button size="sm" onClick={handleApply}>
                      {l().apply}
                    </Button>
                  </div>
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
