import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

import { Placement, createFloating, flip, offset } from 'floating-ui-solid';
import { twMerge } from 'tailwind-merge';

import {
  addMonths,
  formatDate,
  getDaysShort,
  getMonthsShort,
  isDateValid,
  isInRange,
  isSameDay,
  parseDate,
  toISO,
} from '../helpers/dates';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '../icons';
import { useDatePicker } from './../hooks';
import Badge from './Badge';
import Button from './Button';
import NumberInput from './NumberInput';

export interface DateValue {
  date?: string;
  startDate?: string;
  endDate?: string;
  multipleDates?: string[];
}

export interface DatePickerProps {
  value?: DateValue;
  onChange?: (value: DateValue) => void;
  type: 'single' | 'multiple' | 'range';
  displayFormat?: string;
  inputClass?: string;
  containerClass?: string;
  locale: string;
  popoverPosition?: 'top' | 'bottom';
  disabled?: boolean;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  positionning?: 'absolute' | 'fixed';
}

export interface CalendarProps {
  currentDate: () => Date;
  setCurrentDate: (date: Date) => void;
  selectDate: (date: Date) => void;
  type: () => string;
  locale?: string;
  isSingletonDateSelected: (date: Date) => boolean;
  isRangeDateSelected: (date: Date) => { start: boolean; end: boolean };
  isDateInRange: (date: Date) => boolean;
  isDateDisabled: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}

