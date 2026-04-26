import {
  Index,
  JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  splitProps,
} from 'solid-js';

import { twMerge } from 'tailwind-merge';

import HelperText from './HelperText';
import Label from './Label';

/**
 * Aria labels for the OTPInput component.
 */
export interface OTPInputAriaLabels {
  otpInput: string;
  digit: string;
}

export const DEFAULT_OTP_INPUT_ARIA_LABELS: OTPInputAriaLabels = {
  otpInput: 'One-time password',
  digit: 'Character',
};

/**
 * Color variants for the OTPInput component.
 */
export type OTPInputColor = 'gray' | 'info' | 'failure' | 'warning' | 'success';

/**
 * Props for the OTPInput component.
 */
export interface OTPInputProps {
  /** Number of OTP characters. @default 6 */
  length?: number;
  /** Current OTP value (controlled mode). */
  value?: string;
  /** Callback fired when the OTP value changes. */
  onValueChange?: (value: string) => void;
  /** Callback fired when all characters are filled. */
  onComplete?: (value: string) => void;
  /** Color variant for styling and validation states. @default 'gray' */
  color?: OTPInputColor;
  /** Input size variant. @default 'md' */
  sizing?: 'sm' | 'md' | 'lg';
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Label displayed above the input. */
  label?: string;
  /** Helper text displayed below the input. */
  helperText?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Additional CSS class for the outer group container. */
  class?: string;
  /** Additional CSS class for individual input cells. */
  inputClass?: string;
  /** Element id. */
  id?: string;
  /** Aria labels for accessibility. */
  ariaLabels?: Partial<OTPInputAriaLabels>;
  /** Auto-focus the first input on mount. @default false */
  autofocus?: boolean;
}

const theme = {
  root: {
    base: 'w-full',
    group: 'flex items-center gap-2',
  },
  input: {
    base: 'block rounded-lg border text-center font-mono font-semibold uppercase disabled:cursor-not-allowed disabled:opacity-50 focus:outline focus:outline-2 focus:outline-offset-[-1px]',
    sizes: {
      sm: 'size-9 text-sm',
      md: 'size-11 text-base',
      lg: 'size-13 text-lg',
    },
    colors: {
      gray: 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:outline-blue-600 dark:focus:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
      info: 'border-blue-500 bg-blue-50 text-blue-900 focus:outline-blue-500 dark:border-blue-500 dark:bg-blue-100 dark:focus:outline-blue-500',
      failure:
        'border-red-500 bg-red-50 text-red-900 focus:outline-red-500 dark:border-red-500 dark:bg-red-100 dark:focus:outline-red-500',
      warning:
        'border-yellow-500 bg-yellow-50 text-yellow-900 focus:outline-yellow-500 dark:border-yellow-500 dark:bg-yellow-100 dark:focus:outline-yellow-500',
      success:
        'border-green-500 bg-green-50 text-green-900 focus:outline-green-500 dark:border-green-500 dark:bg-green-100 dark:focus:outline-green-500',
    },
    filled: 'border-neutral-400 dark:border-neutral-500',
  },
};

