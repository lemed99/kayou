import { JSX, createMemo, createSignal, splitProps } from 'solid-js';

import TextInput, { TextInputProps } from './TextInput';

type ExtendedTextInputProps = Omit<
  TextInputProps,
  | 'type'
  | 'onChange'
  | 'onBlur'
  | 'showArrows'
  | 'onArrowUp'
  | 'onArrowDown'
  | 'arrowUpLabel'
  | 'arrowDownLabel'
>;

export interface NumberInputProps extends ExtendedTextInputProps {
  /** Allow zero as a valid value. Defaults to true. */
  allowZero?: boolean;
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
  /** Wrap around when stepping past min/max. Requires both min and max to be set. Defaults to false. */
  wrap?: boolean;
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

const isValidNumber = (
  val: number | string,
  allowZero = false,
  allowNegative = false,
) => {
  val = val.toString();
  if (!val) return false;
  const toFloat = parseFloat(val);
  if (isNaN(toFloat)) return false;
  if (toFloat === 0 && allowZero) return true;
  if (allowNegative) return true;
  return toFloat > 0;
};

const NumberInput = (props: NumberInputProps): JSX.Element => {
  const [local, inputProps] = splitProps(props, [
    'onPaste',
    'onKeyDown',
    'onInput',
    'onValueChange',
    'allowZero',
    'type',
    'precision',
    'step',
    'ref',
    'showArrows',
    'allowNegativeValues',
    'arrowUpLabel',
    'arrowDownLabel',
    'wrap',
    'value',
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

  const allowZero = createMemo(() => local.allowZero ?? true);
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
  const [currentValue, setCurrentValue] = createSignal<number | undefined>(undefined);

  let inputRef: HTMLInputElement | undefined;
  let upBtnRef: HTMLButtonElement | undefined;
  let downBtnRef: HTMLButtonElement | undefined;

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
    setCurrentValue(value ?? undefined);
    if (typeof local.onValueChange === 'function') {
      local.onValueChange(value);
    }
  };

  /**
   * Re-sync the input's DOM value with the parent's `value` prop.
   * Needed because the parent may format the display value (e.g. zero-padding)
   * and if the numeric value didn't change, SolidJS won't re-apply the prop.
   */
  const syncFromProp = () => {
    const propValue = local.value;
    queueMicrotask(() => {
      if (inputRef && propValue !== undefined) {
        const propStr = String(propValue);
        if (inputRef.value !== propStr) {
          inputRef.value = propStr;
        }
      }
    });
  };

  /** Process and format the current input value, emit via callbacks */
  const processValue = (): void => {
    if (!inputRef) return;

    const value = inputRef.value;

    if (!value.trim()) {
      emitValue(null);
      syncFromProp();
      return;
    }

    if (isValidNumber(value, allowZero(), allowNegative())) {
      const num = parseFloat(value);
      let formatted: number =
        inputType() === 'integer'
          ? Math.round(num)
          : parseFloat(num.toFixed(precision()));
      formatted = clampValue(formatted);
      inputRef.value = formatted.toString();

      emitValue(formatted);
      syncFromProp();
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
      inputRef.value = fallbackValue.toString();

      emitValue(fallbackValue);
      syncFromProp();
    }
  };

  const setInputRef = (el: HTMLInputElement) => {
    inputRef = el;
    if (typeof local.ref === 'function') {
      local.ref(el);
    } else if (typeof local.ref === 'object' && local.ref && 'current' in local.ref) {
      (local.ref as { current: HTMLInputElement | undefined }).current = el;
    }
  };

  const onBlur = () => {
    processValue();
  };

  const incrementValue = () => {
    if (!inputRef) return;
    setButtonActive(upBtnRef, true);

    const min = minValue();
    const max = maxValue();
    const currentVal = parseFloat(
      inputRef.value || (min !== undefined ? String(min) : '0'),
    );
    let newVal: number;

    if (!isValidNumber(currentVal, allowZero(), allowNegative())) {
      newVal = step();
    } else {
      newVal = currentVal + step();
    }

    if (!allowNegative() && newVal < 0) newVal = 0;

    if (local.wrap && min !== undefined && max !== undefined && newVal > max) {
      newVal = min;
    } else {
      newVal = clampValue(newVal);
    }

    // Format based on type
    if (inputType() === 'integer') {
      newVal = Math.round(newVal);
    }

    inputRef.value = newVal.toString();
    emitValue(newVal);
    syncFromProp();
  };

  const decrementValue = () => {
    if (!inputRef) return;
    setButtonActive(downBtnRef, true);

    const min = minValue();
    const max = maxValue();
    const currentVal = parseFloat(
      inputRef.value || (min !== undefined ? String(min) : '0'),
    );

    if (!isValidNumber(currentVal, allowZero(), allowNegative())) {
      const fallback = allowNegative() ? -step() : null;
      inputRef.value = fallback !== null ? fallback.toString() : '';
      emitValue(fallback);
      return;
    }

    let newVal = currentVal - step();

    if (local.wrap && min !== undefined && max !== undefined && newVal < min) {
      // Wrap to the highest step-aligned value within range
      newVal = min + Math.floor((max - min) / step()) * step();
    } else {
      if (!allowNegative() && newVal < 0) newVal = 0;
      newVal = clampValue(newVal);
    }

    // Format based on type
    if (inputType() === 'integer') {
      newVal = Math.round(newVal);
    }

    inputRef.value = newVal.toString();
    emitValue(newVal);
    syncFromProp();
  };

  const setButtonActive = (btn: HTMLButtonElement | undefined, active: boolean) => {
    if (!btn) return;
    if (active) {
      btn.dataset.active = '';
    } else {
      delete btn.dataset.active;
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    // Always forward to consumer first (Escape, Enter, etc.)
    if (typeof local.onKeyDown === 'function') {
      local.onKeyDown(e);
    }

    // If consumer already handled it, stop
    if (e.defaultPrevented) return;

    const { key, ctrlKey, metaKey } = e;

    // Allow copy/paste/cut/select-all shortcuts
    if (ctrlKey || metaKey) return;

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

    // Allow digits and navigation keys, block everything else
    if (isNaN(parseInt(key, 10)) && !NON_ALPHANUM_KEYS.includes(key)) {
      e.preventDefault();
    }
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
  };

  const handlePaste = (
    e: ClipboardEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => {
    const clipboardValue = e.clipboardData?.getData('Text');
    if (!clipboardValue) return;

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

    // Prevent native paste and insert sanitized value instead
    e.preventDefault();
    if (inputRef) {
      const start = inputRef.selectionStart ?? 0;
      const end = inputRef.selectionEnd ?? 0;
      const before = inputRef.value.slice(0, start);
      const after = inputRef.value.slice(end);
      inputRef.value = before + val + after;
      const newPos = start + val.length;
      inputRef.setSelectionRange(newPos, newPos);
    }

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
      value={local.value}
      ref={setInputRef}
      role="spinbutton"
      aria-valuemin={minValue()}
      aria-valuemax={maxValue()}
      aria-valuenow={currentValue()}
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
      arrowUpLabel={local.arrowUpLabel}
      arrowDownLabel={local.arrowDownLabel}
    />
  );
};

export default NumberInput;