const getSixWeeksMargedDaysInMonth = (date: Date): Date[] => {
  const { monthCache, setMonthCache } = useDatePicker();
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${month}`;

  const cached = monthCache[key];
  if (cached) {
    return cached.map((d) => parseDate(d));
  }

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysFromMonday); // Set start date to the previous Monday

  const days: Date[] = [];
  const currentDate = startDate;

  for (let i = 0; i < 42; i++) {
    // 42 days to have 6 weeks displayed
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  setMonthCache(
    key,
    days.map((d) => toISO(d)),
  );
  return days;
};

const Calendar = (props: CalendarProps) => {
  const [showMonthSelector, setShowMonthSelector] = createSignal(false);
  const [showYearSelector, setShowYearSelector] = createSignal(false);
  const [customYear, setCustomYear] = createSignal('');

  const days = createMemo(() => getSixWeeksMargedDaysInMonth(props.currentDate()));

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
    if (!isNaN(year) && year >= 1970) {
      handleYearSelect(year);
      setCustomYear('');
    }
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 9; i <= currentYear; i++) {
      // Get last 10 years
      years.push(i);
    }
    return years;
  };

  const isSelected = (date: Date) => props.isSingletonDateSelected(date);
  const rangeSelection = (date: Date) => props.isRangeDateSelected(date);
  const isInCurrentMonth = (date: Date) => isCurrentMonth(date);
  const isInDateRange = (date: Date) => props.isDateInRange(date);
  const isDisabled = (date: Date) => props.isDateDisabled(date);
  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div class="w-full md:w-[292px] md:min-w-[292px]">
      <div class="flex items-center space-x-1.5 rounded-md border border-gray-300 px-2 py-1.5 dark:border-gray-700">
        <Show when={!showMonthSelector() && !showYearSelector()}>
          <div class="flex-none">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10"
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
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] tracking-wide uppercase transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10"
            >
              {getMonthsShort(props.locale!)[props.currentDate().getMonth()]}
            </button>
          </div>
          <div class="w-1/2">
            <button
              type="button"
              onClick={() => {
                setShowMonthSelector(false);
                setShowYearSelector(!showYearSelector());
              }}
              class="w-full cursor-pointer rounded-md px-3 py-[0.55rem] tracking-wide uppercase transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10"
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
              class="cursor-pointer rounded-full p-[0.45rem] transition-all duration-300 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10"
            >
              <ChevronRightIcon class="size-5" />
            </button>
          </div>
        </Show>
      </div>

      <Switch
        fallback={
          <div class="my-0.5">
            <div class="grid grid-cols-7 border-b border-gray-300 py-2 dark:border-gray-700">
              <For each={getDaysShort(props.locale!)}>
                {(day) => (
                  <div class="text-center tracking-wide text-gray-500 capitalize">
                    {day}
                  </div>
                )}
              </For>
            </div>
            <div class="mt-1 grid grid-cols-7 gap-x-0.5 gap-y-0.5">
              <For each={days()}>
                {(date) => {
                  const defaultClass =
                    'flex items-center justify-center h-10 w-10 cursor-pointer';
                  const grayClass = 'text-gray-400';
                  const currentDayClass = 'text-blue-500';
                  const selectedDayClass =
                    'bg-blue-500 text-white font-medium rounded-lg';
                  const rangeStartClass =
                    selectedDayClass + ' rounded-l-lg rounded-r-none';
                  const rangeEndClass = selectedDayClass + ' rounded-r-lg rounded-l-none';
                  const inRangeClass = 'bg-blue-100  dark:bg-white/10';

                  return (
                    <button
                      type="button"
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled(date)}
                      class={twMerge(
                        defaultClass,
                        !isInCurrentMonth(date) ? grayClass : '',
                        isToday(date) && !isSelected(date) ? currentDayClass : '',
                        isSelected(date) && isInCurrentMonth(date)
                          ? selectedDayClass
                          : '',
                        rangeSelection(date).start && isInCurrentMonth(date)
                          ? rangeStartClass
                          : '',
                        rangeSelection(date).end && isInCurrentMonth(date)
                          ? rangeEndClass
                          : '',
                        isInDateRange(date) && !isSelected(date) && isInCurrentMonth(date)
                          ? inRangeClass
                          : '',
                        isDisabled(date) ? 'cursor-not-allowed opacity-50' : '',
                      )}
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
          <div class="px-0.5 sm:px-2">
            <div class="mt-2 mb-[3px] grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getMonthsShort(props.locale!)}>
                {(month, index) => (
                  <button
                    type="button"
                    onClick={() => handleMonthSelect(index())}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 tracking-wide uppercase transition-all duration-100 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10',
                      index() === props.currentDate().getMonth()
                        ? 'bg-gray-50 font-semibold dark:bg-white/5'
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
          <div class="px-0.5 sm:px-2">
            <div class="mt-2 mb-[3px] grid w-full grid-cols-2 gap-x-2 gap-y-1">
              <For each={getYearRange()}>
                {(year) => (
                  <button
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    class={twMerge(
                      'w-full cursor-pointer rounded-md p-3 tracking-wide uppercase transition-all duration-100 hover:bg-gray-100 focus:bg-blue-100/50 focus:ring-1 focus:ring-blue-500/50 dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10',
                      year === props.currentDate().getFullYear()
                        ? 'bg-gray-50 font-semibold dark:bg-white/5'
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
              min={1970}
            />
            <Button type="submit" size="md">
              <CheckIcon class="size-5" />
            </Button>
          </form>
        </Match>
      </Switch>
    </div>
  );
};

const DatePicker = (props: DatePickerProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentDate, setCurrentDate] = createSignal(new Date());
  const [datesObjectValue, setDatesObjectValue] = createStore<DateValue>({});

  const { locale } = useDatePicker();

  const type = () => props.type || 'single';
  const displayFormat = () => props.displayFormat || 'DD/MM/YYYY';
  const minDate = () => (props.minDate ? parseDate(props.minDate) : undefined);
  const maxDate = () => (props.maxDate ? parseDate(props.maxDate) : undefined);

  createEffect(() => {
    if (!props.value) {
      return;
    }

    switch (type()) {
      case 'single':
        if (props.value.date && isDateValid(props.value.date)) {
          setDatesObjectValue({ date: toISO(parseDate(props.value.date)) });
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

  const selectDate = (date: Date) => {
    const dateISO = toISO(date);

    switch (type()) {
      case 'single':
        setDatesObjectValue({ date: dateISO });
        setIsOpen(false);
        break;
      case 'multiple': {
        if (datesObjectValue.multipleDates?.includes(dateISO)) {
          setDatesObjectValue('multipleDates', (dates) =>
            dates?.filter((d) => d !== dateISO),
          );
        } else {
          setDatesObjectValue('multipleDates', (dates) => [...(dates || []), dateISO]);
        }
        break;
      }
      case 'range':
        if (
          !datesObjectValue.startDate ||
          (datesObjectValue.startDate && datesObjectValue.endDate)
        ) {
          setDatesObjectValue({ startDate: dateISO, endDate: undefined });
        } else if (datesObjectValue.startDate && !datesObjectValue.endDate) {
          const startDate = parseDate(datesObjectValue.startDate);
          if (date < startDate) {
            setDatesObjectValue({
              startDate: dateISO,
              endDate: datesObjectValue.startDate,
            });
          } else {
            setDatesObjectValue('endDate', dateISO);
          }
          setIsOpen(false);
        }
        break;
    }

    setCurrentDate(date);
  };

  createEffect(() => {
    if (props.onChange) {
      props.onChange(datesObjectValue);
    }
  });

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

  const isDateDisabled = (date: Date): boolean => {
    const min = minDate();
    const max = maxDate();
    return (min && date < min) || false || (max && date > max) || false;
  };

  const getDisplayValue = (): string => {
    switch (type()) {
      case 'single':
        if (!datesObjectValue.date) return '';
        return formatDate(datesObjectValue.date, displayFormat());
      case 'multiple':
        if (
          !datesObjectValue.multipleDates ||
          datesObjectValue.multipleDates.length === 0
        )
          return '';
        return datesObjectValue.multipleDates
          .map((d) => formatDate(d, displayFormat()))
          .join(',');
      case 'range':
        if (datesObjectValue.startDate && datesObjectValue.endDate) {
          return `${formatDate(datesObjectValue.startDate, displayFormat())} - ${formatDate(datesObjectValue.endDate, displayFormat())}`;
        }
        return '';
    }
  };

  const handleInputClick = () => {
    if (!props.disabled) {
      setIsOpen(true);
    }
  };

  const {
    refs,
    placement: finalPlacement,
    floatingStyles,
  } = createFloating({
    get placement() {
      return `${props.popoverPosition}-start` as Placement;
    },
    isOpen: isOpen,
    middleware: [offset(12), flip({})],
    strategy: () => props.positionning ?? 'absolute',
  });

  createEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.floating() &&
        !refs.floating()?.contains(event.target as Node) &&
        refs.reference() &&
        !(refs.reference() as HTMLElement)?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  return (
    <div class={twMerge('relative w-full text-gray-700', props.containerClass || '')}>
      <div
        ref={refs.setReference}
        tabIndex={0}
        onMouseDown={handleInputClick}
        class={twMerge(
          'relative min-h-10 w-full cursor-text rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-9 text-sm text-gray-900 focus:outline-2 focus:outline-offset-[-1px] focus:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:outline-blue-500',
          props.inputClass || '',
        )}
      >
        <Show
          when={getDisplayValue()}
          fallback={
            <span class="text-gray-400">{props.placeholder || displayFormat()}</span>
          }
        >
          <Show when={type() === 'multiple'} fallback={getDisplayValue()}>
            <div class="flex flex-wrap gap-1">
              <For each={getDisplayValue().split(',')}>
                {(date) => <Badge class="w-fit">{date}</Badge>}
              </For>
            </div>
          </Show>
        </Show>
        <Show when={getDisplayValue() && !props.disabled}>
          <button
            type="button"
            onFocusIn={() => {
              setDatesObjectValue(reconcile({}));
              (refs.reference() as HTMLElement)?.focus();
            }}
            class="absolute top-0 right-0 h-full cursor-pointer px-3 text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XMarkIcon class="size-4" />
          </button>
        </Show>
      </div>

      <Show when={isOpen()}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles() }}
          class={twMerge(
            'absolute z-50 w-fit rounded-lg border border-gray-300 bg-white px-2.5 py-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white',
          )}
        >
          <div
            class={twMerge(
              'absolute z-50 size-4 rotate-45 border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800',
              finalPlacement() === 'top-start'
                ? '-bottom-[8.5px] left-0 ml-[1.2rem] border-r border-b'
                : '',
              finalPlacement() === 'top-end'
                ? 'right-0 -bottom-[8.5px] mr-[1.2rem] border-r border-b'
                : '',
              finalPlacement() === 'bottom-end'
                ? '-top-[8.5px] right-0 mr-[1.2rem] border-t border-l'
                : '',
              finalPlacement() === 'bottom-start'
                ? '-top-[8.5px] left-0 ml-[1.2rem] border-t border-l'
                : '',
            )}
          />
          <Calendar
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
          />
        </div>
      </Show>
    </div>
  );
};

export default DatePicker;
