import { Show, createEffect, createSignal, onCleanup } from 'solid-js';

import NumberInput from '../NumberInput';
import Select from '../Select';
import type { DatePickerAriaLabels } from './DatePicker';

/**
 * Props for the internal TimePicker component.
 */
export interface TimePickerProps {
  hour: () => number;
  minute: () => number;
  second: () => number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onSecondChange: (second: number) => void;
  onEscape?: () => void;
  format: '12h' | '24h';
  minuteStep: number;
  secondStep: number;
  /** Whether to show the seconds input. */
  showSeconds: boolean;
  /** Aria labels for accessibility. */
  ariaLabels: DatePickerAriaLabels;
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

  // Get display hour for 12h format (12 instead of 0), zero-padded
  const displayHour = (): string => {
    if (is12h()) {
      const h = props.hour() % 12 || 12;
      return h.toString().padStart(2, '0');
    }
    return props.hour().toString().padStart(2, '0');
  };

  const displayMinute = (): string => props.minute().toString().padStart(2, '0');
  const displaySecond = (): string => props.second().toString().padStart(2, '0');

  const handleHourChange = (num: number | null) => {
    if (num === null) return;
    if (is12h()) {
      // Clamp to valid 12h range (1-12)
      const clamped = Math.max(1, Math.min(12, num));
      // Convert 12h to 24h: 12 AM = 0, 12 PM = 12, 1-11 AM = 1-11, 1-11 PM = 13-23
      const isPM = period() === 'PM';
      let hour24: number;
      if (clamped === 12) {
        hour24 = isPM ? 12 : 0;
      } else {
        hour24 = isPM ? clamped + 12 : clamped;
      }
      props.onHourChange(hour24);
    } else {
      props.onHourChange(Math.max(0, Math.min(23, num)));
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

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      props.onEscape?.();
    }
  };

  const [timePickerRef, setTimePickerRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    const el = timePickerRef();
    if (!el) return;

    const handleEscapeNative = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If a child Select already consumed this Escape (closed its dropdown),
        // don't also close the calendar
        if (e.defaultPrevented) return;

        e.preventDefault();
        e.stopPropagation();
        props.onEscape?.();
      }
    };

    el.addEventListener('keydown', handleEscapeNative);
    onCleanup(() => el.removeEventListener('keydown', handleEscapeNative));
  });

  return (
    <div
      ref={setTimePickerRef}
      class="flex items-center justify-center gap-2 border-t border-gray-300 py-3 dark:border-neutral-800"
      role="group"
      aria-label={props.ariaLabels.timePicker}
    >
      <div class="flex w-fit items-center justify-center gap-0.5 rounded-lg border border-gray-200 dark:border-neutral-800">
        <NumberInput
          value={displayHour()}
          sizing="sm"
          onValueChange={handleHourChange}
          onKeyDown={handleEscape}
          placeholder="00"
          style={{
            border: 'none',
            'background-color': 'transparent',
            'text-align': 'center',
          }}
          min={is12h() ? 1 : 0}
          max={is12h() ? 12 : 23}
          wrap
          class="w-10"
          aria-label={props.ariaLabels.hour}
        />
        <span class="font-medium text-gray-400 dark:text-neutral-500">:</span>
        <NumberInput
          value={displayMinute()}
          sizing="sm"
          onValueChange={(v) => {
            if (v !== null) props.onMinuteChange(v);
          }}
          onKeyDown={handleEscape}
          placeholder="00"
          style={{
            border: 'none',
            'background-color': 'transparent',
            'text-align': 'center',
          }}
          min={0}
          max={59}
          step={props.minuteStep}
          wrap
          class="w-10"
          aria-label={props.ariaLabels.minute}
        />
        <Show when={props.showSeconds}>
          <span class="font-medium text-gray-400 dark:text-neutral-500">:</span>
          <NumberInput
            value={displaySecond()}
            sizing="sm"
            onValueChange={(v) => {
              if (v !== null) props.onSecondChange(v);
            }}
            onKeyDown={handleEscape}
            placeholder="00"
            style={{
              border: 'none',
              'background-color': 'transparent',
              'text-align': 'center',
            }}
            min={0}
            max={59}
            step={props.secondStep}
            wrap
            class="w-10"
            aria-label={props.ariaLabels.second}
          />
        </Show>
        <Show when={is12h()}>
          <span class="h-5 w-1 bg-gray-200 dark:bg-neutral-700" />
          <Select
            options={periodOptions}
            value={period()}
            onSelect={(opt) => opt && handlePeriodChange(opt.value)}
            aria-label="AM/PM"
            sizing="sm"
            fitContent={true}
            backgroundScrollBehavior="follow"
            style={{ border: 'none', 'background-color': 'transparent' }}
          />
        </Show>
      </div>
    </div>
  );
};

export default TimePicker;
