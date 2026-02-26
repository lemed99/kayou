import { JSX, Show, createMemo, createUniqueId, splitProps } from 'solid-js';

import { twMerge } from 'tailwind-merge';

import HelperText from '../HelperText';
import Label from '../Label';
import NumberInput from '../NumberInput';
import Select from '../Select';
import Spinner from '../Spinner';
import {
  DEFAULT_TIME_VALUE,
  type TimeValue,
  displayHour as formatDisplayHour,
  getPeriod,
  to24Hour,
  zeroPad,
} from './timeUtils';

/**
 * Aria labels for the TimePicker component.
 */
export interface TimePickerAriaLabels {
  timePicker: string;
  hour: string;
  minute: string;
  second: string;
}

export const DEFAULT_TIME_PICKER_ARIA_LABELS: TimePickerAriaLabels = {
  timePicker: 'Time selection',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
};

export interface TimePickerProps {
  /** Current time value. */
  value?: TimeValue;
  /** Callback fired when the time changes. */
  onChange?: (value: TimeValue) => void;
  /** Time format. @default '24h' */
  format?: '12h' | '24h';
  /** Minute step increment. @default 1 */
  minuteStep?: number;
  /** Second step increment. @default 1 */
  secondStep?: number;
  /** Show seconds input. @default false */
  showSeconds?: boolean;
  /** Label displayed above the input. */
  label?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Color variant for validation states. @default 'gray' */
  color?: 'gray' | 'info' | 'failure' | 'warning' | 'success';
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Show loading spinner. */
  isLoading?: boolean;
  /** Input size variant. @default 'md' */
  sizing?: 'xs' | 'sm' | 'md';
  /** Additional CSS class for the outer wrapper. */
  class?: string;
  /** Aria labels for accessibility. */
  ariaLabels?: Partial<TimePickerAriaLabels>;
  /** Element id. */
  id?: string;
}

const colorClasses: Record<string, string> = {
  gray: 'border-neutral-300 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
  info: 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-100',
  failure: 'border-red-500 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-100',
  warning:
    'border-yellow-500 bg-yellow-50 text-yellow-900 dark:border-yellow-500 dark:bg-yellow-100',
  success:
    'border-green-500 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-100',
};

const sizingClasses: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
};

const numberInputStyle: JSX.CSSProperties = {
  border: 'none',
  'background-color': 'transparent',
  'text-align': 'center',
};

const periodOptions = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];

/**
 * Standalone time picker form component.
 * Supports 12h/24h format, hour/minute/second input, and standard form field props.
 */
