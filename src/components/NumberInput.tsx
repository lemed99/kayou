import { createMemo, onMount, splitProps } from 'solid-js';

import TextInput, { TextInputProps } from './TextInput';

type ExtendedTextInputProps = Omit<
  TextInputProps,
  'type' | 'onBlur' | 'showArrows' | 'onArrowUp' | 'onArrowDown'
>;

export interface NumberInputProps extends ExtendedTextInputProps {
  nullable?: boolean;
  precision?: number;
  step?: number;
  showArrows?: boolean;
  allowNegativeValues?: boolean;
  type?: 'integer' | 'float';
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

const NumberInput = (props: NumberInputProps) => {
  const [local, inputProps] = splitProps(props, [
    'onPaste',
    'onKeyDown',
    'onInput',
    'onChange',
    'nullable',
    'type',
    'precision',
    'step',
    'ref',
    'showArrows',
    'allowNegativeValues',
  ]);

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

  let inputRef: HTMLInputElement | undefined;
  let upBtnRef: HTMLButtonElement | undefined;
  let downBtnRef: HTMLButtonElement | undefined;

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
    e: FocusEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => {
    const value = e.target.value;

    if (!value.trim()) return;

    if (isValidNumber(value, nullable(), allowNegative())) {
      const num = parseFloat(value);
      let formatted: number | string =
        inputType() === 'integer'
          ? Math.round(num)
          : parseFloat(num.toFixed(precision()));
      if (formatted < (props.min as number)) formatted = props.min as number;
      if (formatted > (props.max as number)) formatted = props.max as number;
      formatted = formatted.toString();
      e.target.value = formatted;

      if (typeof local.onChange === 'function') {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: formatted },
        };
        local.onChange(syntheticEvent);
      }
    } else {
      let value = '';
      if (props.min) value = props.min as string;
      else if (inputType() === 'integer') {
        value = '1';
      } else {
        value = props.step?.toString() || '';
      }

      if (typeof local.onChange === 'function') {
        const syntheticEvent = { ...e, target: { ...e.target, value: value } };
        local.onChange(syntheticEvent);
      }
    }
  };

  const incrementValue = () => {
    if (!inputRef) return;
    setButtonActive(upBtnRef, true);
    const currentVal = parseFloat(inputRef.value || (props.min as string));
    let newVal: number;
    if (!isValidNumber(currentVal, nullable(), allowNegative())) {
      newVal = step();
    } else {
      newVal = currentVal + step();
    }
    if (!allowNegative() && newVal < 0) newVal = 0;
    if (newVal > (props.max as number)) newVal = props.max as number;
    inputRef.value = newVal.toString();
    const event = new Event('change', { bubbles: true });
    inputRef.dispatchEvent(event);
  };

  const decrementValue = () => {
    if (!inputRef) return;
    setButtonActive(downBtnRef, true);
    const currentVal = parseFloat(inputRef.value || (props.min as string));
    if (!isValidNumber(currentVal, nullable(), allowNegative())) {
      inputRef.value = allowNegative() ? (-step()).toString() : '';
      const event = new Event('change', { bubbles: true });
      inputRef.dispatchEvent(event);
      return;
    }
    let newVal = currentVal - step();
    if (!allowNegative() && newVal < 0) newVal = 0;
    if (newVal < (props.min as number)) newVal = props.min as number;
    inputRef.value = newVal.toString();
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
    const { key, ctrlKey } = e;

    if (ctrlKey) {
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

    // Gerer le paste apres, ctrl + v, etc...

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
      showArrows={showArrows()}
      onArrowUp={handleArrowUp}
      onArrowDown={handleArrowDown}
      onArrowUpMouseUp={handleArrowUpMouseUp}
      onArrowDownMouseUp={handleArrowDownMouseUp}
      upBtnRef={(el) => (upBtnRef = el)}
      downBtnRef={(el) => (downBtnRef = el)}
    />
  );
};

export default NumberInput;