const OTPInput = (props: OTPInputProps): JSX.Element => {
  const [local] = splitProps(props, [
    'length',
    'value',
    'onValueChange',
    'onComplete',
    'color',
    'sizing',
    'disabled',
    'label',
    'helperText',
    'required',
    'class',
    'inputClass',
    'id',
    'ariaLabels',
    'autofocus',
  ]);

  const a = createMemo(() => ({
    ...DEFAULT_OTP_INPUT_ARIA_LABELS,
    ...local.ariaLabels,
  }));

  const uniqueId = createUniqueId();
  const groupId = createMemo(() => local.id || `otp-${uniqueId}`);
  const labelId = createMemo(() => (local.label ? `${groupId()}-label` : undefined));
  const helperId = createMemo(() =>
    local.helperText ? `${groupId()}-helper` : undefined,
  );

  const length = createMemo(() => local.length ?? 6);
  const color = createMemo(() => local.color || 'gray');
  const sizing = createMemo(() => local.sizing || 'md');
  const ariaInvalid = createMemo(() => (color() === 'failure' ? true : undefined));

  // Controlled / uncontrolled
  const isControlled = createMemo(() => local.value !== undefined);
  const [internal, setInternal] = createSignal('');

  const currentValue = createMemo(() =>
    isControlled() ? (local.value ?? '') : internal(),
  );

  const chars = createMemo(() => {
    const val = currentValue().toUpperCase();
    return Array.from({ length: length() }, (_, i) => val[i] ?? '');
  });

  const inputRefs: HTMLInputElement[] = [];

  const focusInput = (index: number) => {
    const ref = inputRefs[index];
    if (ref) {
      ref.focus();
      ref.select();
    }
  };

  const emitValue = (newValue: string) => {
    const clamped = newValue.slice(0, length()).toUpperCase();
    if (!isControlled()) setInternal(clamped);
    local.onValueChange?.(clamped);
    if (clamped.length === length() && clamped.split('').every((c) => c !== '')) {
      local.onComplete?.(clamped);
    }
  };

  const handleInput = (
    index: number,
    e: InputEvent & { currentTarget: HTMLInputElement },
  ) => {
    const inputValue = e.currentTarget.value;
    const char = inputValue
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(-1)
      .toUpperCase();

    // eslint-disable-next-line solid/reactivity
    const arr = Array.from({ length: length() }, (_, i) => currentValue()[i] ?? '');
    arr[index] = char;
    emitValue(arr.join(''));

    if (char && index < length() - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    const { key } = e;

    if (key === 'Backspace') {
      e.preventDefault();
      // eslint-disable-next-line solid/reactivity
      const arr = Array.from({ length: length() }, (_, i) => currentValue()[i] ?? '');

      if (arr[index]) {
        arr[index] = '';
        emitValue(arr.join(''));
      } else if (index > 0) {
        arr[index - 1] = '';
        emitValue(arr.join(''));
        focusInput(index - 1);
      }
      return;
    }

    if (key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) focusInput(index - 1);
      return;
    }

    if (key === 'ArrowRight') {
      e.preventDefault();
      if (index < length() - 1) focusInput(index + 1);
      return;
    }

    if (key === 'Delete') {
      e.preventDefault();
      // eslint-disable-next-line solid/reactivity
      const arr = Array.from({ length: length() }, (_, i) => currentValue()[i] ?? '');
      arr[index] = '';
      emitValue(arr.join(''));
      return;
    }

    if (key === 'Home') {
      e.preventDefault();
      focusInput(0);
      return;
    }

    if (key === 'End') {
      e.preventDefault();
      focusInput(length() - 1);
    }
  };

  const handlePaste = (
    index: number,
    e: ClipboardEvent & { currentTarget: HTMLInputElement },
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text/plain') ?? '';
    const filtered = pasted.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!filtered) return;

    // eslint-disable-next-line solid/reactivity
    const arr = Array.from({ length: length() }, (_, i) => currentValue()[i] ?? '');

    for (let i = 0; i < filtered.length && index + i < length(); i++) {
      arr[index + i] = filtered[i];
    }

    const newValue = arr.join('');
    emitValue(newValue);

    const nextEmpty = arr.findIndex((c, i) => i >= index && !c);
    if (nextEmpty !== -1) {
      focusInput(nextEmpty);
    } else {
      focusInput(Math.min(index + filtered.length, length() - 1));
    }
  };

  const handleFocus = (e: FocusEvent & { currentTarget: HTMLInputElement }) => {
    e.currentTarget.select();
  };

  createEffect(() => {
    if (local.autofocus && inputRefs[0]) {
      inputRefs[0].focus();
    }
  });

  return (
    <div class={theme.root.base}>
      <Show when={local.label}>
        <div class="mb-1 block">
          <Label id={labelId()} value={local.label} color={color()} />
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
        aria-label={labelId() ? undefined : a().otpInput}
        aria-labelledby={labelId()}
        aria-invalid={ariaInvalid()}
        aria-describedby={helperId()}
        aria-required={local.required}
        class={twMerge(theme.root.group, local.class)}
      >
        <Index each={chars()}>
          {(char, index) => (
            <input
              ref={(el) => {
                inputRefs[index] = el;
              }}
              type="text"
              inputMode="text"
              autocomplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={char()}
              disabled={local.disabled}
              aria-label={`${a().digit} ${index + 1} of ${length()}`}
              class={twMerge(
                theme.input.base,
                theme.input.sizes[sizing()],
                theme.input.colors[color()],
                char() && color() === 'gray' && theme.input.filled,
                local.inputClass,
              )}
              onInput={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              onFocus={handleFocus}
            />
          )}
        </Index>
      </div>

      <Show when={local.helperText}>
        <HelperText id={helperId()} content={local.helperText!} color={color()} />
      </Show>
    </div>
  );
};

export default OTPInput;