const TimePicker = (props: TimePickerProps) => {
  const [local] = splitProps(props, [
    'value',
    'onChange',
    'format',
    'minuteStep',
    'secondStep',
    'showSeconds',
    'label',
    'helperText',
    'required',
    'color',
    'disabled',
    'isLoading',
    'sizing',
    'class',
    'ariaLabels',
    'id',
  ]);

  const a = createMemo(() => ({
    ...DEFAULT_TIME_PICKER_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  const uniqueId = createUniqueId();
  const groupId = createMemo(() => local.id || `timepicker-${uniqueId}`);
  const helperId = createMemo(() =>
    local.helperText ? `${groupId()}-helper` : undefined,
  );

  const color = createMemo(() => local.color || 'gray');
  const sizing = createMemo(() => local.sizing || 'md');
  const format = createMemo(() => local.format || '24h');
  const is12h = () => format() === '12h';
  const minuteStep = createMemo(() => local.minuteStep ?? 1);
  const secondStep = createMemo(() => local.secondStep ?? 1);
  const showSeconds = createMemo(() => local.showSeconds ?? false);
  const isDisabled = createMemo(() => local.disabled || local.isLoading);

  const ariaInvalid = createMemo(() => (color() === 'failure' ? true : undefined));

  // Derive time values from props
  const currentHour = createMemo(() => local.value?.hour ?? DEFAULT_TIME_VALUE.hour);
  const currentMinute = createMemo(
    () => local.value?.minute ?? DEFAULT_TIME_VALUE.minute,
  );
  const currentSecond = createMemo(
    () => local.value?.second ?? DEFAULT_TIME_VALUE.second,
  );

  // Period is derived from hour, not stored separately
  const period = createMemo(() => getPeriod(currentHour()));

  const emitChange = (partial: Partial<TimeValue>) => {
    local.onChange?.({
      hour: partial.hour ?? currentHour(),
      minute: partial.minute ?? currentMinute(),
      second: partial.second ?? currentSecond(),
    });
  };

  const handleHourChange = (num: number | null) => {
    if (num === null) return;
    if (is12h()) {
      emitChange({ hour: to24Hour(num, period()) });
    } else {
      emitChange({ hour: Math.max(0, Math.min(23, num)) });
    }
  };

  const handleMinuteChange = (num: number | null) => {
    if (num !== null) emitChange({ minute: num });
  };

  const handleSecondChange = (num: number | null) => {
    if (num !== null) emitChange({ second: num });
  };

  const handlePeriodChange = (opt: { value: string } | undefined) => {
    if (!opt) return;
    const newPeriod = opt.value as 'AM' | 'PM';
    const h = currentHour();
    if (newPeriod === 'PM' && h < 12) {
      emitChange({ hour: h + 12 });
    } else if (newPeriod === 'AM' && h >= 12) {
      emitChange({ hour: h - 12 });
    }
  };

  return (
    <div class="w-full">
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label for={groupId()} value={local.label} color={color()} />
          <Show when={local.required}>
            <span aria-hidden="true" class="ml-0.5 font-medium text-red-500">
              *
            </span>
          </Show>
        </div>
      </Show>

      <div
        id={groupId()}
        role="group"
        aria-label={a().timePicker}
        aria-invalid={ariaInvalid()}
        aria-describedby={helperId()}
        class={twMerge(
          'flex w-fit items-center gap-0.5 rounded-lg border',
          colorClasses[color()],
          sizingClasses[sizing()],
          isDisabled() && 'cursor-not-allowed opacity-50',
          local.class,
        )}
      >
        <Show when={local.isLoading}>
          <div class="flex items-center pl-2">
            <Spinner size="sm" color="transparent" />
          </div>
        </Show>

        <NumberInput
          value={formatDisplayHour(currentHour(), format())}
          sizing={sizing()}
          color={color()}
          onValueChange={handleHourChange}
          placeholder="00"
          style={numberInputStyle}
          min={is12h() ? 1 : 0}
          max={is12h() ? 12 : 23}
          wrap
          class="w-10"
          aria-label={a().hour}
          onFocus={(e) => e.target.select()}
          disabled={isDisabled()}
        />
        <span class="font-medium text-neutral-400 dark:text-neutral-500">:</span>
        <NumberInput
          value={zeroPad(currentMinute())}
          sizing={sizing()}
          color={color()}
          onValueChange={handleMinuteChange}
          placeholder="00"
          style={numberInputStyle}
          min={0}
          max={59}
          step={minuteStep()}
          wrap
          class="w-10"
          aria-label={a().minute}
          onFocus={(e) => e.target.select()}
          disabled={isDisabled()}
        />
        <Show when={showSeconds()}>
          <span class="font-medium text-neutral-400 dark:text-neutral-500">:</span>
          <NumberInput
            value={zeroPad(currentSecond())}
            sizing={sizing()}
            color={color()}
            onValueChange={handleSecondChange}
            placeholder="00"
            style={numberInputStyle}
            min={0}
            max={59}
            step={secondStep()}
            wrap
            class="w-10"
            aria-label={a().second}
            onFocus={(e) => e.target.select()}
            disabled={isDisabled()}
          />
        </Show>
        <Show when={is12h()}>
          <span class="h-5 w-px bg-neutral-200 dark:bg-neutral-700" />
          <Select
            options={periodOptions}
            value={period()}
            onSelect={handlePeriodChange}
            aria-label="AM/PM"
            sizing={sizing()}
            color={color()}
            fitContent={true}
            backgroundScrollBehavior="follow"
            style={{ border: 'none', 'background-color': 'transparent' }}
            disabled={isDisabled()}
          />
        </Show>
      </div>

      <Show when={local.helperText}>
        <HelperText id={helperId()} content={local.helperText!} color={color()} />
      </Show>
    </div>
  );
};

export default TimePicker;
