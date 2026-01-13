import { JSX, createMemo, onCleanup, onMount, splitProps } from 'solid-js';

import TextInput, { TextInputProps } from './TextInput';

type ExtendedTextInputProps = Omit<
  TextInputProps,
  | 'type'
  | 'onBlur'
  | 'showArrows'
  | 'onArrowUp'
  | 'onArrowDown'
  | 'arrowUpLabel'
  | 'arrowDownLabel'
>;

export interface NumberInputProps extends ExtendedTextInputProps {
  /** Allow empty/null values. Defaults to true. */
  nullable?: boolean;
  /** Decimal places for float type. Defaults to 3. */
  precision?: number;
  /** Increment/decrement step amount. Defaults to 1. */
  step?: number;
  /** Show up/down arrow buttons. Defaults to false. */
  showArrows?: boolean;
  /** Allow negative number input. Defaults to false. */
  allowNegativeValues?: boolean;
  /** Number format: 'integer' or 'float'. Defaults to 'integer'. */
  type?: 'integer' | 'float';
  /** Callback with typed numeric value. Returns number or null if empty. */
  onValueChange?: (value: number | null) => void;
  /** Accessible label for increment button. Defaults to 'Increase value'. */
  arrowUpLabel?: string;
  /** Accessible label for decrement button. Defaults to 'Decrease value'. */
  arrowDownLabel?: string;
  /** Delay in ms before processing value after user stops typing. Defaults to 2000. Set to 0 to disable. */
  debounceDelay?: number;
}

const NON_ALPHANUM_KEYS = [
  ',',
  '.',
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Enter',
  'Tab',
];
const DECIMAL_SEPARATORS = [',', '.'];

const isValidNumber = (val: number | string, nullable = false, allowNegative = false) => {
  val = val.toString();
  if (!val) return false;
  const toFloat = parseFloat(val);
  if (isNaN(toFloat)) return false;
  if (toFloat === 0 && nullable) return true;
  if (allowNegative) return true;
  return toFloat > 0;
};

const NumberInput = (props: NumberInputProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'onPaste',
    'onKeyDown',
    'onInput',
    'onChange',
    'onValueChange',
    'nullable',
    'type',
    'precision',
    'step',
    'ref',
    'showArrows',
    'allowNegativeValues',
    'arrowUpLabel',
    'arrowDownLabel',
    'debounceDelay',
  ]);

  // Safe accessors for min/max with proper type handling
  const minValue = createMemo(() => {
    const min = props.min;
    if (min === undefined || min === null) return undefined;
    const parsed = typeof min === 'number' ? min : parseFloat(String(min));
    return isNaN(parsed) ? undefined : parsed;
  });

  const maxValue = createMemo(() => {
    const max = props.max;
    if (max === undefined || max === null) return undefined;
    const parsed = typeof max === 'number' ? max : parseFloat(String(max));
    return isNaN(parsed) ? undefined : parsed;
  });

  const nullable = createMemo(() => local.nullable ?? true);
  const precision = createMemo(() => local.precision ?? 3);
  const showArrows = createMemo(() => local.showArrows ?? false);
  const allowNegative = createMemo(() => local.allowNegativeValues ?? false);
  const inputType = createMemo(() => local.type ?? 'integer');
  const step = createMemo(() => {
    if (!local.step || isNaN(local.step) || local.step < 0) {
      return 1;
    }
    if (inputType() === 'integer') {
      return Math.round(local.step);
    }
    return local.step;
  });
  const debounceDelay = createMemo(() => local.debounceDelay ?? 2000);

  let inputRef: HTMLInputElement | undefined;
  let upBtnRef: HTMLButtonElement | undefined;
  let downBtnRef: HTMLButtonElement | undefined;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // Cleanup debounce timer on unmount
  onCleanup(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  /** Clamp a value within min/max bounds */
  const clampValue = (value: number): number => {
    let result = value;
    const min = minValue();
    const max = maxValue();
    if (min !== undefined && result < min) result = min;
    if (max !== undefined && result > max) result = max;
    return result;
  };

  /** Emit typed numeric value via onValueChange callback */
  const emitValue = (value: number | null): void => {
    if (typeof local.onValueChange === 'function') {
      local.onValueChange(value);
    }
  };

  /** Clear debounce timer */
  const clearDebounce = (): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = undefined;
    }
  };

  /** Process and format the current input value, emit via callbacks */
  const processValue = (): void => {
    if (!inputRef) return;

    const value = inputRef.value;

    if (!value.trim()) {
      emitValue(null);
      return;
    }

    if (isValidNumber(value, nullable(), allowNegative())) {
      const num = parseFloat(value);
      let formatted: number =
        inputType() === 'integer'
          ? Math.round(num)
          : parseFloat(num.toFixed(precision()));
      formatted = clampValue(formatted);
      const formattedStr = formatted.toString();
      inputRef.value = formattedStr;

      // Emit typed numeric value
      emitValue(formatted);

      if (typeof local.onChange === 'function') {
        const syntheticEvent = {
          currentTarget: inputRef,
          target: { ...inputRef, value: formattedStr },
        };
        local.onChange(syntheticEvent as Parameters<typeof local.onChange>[0]);
      }
    } else {
      // Invalid input - reset to min or default
      const min = minValue();
      let fallbackValue: number;
      if (min !== undefined) {
        fallbackValue = min;
      } else if (inputType() === 'integer') {
        fallbackValue = 1;
      } else {
        fallbackValue = step();
      }
      const fallbackStr = fallbackValue.toString();
      inputRef.value = fallbackStr;

      // Emit typed numeric value
      emitValue(fallbackValue);

      if (typeof local.onChange === 'function') {
        const syntheticEvent = {
          currentTarget: inputRef,
          target: { ...inputRef, value: fallbackStr },
        };
        local.onChange(syntheticEvent as Parameters<typeof local.onChange>[0]);
      }
    }
  };

  /** Schedule debounced value processing */
  const scheduleDebouncedProcess = (): void => {
    clearDebounce();
    const delay = debounceDelay();
    if (delay > 0) {
      debounceTimer = setTimeout(() => {
        processValue();
      }, delay);
    }
  };

  onMount(() => {
    if (local.ref) {
      if (typeof local.ref === 'function') {
        local.ref(inputRef as HTMLInputElement);
      } else if (typeof local.ref === 'object' && 'current' in local.ref) {
        (local.ref as { current: HTMLInputElement | undefined }).current = inputRef;
      }
    }
  });

  const onBlur = (
    _e: FocusEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    // Clear any pending debounce - we'll process immediately on blur
    clearDebounce();
    processValue();
  };

  const incrementValue = () => {
    if (!inputRef) return;
    setButtonActive(upBtnRef, true);

    const min = minValue();
    const currentVal = parseFloat(inputRef.value || (min !== undefined ? String(min) : '0'));
    let newVal: number;

    if (!isValidNumber(currentVal, nullable(), allowNegative())) {
      newVal = step();
    } else {
      newVal = currentVal + step();
    }

    if (!allowNegative() && newVal < 0) newVal = 0;
    newVal = clampValue(newVal);

    // Format based on type
    if (inputType() === 'integer') {
      newVal = Math.round(newVal);
    }

    inputRef.value = newVal.toString();
    emitValue(newVal);

    const event = new Event('change', { bubbles: true });
    inputRef.dispatchEvent(event);
  };

  const decrementValue = () => {
    if (!inputRef) return;
    setButtonActive(downBtnRef, true);

    const min = minValue();
    const currentVal = parseFloat(inputRef.value || (min !== undefined ? String(min) : '0'));

    if (!isValidNumber(currentVal, nullable(), allowNegative())) {
      const fallback = allowNegative() ? -step() : null;
      inputRef.value = fallback !== null ? fallback.toString() : '';
      emitValue(fallback);
      const event = new Event('change', { bubbles: true });
      inputRef.dispatchEvent(event);
      return;
    }

    let newVal = currentVal - step();
    if (!allowNegative() && newVal < 0) newVal = 0;
    newVal = clampValue(newVal);

    // Format based on type
    if (inputType() === 'integer') {
      newVal = Math.round(newVal);
    }

    inputRef.value = newVal.toString();
    emitValue(newVal);

    const event = new Event('change', { bubbles: true });
    inputRef.dispatchEvent(event);
  };

  const setButtonActive = (btn: HTMLButtonElement | undefined, active: boolean) => {
    if (!btn) return;
    if (active) {
      btn.classList.add('bg-gray-200', 'dark:bg-gray-600');
    } else {
      btn.classList.remove('bg-gray-200', 'dark:bg-gray-600');
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const { key, ctrlKey, metaKey } = e;

    // Allow copy/paste/cut/select-all shortcuts (Ctrl on Windows/Linux, Cmd on Mac)
    if (ctrlKey || metaKey) {
      if (typeof local.onKeyDown === 'function') {
        local.onKeyDown(e);
      }
      return;
    }

    if (key === 'ArrowUp') {
      e.preventDefault();
      incrementValue();
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      decrementValue();
      return;
    }

    if (key === '-') {
      if (!allowNegative()) {
        e.preventDefault();
        return;
      }
      const { selectionStart, value } = e.currentTarget;
      if (selectionStart !== 0 || value.includes('-')) {
        e.preventDefault();
      }
      return;
    }

    if (inputType() === 'integer' && DECIMAL_SEPARATORS.includes(key)) {
      e.preventDefault();
      return;
    }

    if (
      inputType() === 'float' &&
      DECIMAL_SEPARATORS.includes(key) &&
      DECIMAL_SEPARATORS.some((sep) => e.currentTarget.value.includes(sep))
    ) {
      e.preventDefault();
      return;
    }

    if (!isNaN(parseInt(key, 10)) || NON_ALPHANUM_KEYS.includes(key)) {
      if (typeof local.onKeyDown === 'function') {
        local.onKeyDown(e);
      }
      return;
    }

    e.preventDefault();
  };

  const handleKeyUp = (
    e: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const { key } = e;
    if (key === 'ArrowUp' && upBtnRef) {
      setButtonActive(upBtnRef, false);
    }
    if (key === 'ArrowDown' && downBtnRef) {
      setButtonActive(downBtnRef, false);
    }
  };

  const handleInput = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const input = e.currentTarget;
    let newValue = input.value;

    if (inputType() === 'float') {
      newValue = newValue.replace(/,/g, '.');
    } else {
      newValue = newValue.replace(/[.,].*/g, '');
    }

    if (allowNegative()) {
      newValue = newValue.replace(/(?!^)-/g, '');
    } else {
      newValue = newValue.replace(/-/g, '');
    }

    if (newValue !== input.value) {
      input.value = newValue;
    }

    if (typeof local.onInput === 'function') {
      local.onInput(e);
    }

    // Schedule debounced processing after user stops typing
    scheduleDebouncedProcess();
  };

  const handlePaste = (
    e: ClipboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const clipboardValue = e.clipboardData?.getData('Text');
    if (clipboardValue) {
      let val = clipboardValue;

      if (inputType() === 'float') {
        val = val.replace(/,/g, '.');
      } else {
        val = val.replace(/[.,].*/g, '');
      }

      if (allowNegative()) {
        val = val.replace(/(?!^)-/g, '');
      } else {
        val = val.replace(/-/g, '');
      }

      if (isNaN(parseFloat(val))) {
        e.preventDefault();
        return;
      }
    }

    // Allow paste event to continue processing

    if (typeof local.onPaste === 'function') {
      local.onPaste(e);
    }
  };

  const handleArrowUp = (e: MouseEvent) => {
    e.preventDefault();
    incrementValue();
  };

  const handleArrowDown = (e: MouseEvent) => {
    e.preventDefault();
    decrementValue();
  };

  const handleArrowUpMouseUp = () => setButtonActive(upBtnRef, false);

  const handleArrowDownMouseUp = () => setButtonActive(downBtnRef, false);

  return (
    <TextInput
      {...inputProps}
      ref={inputRef}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={onBlur}
      onInput={handleInput}
      type="text"
      inputMode={inputType() === 'integer' ? 'numeric' : 'decimal'}
      showArrows={showArrows()}
      onArrowUp={handleArrowUp}
      onArrowDown={handleArrowDown}
      onArrowUpMouseUp={handleArrowUpMouseUp}
      onArrowDownMouseUp={handleArrowDownMouseUp}
      upBtnRef={(el) => (upBtnRef = el)}
      downBtnRef={(el) => (downBtnRef = el)}
      arrowUpLabel={local.arrowUpLabel || 'Increase value'}
      arrowDownLabel={local.arrowDownLabel || 'Decrease value'}
    />
  );
};

export default NumberInput;
